import { AI_CONFIG } from "../config/ai.js";

export async function parseResume(resumeText) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set!");
    }

    const prompt = `
    You are an expert Resume Parsing Agent.
    Analyze the following raw resume text and extract the information into a highly structured JSON object.
    
    The JSON structure MUST strictly adhere to the following keys:
    {
      "name": "Full Name",
      "skills": ["Skill 1", "Skill 2"],
      "projects": [{"name": "Project Name", "description": "Brief description", "technologies": ["Tech 1"]}],
      "education": [{"degree": "Degree Name", "institution": "Institution Name", "year": "Year"}],
      "experience": [{"role": "Job Title", "company": "Company Name", "duration": "Duration", "description": "Brief description"}]
    }
    
    Resume Text:
    ${resumeText}

    Respond ONLY with the raw JSON object. Do not include markdown formatting (like \`\`\`json) or any other text.
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
            temperature: AI_CONFIG.temperature.structured, // Very low temperature for structured data
        }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    let content = data.choices?.[0]?.message?.content || "";

    // Clean up any potential markdown formatting
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        return JSON.parse(content);
    } catch (err) {
        console.error("Failed to parse agent JSON:", content);
        throw new Error("Failed to generate structured resume data.");
    }
}
