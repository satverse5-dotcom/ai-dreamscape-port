import { AI_CONFIG } from "../config/ai.js";

export async function improveResume(resumeText) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set!");
    }

    const prompt = `
    You are an expert Career Coach and Resume Specialist.
    Review the following resume text and provide 5 highly actionable, specific tips to improve its impact, readability, and ATS compatibility.
    
    Resume Text:
    ${resumeText}

    Format your response as a concise bulleted list. Keep it professional and encouraging.
  `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: AI_CONFIG.model,
            messages: [{ role: "user", content: prompt }],
            temperature: AI_CONFIG.temperature.balanced,
        }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return data.choices?.[0]?.message?.content || "Could not generate resume tips.";
}

export async function suggestProjects(skills) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set!");
    }

    const prompt = `
    You are an expert Technical Mentor.
    Based on the following technical skills, suggest 3 unique and impressive project ideas that would help a developer stand out in their portfolio.
    
    Skills:
    ${skills.join(", ")}

    For each project, provide:
    1. A catchy name.
    2. A 2-sentence description of what it does and why it's valuable.

    Format your response clearly.
  `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: AI_CONFIG.model,
            messages: [{ role: "user", content: prompt }],
            temperature: AI_CONFIG.temperature.creative,
        }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return data.choices?.[0]?.message?.content || "Could not generate project suggestions.";
}
