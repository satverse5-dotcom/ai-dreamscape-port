import Portfolio from "@/../server/models/Portfolio.js";
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  return mongoose.connect(process.env.MONGODB_URI);
};

export const runtime = "nodejs";

// GET /api/portfolios - Get all portfolios
export async function GET() {
  try {
    await connectDB();
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    return Response.json(portfolios);
  } catch (error: any) {
    return Response.json(
      { error: "Failed to fetch portfolios: " + error.message },
      { status: 500 }
    );
  }
}
