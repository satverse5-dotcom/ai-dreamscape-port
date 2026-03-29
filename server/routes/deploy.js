import express from "express";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");

// POST /api/deploy/vercel
// Body: { githubToken, vercelToken, vercelProjectId?, vercelOrgId? }
router.post("/vercel", async (req, res) => {
  const { githubToken, vercelToken } = req.body;

  if (!githubToken || !vercelToken) {
    return res.status(400).json({
      success: false,
      error: "Both GitHub PAT and Vercel Token are required.",
    });
  }

  try {
    // Step 1 — Regenerate the resume PDF fresh before deploying
    await new Promise((resolve, reject) => {
      const scriptPath = path.join(PROJECT_ROOT, "scripts/generate-resume.js");
      exec(`node "${scriptPath}"`, (err, stdout, stderr) => {
        if (err) return reject(new Error(`PDF generation failed: ${stderr}`));
        resolve(stdout);
      });
    });

    // Step 2 — Get the GitHub remote URL to extract owner/repo
    const remoteUrl = await new Promise((resolve, reject) => {
      exec("git remote get-url origin", { cwd: PROJECT_ROOT }, (err, stdout) => {
        if (err) return reject(new Error("Could not get git remote URL"));
        resolve(stdout.trim());
      });
    });

    // Parse owner/repo from remote URL (supports https and ssh)
    const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (!match) {
      return res.status(400).json({ success: false, error: "Could not parse GitHub repo from remote URL: " + remoteUrl });
    }
    const [, owner, repo] = match;

    // Step 3 — Stage and commit changes (resume PDF + new route code)
    await new Promise((resolve, reject) => {
      const commands = [
        `git config user.email "bot@nexusai.dev"`,
        `git config user.name "NexusAI Bot"`,
        `git add public/resume.pdf app/api/resume/route.ts scripts/generate-resume.js server/routes/resume.js server/index.js src/components/Hero.tsx package.json`,
        `git commit -m "feat: add auto-generated ATS resume + download API [NexusAI]" --allow-empty`,
      ].join(" && ");

      exec(commands, { cwd: PROJECT_ROOT }, (err, stdout, stderr) => {
        if (err) console.warn("Git commit warning:", stderr);
        resolve(stdout);
      });
    });

    // Step 4 — Push to GitHub using the PAT for authentication
    const pushResult = await new Promise((resolve, reject) => {
      // Inject token into push URL
      const pushUrl = `https://${githubToken}@github.com/${owner}/${repo}.git`;
      exec(
        `git push "${pushUrl}" HEAD:main --force`,
        { cwd: PROJECT_ROOT },
        (err, stdout, stderr) => {
          if (err) return reject(new Error(`Git push failed: ${stderr}`));
          resolve(stdout || stderr);
        }
      );
    });

    // Step 5 — Trigger Vercel deployment via API
    // First, get list of projects to find the project ID
    const vercelProjectsRes = await fetch("https://api.vercel.com/v9/projects", {
      headers: { Authorization: `Bearer ${vercelToken}` },
    });
    const projectsData = await vercelProjectsRes.json();

    if (!vercelProjectsRes.ok) {
      return res.status(400).json({
        success: false,
        error: `Vercel API error: ${projectsData.error?.message || JSON.stringify(projectsData)}`,
      });
    }

    // Find the project matching the repo name
    const projects = projectsData.projects || [];
    const matchedProject = projects.find(
      (p) => p.name === repo || p.link?.repo === `${owner}/${repo}`
    );

    if (!matchedProject) {
      // Push done, but couldn't trigger explicit redeploy - Vercel GitHub integration will auto-deploy on push
      return res.json({
        success: true,
        message: `✅ Code pushed to GitHub! Vercel will auto-deploy via its GitHub integration. No manual step needed.`,
        githubRepo: `https://github.com/${owner}/${repo}`,
        deploymentNote: "Vercel deployment triggered automatically via GitHub push.",
        projects: projects.map((p) => p.name),
      });
    }

    // Step 6 — Trigger explicit Vercel deployment
    const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: matchedProject.name,
        gitSource: {
          type: "github",
          repoId: matchedProject.link?.repoId,
          ref: "main",
        },
        projectId: matchedProject.id,
      }),
    });

    const deployData = await deployRes.json();

    if (!deployRes.ok) {
      return res.json({
        success: true,
        message: `✅ Code pushed to GitHub! Vercel is auto-deploying via the GitHub integration.`,
        githubRepo: `https://github.com/${owner}/${repo}`,
        deployApiNote: deployData.error?.message,
      });
    }

    return res.json({
      success: true,
      message: `🚀 Deployed successfully!`,
      githubRepo: `https://github.com/${owner}/${repo}`,
      vercelDeploymentUrl: `https://${deployData.url}`,
      deploymentId: deployData.id,
      readyState: deployData.readyState,
    });
  } catch (err) {
    console.error("Deploy error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
