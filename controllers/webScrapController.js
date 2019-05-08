let axios = require('axios'); 
let cheerio = require('cheerio'); 
let mongoose = require('mongoose'); 
let Article = require("../models/Articles"); 

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

module.exports = (app) => {
    app.get("/", function(req, res) {
        res.render("index");
    });
  
    // Retrieve data from the db
    app.get("/all", function(req, res) {
        // Find all results from the scrapedData collection in the db
        Article.scrapedData.find({}, function(error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
        });
    });
    
    // Scrape data from one site and place it into the mongodb db
    app.get("/scrape", function(req, res) {
        // Make a request via axios for the news section of `ycombinator`
        axios.get("https://newyorktimes.com/").then(function(response) {
        // Load the html body from axios into cheerio
        let $ = cheerio.load(response.data);
        // For each element with a "title" class
        $(".title").each(function(i, element) {
            // Save the text and href of each link enclosed in the current element
            let title = $(element).children("a").text();
            let link = $(element).children("a").attr("href");
    
            // If this found element had both a title and a link
            if (title && link) {
            // Insert the data in the scrapedData db
            Article.scrapedData.insert({
                title: title,
                link: link
            },
            function(err, inserted) {
                if (err) {
                // Log the error if one is encountered during the query
                console.log(err);
                }
                else {
                // Otherwise, log the inserted data
                console.log(inserted);
                }
            });
            }
        });
        });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });

}