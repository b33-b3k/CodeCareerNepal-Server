require("dotenv").config();
const puppeteer = require("puppeteer");
const { transformString } = require("../utils/transform");
async function scrapeLISNepal() {
  let url = "https://lisnepal.com.np/career/";
  let jobSelector = ".notice-lg";
  const browser = await puppeteer.launch({
    headless: "new",
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
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    const elements = await page.$$eval(jobSelector, (elems) => {
      return elems.map((element) => {
        let uri = "https://lisnepal.com.np/career/";
        return {
          jobName: element.querySelector(".title-bold").textContent.trim(),
          jobUrl: uri + element.querySelector("a").getAttribute("href"),
        };
      });
    });
    let refined = elements.map((jobs) => {
      return {
        jobName: transformString(jobs.jobName),
        jobUrl: jobs.jobUrl,
      };
    });
    return {
      companyName: "LIS Nepal",
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
  scrapeLISNepal,
};
