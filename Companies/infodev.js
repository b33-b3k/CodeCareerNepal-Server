const axios = require("axios");
//scrapeInfoDev
async function scrapeInfoDev() {
  let url = "https://www.infodev.com.np/api/job/openings/";
  try {
    const jobs = [];
    let nextUrl = url;

    // Use a loop to fetch data until there is no "next" URL
    for (;;) {
      const response = await axios.get(nextUrl);

      const temp = response.data.data;
      jobs.push(...temp.results);

      if (temp.next !== null) {
        // Update nextUrl for the next iteration
        nextUrl = temp.next;
      } else {
        console.log("No More Jobs to Show");
        break; // Exit the loop when there is no "next" URL
      }
    }
    //filter your input
    let temp1 = jobs.map((job) => {
      return {
        jobName: job.title,
        jobUrl: "https://infodev.com.np/careers-listing",
      };
    });

    return {
      companyName: "Info Developers",
      totalJobs: temp1,
    };
  } catch (error) {
    // Handle errors
    console.error("Error fetching data:", error.message);
    // Return an empty array in case of an error
    return [];
  }
}

// Call the function with the initial URL
// (async () => {
//   const value = await scrapeInfoDev();
//   console.log(value);
// })();

module.exports = {
  scrapeInfoDev,
};
