const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  domain: { type: String, required: true, trim: true }, // CS, Marketing, UI/UX, etc.
  stipend: { type: String, required: true }, // Fix amount ya range (e.g., "₹20,000/Month")
  locationType: {
    type: String,
    enum: ["Remote", "Hybrid", "Onsite"],
    required: true,
  },
  duration: { type: String, required: true }, // e.g., "3 Months", "6 Months"
  applyLink: { type: String, required: true }, // Direct official link (fallback)
  affiliateLink: { type: String, default: "" }, //primary earning revenue source link! 💰
  deadline: { type: Date, required: true },
  isExpired: { type: Boolean, default: false },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, 
  // Kis admin ne dala hai
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

module.exports = mongoose.model("Internship", InternshipSchema);
