import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoute from "./routes/ai.js";
import contactRoute from "./routes/contact.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoute);
app.use("/api/contact", contactRoute);

app.listen(5000, () => console.log("Backend running on 5000"));