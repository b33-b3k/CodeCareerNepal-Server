const puppeteer = require("puppeteer");

async function scrapeEbPearls() {
  let url = "https://ebpearls.com.au/careers/";
  let jobSelector = ".job-role h3";
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
        const jobName = element.textContent.trim();
        const jobUrl = element.closest("a").href;
        return { jobName, jobUrl };
      });
    });

    return {
      companyName: "Eb Pearls",
      totalJobs: elements,
    };
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  } finally {
    await browser.close();
  }
}
// (async () => {
//   let temp = await scrapeEbPearls();
//   console.log(temp);
// })();
module.exports = {
  scrapeEbPearls,
};
