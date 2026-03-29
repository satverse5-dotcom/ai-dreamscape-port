import mammoth from "mammoth";
import PDFParser from "pdf-parse";

import { parseResume } from "@/../server/agents/resumeParser.js";
import { generatePortfolioContent } from "@/../server/agents/portfolioGenerator.js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("resumes") as File[];

    console.log(`[Upload] Received ${files.length} files`);

    if (!files || files.length === 0) {
      return Response.json({ error: "No resume files uploaded." }, { status: 400 });
    }

    let combinedResumeText = "";

    for (const file of files) {
      // Vercel/Serverless payload limit is ~4.5MB total, so we check individual files too.
      if (file.size > 5 * 1024 * 1024) {
        return Response.json({ error: `File ${file.name} is too large. Max size is 5MB.` }, { status: 400 });
      }

      console.log(`[Upload] Processing ${file.name} (${file.size} bytes)`);
      
      let fileText = "";
      const fileName = file.name.toLowerCase();
      const buffer = Buffer.from(await file.arrayBuffer());

      try {
        if (fileName.endsWith(".pdf")) {
          const data = await PDFParser(buffer);
          fileText = data.text;
          console.log(`[Upload] PDF parsing successful for ${file.name}`);
        } else if (fileName.endsWith(".docx")) {
          const docxData = await mammoth.extractRawText({ buffer: buffer });
          fileText = docxData.value;
          console.log(`[Upload] DOCX parsing successful for ${file.name}`);
        } else {
          console.warn(`[Upload] Skipping unsupported file format: ${fileName}`);
          continue;
        }
      } catch (parseErr: any) {
        console.error(`[Upload] Error parsing ${file.name}:`, parseErr);
        return Response.json({ error: `Failed to parse ${file.name}: ${parseErr.message}` }, { status: 500 });
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
