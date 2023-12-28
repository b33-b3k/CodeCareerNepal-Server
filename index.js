// Import required modules
const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");

// Create an Express application
const app = express();
const port = 3000; // You can change this port as needed

// Define a route
app.get("/", (req, res) => {
  console.log("Home route");
  res.send("Hello, Express!");
});
//Scrape Logic
app.get("/scrape", async (req, res) => {
  console.log("Scrape Route");
  await scrapeLogic(res);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
