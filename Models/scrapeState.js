const mongoose = require("mongoose");

const scrapeStateSchema = new mongoose.Schema({
  currentIndex: { type: Number, default: 0 },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ScrapeState = mongoose.model("ScrapeState", scrapeStateSchema);

module.exports = ScrapeState;
