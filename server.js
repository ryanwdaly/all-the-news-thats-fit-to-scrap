let express = require("express");
let mongojs = require("mongojs");
let axios = require("axios");
let cheerio = require("cheerio");
let exphbs = require("express-handlebars");

let PORT = process.env.PORT || 3000;
let app = express();

// let databaseUrl = "scraper";
// let collections = ["scrapedData"];

// app.use(bodyParser.urlencoded({ extended: false })); // Use body-parser for handling form submissions
// app.use(bodyParser.json());
// app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./controllers/webScrapController")(app);

app.listen(PORT, ()=> {
  console.log("App running on port ${PORT}!");
});
