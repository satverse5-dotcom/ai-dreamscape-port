import express from "express";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resumePath = path.resolve(__dirname, "../../public/resume.pdf");

// POST /api/resume/generate — regenerate the resume PDF
router.post("/generate", (req, res) => {
  const scriptPath = path.resolve(__dirname, "../../scripts/generate-resume.js");

  exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Resume generation error:", stderr);
      return res.status(500).json({ success: false, error: stderr });
    }
    console.log("Resume generated:", stdout);
    res.json({
      success: true,
      message: "Resume regenerated successfully.",
      downloadUrl: "/resume.pdf",
    });
  });
});

// GET /api/resume/download — stream PDF directly
router.get("/download", (req, res) => {
  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({ error: "Resume PDF not found. Run /api/resume/generate first." });
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="Satyam_Kumar_Karn_Resume.pdf"');
  fs.createReadStream(resumePath).pipe(res);
});

export default router;
