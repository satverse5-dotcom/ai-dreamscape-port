import mammoth from "mammoth";
import PDFParser from "pdf-parse";

import { parseResume } from "@/../server/agents/resumeParser.js";
import { generatePortfolioContent } from "@/../server/agents/portfolioGenerator.js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("resumes") as File[];

    if (!files || files.length === 0) {
      return Response.json({ error: "No resume files uploaded." }, { status: 400 });
    }

    let combinedResumeText = "";

    for (const file of files) {
      let fileText = "";
      const fileName = file.name.toLowerCase();
      const buffer = Buffer.from(await file.arrayBuffer());

      if (fileName.endsWith(".pdf")) {
        const data = await PDFParser(buffer);
        fileText = data.text;
      } else if (fileName.endsWith(".docx")) {
        const docxData = await mammoth.extractRawText({ buffer: buffer });
        fileText = docxData.value;
      } else {
        console.warn(`Skipping unsupported file format: ${fileName}`);
        continue;
      }

      if (fileText && fileText.trim().length > 0) {
        combinedResumeText += `\n--- Content from ${file.name} ---\n${fileText}\n`;
      }
    }

    if (!combinedResumeText || combinedResumeText.trim().length === 0) {
      return Response.json(
        { error: "Could not extract text from any of the uploaded documents." },
        { status: 400 }
      );
    }

    // 1. Parse Combined Resume into structured JSON
    const parsedResume = await parseResume(combinedResumeText);

    // 2. Generate Portfolio Content from structured resume
    const portfolioContent = await generatePortfolioContent(parsedResume);

    // Return the generated content for preview
    return Response.json({
      success: true,
      message: "Portfolio content generated from multiple files! Please review the preview.",
      parsedResume: parsedResume,
      portfolioContent: portfolioContent,
    });
  } catch (err: any) {
    console.error("Pipeline Error:", err);
    return Response.json(
      { error: "Portfolio generation failed: " + err.message },
      { status: 500 }
    );
  }
}
