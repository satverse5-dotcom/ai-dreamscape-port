import { exec } from "child_process";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);
const PROJECT_ROOT = process.cwd();

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { githubToken, vercelToken } = await req.json();

    if (!githubToken || !vercelToken) {
      return Response.json(
        { success: false, error: "Both GitHub PAT and Vercel Token are required." },
        { status: 400 }
      );
    }

    // Step 1 — Regenerate the resume PDF fresh before deploying
    try {
      const scriptPath = path.join(PROJECT_ROOT, "scripts/generate-resume.js");
      await execAsync(`node "${scriptPath}"`);
    } catch (err: any) {
      throw new Error(`PDF generation failed: ${err.stderr || err.message}`);
    }

    // Step 2 — Get the GitHub remote URL to extract owner/repo
    let owner = "";
    let repo = "";
    try {
      const { stdout: remoteUrl } = await execAsync("git remote get-url origin", {
        cwd: PROJECT_ROOT,
      });
      const trimmedRemoteUrl = remoteUrl.trim();
      const match = trimmedRemoteUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
      if (!match) {
        return Response.json(
          { success: false, error: "Could not parse GitHub repo from remote URL: " + trimmedRemoteUrl },
          { status: 400 }
        );
      }
      [, owner, repo] = match;
    } catch (err: any) {
      throw new Error("Could not get git remote URL: " + err.message);
    }

    // Step 3 — Stage and commit changes (resume PDF + new route code)
    try {
      await execAsync(`git config user.email "bot@nexusai.dev"`, { cwd: PROJECT_ROOT });
      await execAsync(`git config user.name "NexusAI Bot"`, { cwd: PROJECT_ROOT });
      await execAsync(
        `git add public/resume.pdf app/api/resume/route.ts scripts/generate-resume.js server/routes/resume.js server/index.js src/components/Hero.tsx package.json`,
        { cwd: PROJECT_ROOT }
      );
      await execAsync(
        `git commit -m "feat: add auto-generated ATS resume + download API [NexusAI]" --allow-empty`,
        { cwd: PROJECT_ROOT }
      );
    } catch (err: any) {
      console.warn("Git commit warning:", err.stderr || err.message);
    }

    // Step 4 — Push to GitHub using the PAT for authentication
    try {
      const pushUrl = `https://${githubToken}@github.com/${owner}/${repo}.git`;
      await execAsync(`git push "${pushUrl}" HEAD:main --force`, { cwd: PROJECT_ROOT });
    } catch (err: any) {
      throw new Error(`Git push failed: ${err.stderr || err.message}`);
    }

    // Step 5 — Trigger Vercel deployment via API
    const vercelProjectsRes = await fetch("https://api.vercel.com/v9/projects", {
      headers: { Authorization: `Bearer ${vercelToken}` },
    });
    const projectsData = await vercelProjectsRes.json();

    if (!vercelProjectsRes.ok) {
      return Response.json(
        {
          success: false,
          error: `Vercel API error: ${projectsData.error?.message || JSON.stringify(projectsData)}`,
        },
        { status: 400 }
      );
    }

    const projects = projectsData.projects || [];
    const matchedProject = projects.find(
      (p: any) => p.name === repo || p.link?.repo === `${owner}/${repo}`
    );

    if (!matchedProject) {
      return Response.json({
        success: true,
        message: `✅ Code pushed to GitHub! Vercel will auto-deploy via its GitHub integration.`,
        githubRepo: `https://github.com/${owner}/${repo}`,
        deploymentNote: "Vercel deployment triggered automatically via GitHub push.",
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
      return Response.json({
        success: true,
        message: `✅ Code pushed to GitHub! Vercel is auto-deploying via the GitHub integration.`,
        githubRepo: `https://github.com/${owner}/${repo}`,
        deployApiNote: deployData.error?.message,
      });
    }

    return Response.json({
      success: true,
      message: `🚀 Deployed successfully!`,
      githubRepo: `https://github.com/${owner}/${repo}`,
      vercelDeploymentUrl: `https://${deployData.url}`,
      deploymentId: deployData.id,
      readyState: deployData.readyState,
    });
  } catch (err: any) {
    console.error("Deploy error:", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
