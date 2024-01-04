require("dotenv").config();
const express = require("express");
const router = express.Router();
const Company = require("../Models/Company");
const { getInternJobs } = require("../utils/getInternJobs");

router.get("/", async (req, res) => {
  try {
    const allCompanyJobListing = await Company.find({});
    const allInternsOpening = await getInternJobs();
    res.status(200).json(allInternsOpening);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(404).json({ error: "Company not found" });
  }

  try {
    const jobListing = await Company.find({ companyName: id });
    res.status(200).json(jobListing);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:id/intern", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(404).json({ error: "Company not found" });
  }

  try {
    const jobListing = await Company.find({ companyName: id });
    const internshipRegex = /^(intern|trainee)/i;

    const filteredJobs = jobListing[0].totalJobs.filter((job) => {
      const jobNameLower = job.jobName.toLowerCase();
      const match =
        jobNameLower.startsWith("intern") || jobNameLower.startsWith("trainee");

      // Log the job names and whether they match the filter
      console.log(`Job: ${job.jobName}, Matches Filter: ${match}`);

      return match;
    });

    // Update the jobListing object with the filtered jobs
    jobListing[0].totalJobs = filteredJobs;

    // Convert the Mongoose document to a plain JavaScript object
    const response = jobListing[0].toObject();

    // Send the response to the client
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
