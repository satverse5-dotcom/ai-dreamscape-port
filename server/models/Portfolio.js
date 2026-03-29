import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    resumeData: {
        type: Object,
        required: true,
    },
    portfolioContent: {
        type: Object,
        required: true,
    },
    portfolioId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
