require("dotenv").config();
const express = require("express");
const router = express.Router();
const Company = require("../Models/Company");
const { getInternJobs } = require("../utils/getInternJobs");
router.get("/", async (req, res) => {
  try {
    const allCompanyJobListing = await Company.find({});
    res.status(200).json(allCompanyJobListing);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/intern", async (req, res) => {
  try {
    const internJobs = await getInternJobs();
    console.log(internJobs);
    res.status(200).json(internJobs);
  } catch (error) {
    console.error("Route Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching intern jobs." });
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

module.exports = router;
