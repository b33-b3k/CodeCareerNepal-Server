const puppeteer = require("puppeteer");

async function scrapeFuseMachine() {
  let url = "https://fusemachines.com/careers/";
  let jobSelector = ".row.py-3";

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
          jobName: element
            .querySelector(".col-md-6 .bold-s")
            .textContent.trim(),
          jobPlace: element
            .querySelector(".col-md-4 .c-dark-grey")
            .textContent.trim(),
          jobUrl: element.querySelector(".col-md-2 a").getAttribute("href"),
        };
      });
    });
    let totalNepalJobs = elements.filter((job) => {
      return job.jobPlace === "Kathmandu, Nepal";
    });
    let refined = totalNepalJobs.map((jobs) => {
      return {
        jobName: jobs.jobName,
        jobUrl: jobs.jobUrl,
      };
    });
    return {
      companyName: "FuseMachine",
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
  scrapeFuseMachine,
};
