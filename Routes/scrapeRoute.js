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
  //Have to Work on F1Soft
  // {
  //   name: "F1Soft International",
  //   scrape: require("../Companies/f1soft").scrapeF1Soft,
  // },
];

router.get("/", async (req, res) => {
  try {
    await Promise.all(
      scrapingFunctions.map(async (company) => {
        let temp = await company.scrape();
        console.log(temp);
        await storeIntoDatabase(temp);
      })
    );

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
