const Company = require("../Models/Company");
const getInternJobs = async () => {
  try {
    // Aggregate to filter and project only relevant jobs
    const internJobs = await Company.aggregate([
      {
        $unwind: "$totalJobs", // Split the array to have one document per job
      },
      {
        $match: {
          "totalJobs.jobName": { $regex: /(intern|trainee)/i },
        },
      },
      {
        $group: {
          _id: "$_id", // Group by company
          companyName: { $first: "$companyName" }, // Keep the company name
          internJobs: { $push: "$totalJobs" }, // Create an array of relevant jobs
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default MongoDB _id field
          companyName: 1, // Include the company name
          internJobs: 1, // Include the array of relevant jobs
        },
      },
    ]);

    return internJobs;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred while fetching intern jobs.");
  }
};

module.exports = { getInternJobs };
