const puppeteer = require("puppeteer");
const { transformString } = require("../utils/transform");
async function scrapeSoftBenz() {
  let url = "https://softbenz.com/careers";
  let jobSelector = ".mb-30";
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
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    const elements = await page.$$eval(jobSelector, (elems) => {
      return elems.map((element) => {
        return {
          jobName: element.querySelector("h4").textContent.trim(),
          jobUrl: element.querySelector("a").getAttribute("href"),
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
      companyName: "SoftBenz",
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
  scrapeSoftBenz,
};
