const puppeteer = require("puppeteer");

async function scrapeLogPoint() {
  let url = "https://www.logpoint.com/en/life-at-logpoint/careers/";
  let jobSelector = ".BambooHR-ATS-Jobs-Item";
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(jobSelector);

    const elements = await page.$$eval(jobSelector, (jobs) => {
      return jobs.map((job) => {
        const jobName = job.querySelector("a").textContent.trim();
        const jobUrl = job.querySelector("a").getAttribute("href");
        const countryLocation = job
          .querySelector(".BambooHR-ATS-Location")
          .textContent.trim();
        return { jobName, jobUrl, countryLocation };
      });
    });
    //First filter your country Kathmandu, Bagmati Pradesh
    let nepalJobs = elements
      .filter((element) => {
        return element.countryLocation == "Kathmandu, Bagmati Pradesh";
      })
      .map((element) => {
        return {
          jobName: element.jobName,
          jobUrl: element.jobUrl,
        };
      });

    return {
      companyName: "LogPoint Nepal",
      totalJobs: nepalJobs,
    };
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  } finally {
    await browser.close();
  }
}

// Example usage:
// (async () => {
//   let result = await scrapeLogPoint();
//   console.log(result);
// })();

module.exports = {
  scrapeLogPoint,
};
