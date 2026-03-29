import Portfolio from "../models/Portfolio.js";
import { improveResume, suggestProjects } from "../agents/assistantAgents.js";

export const INTENTS = {
    ABOUT_SATYAM: "about_satyam",
    SHOW_PROJECTS: "show_projects",
    CREATE_PORTFOLIO: "create_portfolio",
    IMPROVE_RESUME: "improve_resume",
    SUGGEST_PROJECTS: "suggest_projects",
    UNKNOWN: "unknown"
};

export function detectIntent(message) {
    const msg = message.toLowerCase();

    if (/satyam|who are you|about you/i.test(msg)) return INTENTS.ABOUT_SATYAM;
    if (/projects|work|portfolio list|his projects/i.test(msg)) return INTENTS.SHOW_PROJECTS;
    if (/create|generate|build|make|design.*portfolio/i.test(msg)) return INTENTS.CREATE_PORTFOLIO;
    if (/improve|review|better|optimize.*resume/i.test(msg)) return INTENTS.IMPROVE_RESUME;
    if (/suggest|ideas|what should i build.*project/i.test(msg)) return INTENTS.SUGGEST_PROJECTS;

    return INTENTS.UNKNOWN;
}

export async function handleIntent(intent, message, context = {}) {
    switch (intent) {
        case INTENTS.ABOUT_SATYAM:
            return "Satyam Kumar Karn is an AI Engineer and Full Stack Developer specializing in intelligent systems, computer vision, and scalable AI applications. He works with React, Node.js, OpenCV, and PyTorch to build innovative solutions. You can find his full profile on the Hero section of this site!";

        case INTENTS.SHOW_PROJECTS:
            try {
                // Fetch latest 3 portfolios from the database
                const portfolios = await Portfolio.find().sort({ createdAt: -1 }).limit(3);
                if (portfolios.length === 0) {
                    return "I couldn't find any recently generated projects in the database. Why not create one by uploading your resume?";
                }
                let response = "Here are some recent projects generated using our AI:\n\n";
                portfolios.forEach((p, i) => {
                    response += `${i + 1}. **${p.user}'s Portfolio** - [View Details]\n`;
                    if (p.portfolioContent?.projects) {
                        p.portfolioContent.projects.slice(0, 2).forEach(proj => {
                            response += `   - ${proj.name}: ${proj.description}\n`;
                        });
                    }
                    response += "\n";
                });
                return response;
            } catch (err) {
                return "I ran into an error while fetching projects from the database.";
            }

        case INTENTS.CREATE_PORTFOLIO:
            return "Sure! I can help you with that. Please **upload your resume** (PDF or DOCX) using the attachment icon 📎, and I'll generate a professional portfolio website for you.";

        case INTENTS.IMPROVE_RESUME:
            return "To help you improve your resume, I'll need to see it first! Please **upload your resume** and I'll provide 5 actionable tips to make it stand out.";

        case INTENTS.SUGGEST_PROJECTS:
            return "I'd love to suggest some project ideas! However, they'll be much better if I know your skills. **Upload your resume** or tell me your technical stack (e.g., React, Python, Node.js) so I can give you tailored advice.";

        default:
            return null; // Let it fall back to standard LLM
    }
}
