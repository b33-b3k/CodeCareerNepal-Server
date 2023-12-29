const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true,
  },
  jobUrl: {
    type: String,
    required: true,
  },
});

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  totalJobs: {
    type: [jobSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
