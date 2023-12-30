const mongoose = require("mongoose");

const scrapeStateSchema = new mongoose.Schema({
  currentIndex: { type: Number, default: 0 },
});

const ScrapeState = mongoose.model("ScrapeState", scrapeStateSchema);

module.exports = ScrapeState;
