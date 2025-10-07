import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uid: { type: String, unique: true, required: true }, // public UID
    phoneHash: { type: String, unique: true, required: true }, // HMAC(phone)
    publicKey: { type: String, required: true }, // for E2EE
    avatar: { type: String },
    blocked: { type: Boolean, default: false },
    reports: { type: Number, default: 0 },
    blocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
