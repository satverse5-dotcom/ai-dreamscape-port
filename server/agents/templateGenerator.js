import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generatePortfolioTemplate(portfolioData) {
    try {
        const templatesDir = path.join(__dirname, '../templates/developer-template');
        const outputBaseDir = path.join(__dirname, '../generated-portfolios');

        // Create a unique folder for this portfolio generation
        const uniqueId = Date.now().toString();
        const outputDir = path.join(outputBaseDir, `portfolio-${uniqueId}`);

        // Create the output directories if they don't exist
        if (!fs.existsSync(outputBaseDir)) {
            fs.mkdirSync(outputBaseDir, { recursive: true });
        }
        fs.mkdirSync(outputDir, { recursive: true });

        // Copy template files
        const templateFiles = fs.readdirSync(templatesDir);

        for (const file of templateFiles) {
            if (file.endsWith('.jsx')) {
                const srcPath = path.join(templatesDir, file);
                const destPath = path.join(outputDir, file);
                fs.copyFileSync(srcPath, destPath);
            }
        }

        // Save the portfolio JSON data directly into the generated folder so the index.jsx can fetch it
        const dataPath = path.join(outputDir, 'portfolioData.json');

        // Merge the name from the raw parsed resume with the generated content
        const finalData = {
            name: portfolioData.name || "Developer",
            headline: portfolioData.headline,
            about: portfolioData.about,
            skillsSummary: portfolioData.skillsSummary,
            projects: portfolioData.projects
        };

        fs.writeFileSync(dataPath, JSON.stringify(finalData, null, 2), 'utf-8');

        console.log(`Portfolio logic generated successfully at: ${outputDir}`);

        return {
            success: true,
            portfolioId: `portfolio-${uniqueId}`,
            path: outputDir,
            downloadUrl: `/api/ai/download/${uniqueId}` // Optional: if we want to serve it later
        };

    } catch (error) {
        console.error("Template Generation Error:", error);
        throw new Error("Failed to generate portfolio template files.");
    }
}
