import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
    tempId: { type: String, unique: true },
    publicKey: { type: String, required: true },
    ttl: { type: Date, expires: 3600 }, // auto delete after 1 hour
    blocked: { type: Boolean, default: false },
});

export default mongoose.model("TempUser", tempUserSchema);
