import { generatePortfolioTemplate } from "@/../server/agents/templateGenerator.js";
import Portfolio from "@/../server/models/Portfolio.js";
import mongoose from "mongoose";

// Ensure database connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  return mongoose.connect(process.env.MONGODB_URI);
};

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { name, portfolioContent, resumeData } = await req.json();

    if (!portfolioContent) {
      return Response.json(
        { error: "Missing portfolio content for deployment." },
        { status: 400 }
      );
    }

    // 3. Generate Portfolio Template files (React Components + Data)
    const templateResult = await generatePortfolioTemplate({
      name: name || "Developer",
      ...portfolioContent,
    });

    // 4. Save to Database
    await connectDB();
    const newPortfolio = new Portfolio({
      user: name || "Anonymous",
      resumeData: resumeData || {},
      portfolioContent: portfolioContent,
      portfolioId: templateResult.portfolioId,
    });

    await newPortfolio.save();

    return Response.json({
      success: true,
      message: "Portfolio deployed and saved to database successfully!",
      template: templateResult,
    });
  } catch (err: any) {
    console.error("Deployment Error:", err);
    return Response.json(
      { error: "Portfolio deployment failed: " + err.message },
      { status: 500 }
    );
  }
}
