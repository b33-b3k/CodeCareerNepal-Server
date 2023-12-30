const express = require("express");
const router = express.Router();
const { storeIntoDatabase } = require("../utils/store");

// Import scraping functions for different companies
const scrapingFunctions = [
  { name: "Cotiviti", scrape: require("../Companies/cotiviti").scrapeCotiviti },
  {
    name: "FuseMachine",
    scrape: require("../Companies/fusemachine").scrapeFuseMachine,
  },
  {
    name: "LeapFrog",
    scrape: require("../Companies/leapfrog").scrapeLeapFrog,
  },
  {
    name: "LIS Nepal",
    scrape: require("../Companies/lisnepal").scrapeLISNepal,
  },
  {
    name: "SoftBenz",
    scrape: require("../Companies/softbenz").scrapeSoftBenz,
  },
  {
    name: "Versik",
    scrape: require("../Companies/verisk").scrapeVerisk,
  },
];

router.get("/", async (req, res) => {
  try {
    const maxConcurrency = 2; // Adjust this based on available resources

    const executeScraping = async (company) => {
      try {
        const result = await company.scrape();
        console.log(result);
        await storeIntoDatabase(result);
      } catch (error) {
        console.error(`Error scraping ${company.name}:`, error);
      }
    };

    for (let i = 0; i < scrapingFunctions.length; i += maxConcurrency) {
      const batch = scrapingFunctions.slice(i, i + maxConcurrency);
      const promises = batch.map((company) => executeScraping(company));
      await Promise.all(promises);
    }

    console.log(`Scraping completed for all the IT Companies`);
    res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while scraping companies." });
  }
});

module.exports = router;
