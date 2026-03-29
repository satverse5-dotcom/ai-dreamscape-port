import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import aiRoute from "./routes/ai.js";
import contactRoute from "./routes/contact.js";
import portfolioRoute from "./routes/portfolio.js";
import resumeRoute from "./routes/resume.js";
import deployRoute from "./routes/deploy.js";

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoute);
app.use("/api/contact", contactRoute);
app.use("/api/portfolios", portfolioRoute);
app.use("/api/resume", resumeRoute);
app.use("/api/deploy", deployRoute);

app.listen(5000, () => console.log("Backend running on 5000"));