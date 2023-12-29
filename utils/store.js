const Company = require("../Models/Company");
async function storeIntoDatabase(refinedTotalJobs) {
  try {
    const temp = await Company.find({
      companyName: refinedTotalJobs.companyName,
    });

    if (Array.isArray(temp) && temp.length === 0) {
      // Store it in the database
      const company = new Company(refinedTotalJobs);
      await company.save();
      console.log(
        `Job data for ${refinedTotalJobs.companyName} has been saved to the database.`
      );
    } else {
      const companyQuery = { companyName: refinedTotalJobs.companyName };
      const updateData = { $set: refinedTotalJobs };
      const updatedCompany = await Company.findOneAndUpdate(
        companyQuery,
        updateData,
        {
          new: true,
          upsert: true,
        }
      );
      console.log(
        `Job data for ${updatedCompany.companyName} has been updated and saved to the database.`
      );
    }
  } catch (error) {
    console.error(`Error while storing job data: ${error.message}`);
  }
}
module.exports = {
  storeIntoDatabase,
};
