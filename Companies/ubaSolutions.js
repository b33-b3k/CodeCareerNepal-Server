const puppeteer = require("puppeteer");

async function scrapeUBASolutions() {
  let url = "https://uba-solutions.com/";
  let jobTitleSelector = ".quary h6"; // Selector for job titles

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
    await page.waitForSelector(jobTitleSelector);

    const elements = await page.$$eval(jobTitleSelector, (elems) => {
      return elems.map((element) => {
        return {
          jobName: element.textContent.trim(),
          jobUrl: "https://uba-solutions.com/",
        };
      });
    });

    return {
      companyName: "UBA Solutions",
      totalJobs: [...elements],
    };
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  } finally {
    await browser.close();
  }
}

module.exports = {
  scrapeUBASolutions,
};
