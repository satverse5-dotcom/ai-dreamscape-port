import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
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
        model: "llama-3.1-8b-instant",
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