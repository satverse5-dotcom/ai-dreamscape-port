import { AI_CONFIG } from "../config/ai.js";

export async function generatePortfolioContent(parsedResume) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set!");
  }

  const prompt = `
    You are an expert AI Portfolio Content Generator.
    Analyze the following structured resume JSON and create highly engaging, professional content for a developer's personal portfolio website.
    
    The JSON structure MUST strictly adhere to the following keys:
    {
      "headline": "A catchy, impressive 1-line headline summarizing the developer's main identity (e.g., 'Full Stack Developer & AI Enthusiast')",
      "about": "A compelling 3-4 sentence 'About Me' section written in the first person that highlights their core strengths, passions, and background.",
      "skillsSummary": "A concise paragraph (2-3 sentences) summarizing their technical expertise and key domains.",
      "projects": [
        {
          "name": "Project Name", 
          "description": "An engaging, achievement-oriented 2-sentence description of the project.", 
          "technologies": ["Tech 1", "Tech 2"]
        }
      ]
    }
    
    Resume JSON Data:
    ${JSON.stringify(parsedResume, null, 2)}

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
      temperature: AI_CONFIG.temperature.structured, // Low temperature for more focused, reliable JSON output
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
    throw new Error("Failed to generate structured portfolio content.");
  }
}
