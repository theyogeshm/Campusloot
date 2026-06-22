const mongoose = require("mongoose");

const HackathonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  organizer: { type: String, required: true, trim: true }, // College or Company
  prizePool: { type: String, required: true }, // Total money (e.g., "₹5 Lakhs")
  teamSize: { type: String, required: true }, // e.g., "1-4 Members"
  mode: { type: String, enum: ["Online", "Offline", "Hybrid"], required: true },
  platform: { type: String, default: "Independent" }, // Devfolio, Unstop, Devpost, etc.
  applyLink: { type: String, required: true },
  affiliateLink: { type: String, default: "" }, //primary earning revenue source link!
  deadline: { type: Date, required: true },
  eventDate: { type: Date }, // Hackathon shuru kab ho raha hai
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

module.exports = mongoose.model("Hackathon", HackathonSchema);
