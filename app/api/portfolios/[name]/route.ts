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

// GET /api/portfolios/[name] - Get portfolio by user name
export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  try {
    await connectDB();
    const { name } = await params;
    const portfolios = await Portfolio.find({
      user: { $regex: new RegExp(name, "i") },
    }).sort({ createdAt: -1 });
    return Response.json(portfolios);
  } catch (error: any) {
    return Response.json(
      { error: "Failed to fetch portfolio: " + error.message },
      { status: 500 }
    );
  }
}
