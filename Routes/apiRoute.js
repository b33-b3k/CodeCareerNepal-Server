require("dotenv").config();
const express = require("express");
const router = express.Router();
const Company = require("../Models/Company");
const { getInternJobs } = require("../utils/getInternJobs");

// Number of items to load per page
const ITEMS_PER_PAGE = 5;

// Get all company job listings
router.get("/", async (req, res) => {
  try {
    let { page } = req.query;
    page = parseInt(page) || 1;

    const skip = (page - 1) * ITEMS_PER_PAGE;

    const allCompanyJobListing = await Company.find({})
      .skip(skip)
      .limit(ITEMS_PER_PAGE);

    res.status(200).json(allCompanyJobListing);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get intern jobs
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

// Get job listings for a specific company
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
