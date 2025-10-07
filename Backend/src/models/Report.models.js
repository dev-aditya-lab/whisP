import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reporterId: { type: String, required: true },
    reportedId: { type: String, required: true },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Report", reportSchema);
