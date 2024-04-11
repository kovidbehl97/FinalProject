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

// Home page route
router.get('/', (req, res) => {
    // Fetch movies data from the database or other data source
    const movies = [
        { title: 'Movie 1', year: 2022 },
        { title: 'Movie 2', year: 2021 }
    ];

    // Render the movies page with movies data
    res.render('movies', { movies });
});

// Movie details page route
router.get('/movie/:id', (req, res) => {
    // Fetch movie details by ID from the database or other data source
    const movie = { title: 'Movie 1', year: 2022 };

    // Render the movie details page with movie data
    res.render('movieDetails', { movie });
});

// Add movie form route
router.get('/addMovie', (req, res) => {
    res.render('addMovie');
});

// Update movie form route
router.get('/updateMovie/:id', (req, res) => {
    // Fetch movie details by ID from the database or other data source
    const movie = { title: 'Movie 1', year: 2022 };

    // Render the update movie form with movie data
    res.render('updateMovie', { movie });
});

// Login form route
router.get('/login', (req, res) => {
    res.render('login');
});

// Register form route
router.get('/register', (req, res) => {
    res.render('register');
});


module.exports = router;
