import { detectIntent, handleIntent } from "@/../server/utils/intentHandler.js";
import { AI_CONFIG } from "@/../server/config/ai.js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json({ reply: "No message provided." }, { status: 400 });
    }

    // 1. Specialized Command Handling & Intent Detection
    const intent = detectIntent(message);
    const commandReply = await handleIntent(intent, message);

    if (commandReply) {
      return Response.json({ reply: commandReply });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY is not set!");
      return Response.json({ reply: "API key not configured on server." }, { status: 500 });
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
      return Response.json(
        { reply: `Groq error: ${data.error.message}` },
        { status: 502 }
      );
    }

    const reply = data.choices?.[0]?.message?.content || "No response from Groq";

    return Response.json({ reply });
  } catch (err: any) {
    console.error("Server error:", err);
    return Response.json({ reply: "Backend AI error: " + err.message }, { status: 500 });
  }
}
