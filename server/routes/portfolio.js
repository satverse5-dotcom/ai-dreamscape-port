import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

// GET /api/portfolios - Get all portfolios
router.get("/", async (req, res) => {
    try {
        const portfolios = await Portfolio.find().sort({ createdAt: -1 });
        res.json(portfolios);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch portfolios: " + error.message });
    }
});

// GET /api/portfolios/:name - Get portfolio by user name
router.get("/:name", async (req, res) => {
    try {
        const portfolios = await Portfolio.find({
            user: { $regex: new RegExp(req.params.name, "i") }
        }).sort({ createdAt: -1 });
        res.json(portfolios);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch portfolio: " + error.message });
    }
});

export default router;
