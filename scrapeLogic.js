const puppeteer = require("puppeteer");
const scrapeLogic = async (res) => {
  let url = "https://www.cotiviti.com.np/jobs";
  let jobSelector = "h3 a";
  const browser = await puppeteer.launch({
    headless: "new", // Set to true for headless mode
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
        let uri = "https://www.cotiviti.com.np";
        return {
          jobName: element.textContent.trim(),
          jobUrl: uri + element.getAttribute("href"),
        };
      });
    });

    res.json(elements);
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
