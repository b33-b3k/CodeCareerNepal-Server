const puppeteer = require("puppeteer");

async function scrapeEkbana() {
  let url = "https://careers.ekbana.com/";
  let jobSelector = ".result-list"; // Update this selector to match the job elements
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

    const elements = await page.$$eval(jobSelector, (elems) => {
      return elems.map((element) => {
        return {
          jobName: element.querySelector("b").textContent.trim(),
          jobUrl: element.getAttribute("href"),
        };
      });
    });
    let refined = elements.map((job) => {
      return {
        jobName: job.jobName,
        jobUrl: job.jobUrl,
      };
    });
    return {
      companyName: "Ekbana",
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
  scrapeEkbana,
};
