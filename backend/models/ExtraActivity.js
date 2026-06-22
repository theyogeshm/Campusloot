// backend/models/ExtraActivity.js
const mongoose = require("mongoose");

const ExtraActivitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  organizer: { type: String, required: true, trim: true },
  type: {
    type: String,
    required: true,
  },
  rewards: {
    cashPrize: { type: String, default: "Certificate Only" }, // e.g., "₹50,000" ya "Goodies"
    hasCertificate: { type: Boolean, default: true },
  },
  mode: { type: String, enum: ["Online", "Offline", "Hybrid"], required: true },
  applyLink: { type: String, required: true },
  affiliateLink: { type: String, default: "" }, // 💰 Future expansion ke liye safe-keeping
  deadline: { type: Date, required: true },
  isExpired: { type: Boolean, default: false },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  click: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExtraActivity", ExtraActivitySchema);
