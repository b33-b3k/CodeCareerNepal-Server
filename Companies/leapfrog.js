const puppeteer = require("puppeteer");
const { transformString } = require("../utils/transform");

async function scrapeLeapFrog() {
  let url = "https://career.lftechnology.com/o";
  let jobSelector = ".list-container .job";
  const browser = await puppeteer.launch({
    headless: "true",
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

    const elements = await page.$$eval(jobSelector, (elems) => {
      return elems.map((element) => {
        let uri = "https://career.lftechnology.com";
        return {
          jobName: element.querySelector(".job-title a").textContent.trim(),
          jobUrl:
            uri + element.querySelector(".job-title a").getAttribute("href"),
          jobPlace: element.querySelector(".job-location").textContent.trim(),
        };
      });
    });
    let totalNepalJobs = elements.filter((job) => {
      return job.jobPlace === "Kathmandu, Nepal";
    });
    let refined = totalNepalJobs.map((jobs) => {
      return {
        jobName: transformString(jobs.jobName),
        jobUrl: jobs.jobUrl,
      };
    });
    return {
      companyName: "LeapFrog",
      totalJobs: [...refined],
    };
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  } finally {
    await browser.close();
  }
}

module.exports = {
  scrapeLeapFrog,
};
