const puppeteer = require("puppeteer");
async function scrapeF1Soft() {
  let url = "https://www.f1soft.com/career#vacanciesList";
  let jobSelector = ".card-body";
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
        let uri = "https://www.f1soft.com";
        return {
          jobName: element
            .querySelector(".header .card-title")
            .textContent.trim(),
          jobUrl: uri + element.querySelector("a").getAttribute("href"),
        };
      });
    });
    let refined = elements.map((jobs) => {
      return {
        jobName: jobs.jobName,
        jobUrl: jobs.jobUrl,
      };
    });
    return {
      companyName: "F1Soft International",
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
  scrapeF1Soft,
};
