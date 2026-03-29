import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

import { parseResume } from "../agents/resumeParser.js";
import { generatePortfolioContent } from "../agents/portfolioGenerator.js";
import { generatePortfolioTemplate } from "../agents/templateGenerator.js";
import Portfolio from "../models/Portfolio.js";
import { detectIntent, handleIntent } from "../utils/intentHandler.js";
import { AI_CONFIG } from "../config/ai.js";

const router = express.Router();

// Configure Multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// --- 2. Resume Upload Route ---
router.post("/upload-resume", upload.array("resumes"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No resume files uploaded." });
    }

    let combinedResumeText = "";

    for (const file of req.files) {
      let fileText = "";
      const fileName = file.originalname.toLowerCase();

      if (fileName.endsWith(".pdf")) {
        const parser = new PDFParse({ data: file.buffer });
        const textResult = await parser.getText();
        fileText = textResult.text;
      } else if (fileName.endsWith(".docx")) {
        const docxData = await mammoth.extractRawText({ buffer: file.buffer });
        fileText = docxData.value;
      } else {
        console.warn(`Skipping unsupported file format: ${fileName}`);
        continue;
      }

      if (fileText && fileText.trim().length > 0) {
        combinedResumeText += `\n--- Content from ${file.originalname} ---\n${fileText}\n`;
      }
    }

    if (!combinedResumeText || combinedResumeText.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from any of the uploaded documents." });
    }

    // 1. Parse Combined Resume into structured JSON
    const parsedResume = await parseResume(combinedResumeText);

    // 2. Generate Portfolio Content from structured resume
    const portfolioContent = await generatePortfolioContent(parsedResume);

    // Return the generated content for preview
    res.json({
      success: true,
      message: "Portfolio content generated from multiple files! Please review the preview.",
      parsedResume: parsedResume,
      portfolioContent: portfolioContent,
    });
  } catch (err) {
    console.error("Pipeline Error:", err);
    res.status(500).json({ error: "Portfolio generation failed: " + err.message });
  }
});

// --- 2.5 Deploy Portfolio Route ---
router.post("/deploy-portfolio", async (req, res) => {
  try {
    const { name, portfolioContent, resumeData } = req.body;

    if (!portfolioContent) {
      return res.status(400).json({ error: "Missing portfolio content for deployment." });
    }

    // 3. Generate Portfolio Template files (React Components + Data)
    const templateResult = await generatePortfolioTemplate({
      name: name || "Developer",
      ...portfolioContent
    });

    // 4. Save to Database
    const newPortfolio = new Portfolio({
      user: name || "Anonymous",
      resumeData: resumeData || {},
      portfolioContent: portfolioContent,
      portfolioId: templateResult.portfolioId,
    });

    await newPortfolio.save();

    res.json({
      success: true,
      message: "Portfolio deployed and saved to database successfully!",
      template: templateResult
    });
  } catch (err) {
    console.error("Deployment Error:", err);
    res.status(500).json({ error: "Portfolio deployment failed: " + err.message });
  }
});

// --- 3. Chatbot Route (with Intent Detection) ---
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
    }

    // 1. Specialized Command Handling & Intent Detection
    const intent = detectIntent(message);
    const commandReply = await handleIntent(intent, message);

    if (commandReply) {
      return res.json({ reply: commandReply });
    }


    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY is not set!");
      return res.status(500).json({ reply: "API key not configured on server." });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    // Handle API-level errors
    if (data.error) {
      console.error("Groq API error:", data.error);
      return res.status(502).json({
        reply: `Groq error: ${data.error.message}`,
      });
    }

    const reply =
      data.choices?.[0]?.message?.content || "No response from Groq";

    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Backend AI error: " + err.message });
  }
});

export default router;