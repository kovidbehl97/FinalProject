const express = require("express");
const exphbs = require("express-handlebars");
// const router = express.Router();
var router = express();
const path = require("path");

// Set up handlebars as the view engine
router.engine(".hbs",
    exphbs.engine({extname: ".hbs" })
);
router.set("view engine", ".hbs");
router.set("views", path.join(__dirname, "../views"));

// Render the UI form
router.get("/form", (req, res) => {
    res.render("form"); 
});

// Handle form submission
router.post("/form", (req, res) => {
    // Process the form data
    const formData = req.body;
    // Perform any necessary actions (e.g., saving data to the database)
    // Redirect or render a response
    res.redirect("/success");
});

module.exports = router;
