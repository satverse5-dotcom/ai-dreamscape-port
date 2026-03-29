import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const execAsync = promisify(exec);
const PROJECT_ROOT = process.cwd();
const resumePath = path.resolve(PROJECT_ROOT, "public/resume.pdf");

export const runtime = "nodejs";

// POST /api/resume/generate — regenerate the resume PDF
export async function POST() {
  try {
    const scriptPath = path.resolve(PROJECT_ROOT, "scripts/generate-resume.js");
    const { stdout, stderr } = await execAsync(`node "${scriptPath}"`);

    if (stderr) {
      console.warn("Resume generation warning:", stderr);
    }
    console.log("Resume generated:", stdout);

    return Response.json({
      success: true,
      message: "Resume regenerated successfully.",
      downloadUrl: "/api/resume/download",
    });
  } catch (error: any) {
    console.error("Resume generation error:", error.message);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/resume/download — stream PDF directly
export async function GET() {
  if (!fs.existsSync(resumePath)) {
    return Response.json(
      { error: "Resume PDF not found. Post to /api/resume/generate first." },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(resumePath);

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Satyam_Kumar_Karn_Resume.pdf"',
    },
  });
}
