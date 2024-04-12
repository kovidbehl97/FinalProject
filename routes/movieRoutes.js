const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

async function fetchMoviesForPage(pageNumber, pageSize) {
    const skipCount = (pageNumber - 1) * pageSize;
    const movies = await Movie.find().skip(skipCount).limit(pageSize);
    return movies;
}

// GET all movies
router.get('/movies', async (req, res) => {
    // Parse the page number from URL query parameters
    const currentPage = parseInt(req.query.page) || 1; // Default to page 1 if no page parameter is provided

    try {
        // Fetch movies data for the specified page using Mongoose pagination
        const options = {
            page: currentPage,
            limit: 5, // Number of movies per page
        };
        const moviesData = await Movie.paginate({}, options);

        // Calculate previous and next page numbers
        const previousPage = moviesData.hasPrevPage ? currentPage - 1 : null;
        const nextPage = moviesData.hasNextPage ? currentPage + 1 : null;

        // Render the movies.hbs template with the movies data and pagination details
        res.render('movies', {
            movies: moviesData.docs,
            currentPage: currentPage,
            previousPage: previousPage,
            nextPage: nextPage,
            hasPreviousPage: moviesData.hasPrevPage,
            hasNextPage: moviesData.hasNextPage,
            totalPages: moviesData.totalPages
        });
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).send('Error fetching movies');
    }
});
// GET add movie form
router.get("/addMovies", (req, res) => {
  res.render("addMovies"); 
});

// POST add movie
router.post('/addMovie', async (req, res) => {
    try {
        // Extract movie data from the request body
        const { plot, runtime, num_mflix_comments, poster, title, fullplot, released, lastupdated, year, type } = req.body;

        // Split comma-separated values into arrays with checks for undefined or null
        const genres = req.body['genres[]'] ? req.body['genres[]'].split(',').map(item => item.trim()) : [];
        const cast = req.body['cast[]'] ? req.body['cast[]'].split(',').map(item => item.trim()) : [];
        const languages = req.body['languages[]'] ? req.body['languages[]'].split(',').map(item => item.trim()) : [];
        const directors = req.body['directors[]'] ? req.body['directors[]'].split(',').map(item => item.trim()) : [];
        const writers = req.body['writers[]'] ? req.body['writers[]'].split(',').map(item => item.trim()) : [];
        const countries = req.body['countries[]'] ? req.body['countries[]'].split(',').map(item => item.trim()) : [];

        // Build objects for awards, imdb, and tomatoes
        const awards = {
            wins: req.body['awards.wins'],
            nominations: req.body['awards.nominations'],
            text: req.body['awards.text'],
        };

        const imdb = {
            rating: req.body['imdb.rating'],
            votes: req.body['imdb.votes'],
            id: req.body['imdb.id'],
        };

        const tomatoes = {
            viewer: {
                rating: req.body['tomatoes.viewer.rating'],
                numreviews: req.body['tomatoes.viewer.numreviews'],
                meter: req.body['tomatoes.viewer.meter'],
            },
            production: req.body['tomatoes.production'],
            lastupdated: req.body['tomatoes.lastupdated'],
        };

        // Create a new instance of the Movie model with the extracted data
        const newMovie = new Movie({
            plot,
            genres,
            runtime,
            cast,
            num_mflix_comments,
            poster,
            title,
            fullplot,
            languages,
            released,
            directors,
            writers,
            awards,
            lastupdated,
            year,
            imdb,
            countries,
            type,
            tomatoes,
        });

        // Save the new movie to the database
        const savedMovie = await newMovie.save();

        res.status(200).json(savedMovie); // Respond with the saved movie data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// GET update movie form by ID
router.get("/updateMovie/:id", async (req, res) => {
    try {
        const movieId = req.params.id; // Get movieId from query parameters
        const movie = await Movie.findById(movieId);
        if (!movie) { 
            return res.status(404).json({ message: "Movie not found" });
        }
        res.render('updateMovies', {
            _id: movie.id,
            plot: movie.plot,
            genres: movie.genres,
            runtime: movie.runtime,
            rated: movie.rated,
            cast: movie.cast,
            poster: movie.poster,
            title: movie.title,
            fullplot: movie.fullplot,
            languages: movie.languages,
            released: formatDate(movie.released),
            directors: movie.directors,
            writers: movie.writers,
            awardswins: movie.awards && movie.awards.wins ? movie.awards.wins : 0,
            awardsnominations: movie.awards && movie.awards.nominations ? movie.awards.nominations : 0,
            awardstext: movie.awards && movie.awards.text ? movie.awards.text : '',
            lastupdated: formatDate(movie.lastupdated),
            year: movie.year,
            imdbrating: movie.imdb && movie.imdb.rating ? movie.imdb.rating : 0,
            imdbvotes: movie.imdb && movie.imdb.votes ? movie.imdb.votes : 0,
            imdbid: movie.imdb && movie.imdb.id ? movie.imdb.id : 0,
            countries: movie.countries,
            type: movie.type,
            tomatoesviewerrating: movie.tomatoes && movie.tomatoes.viewer && movie.tomatoes.viewer.rating ? movie.tomatoes.viewer.rating : 0,
            tomatoesviewernumreviews: movie.tomatoes && movie.tomatoes.viewer && movie.tomatoes.viewer.numReviews ? movie.tomatoes.viewer.numReviews : 0,
            tomatoesviewermeter: movie.tomatoes && movie.tomatoes.viewer && movie.tomatoes.viewer.meter ? movie.tomatoes.viewer.meter : 0,
            tomatoesproduction: movie.tomatoes && movie.tomatoes.production ? movie.tomatoes.production : '',
            tomatoeslastupdated: movie.tomatoes && movie.tomatoes.lastUpdated ? formatDate(movie.tomatoes.lastUpdated) : '',
            num_mflix_comments: movie.num_mflix_comments,
        });
        function formatDate(date) {
            if (!date) return '';
            const formattedDate = new Date(date);
            return formattedDate.toISOString().split('T')[0];
        }
        
    } catch (error) { 
        res.status(500).json({ message: error.message });  
    }
});

  
  

// POST update movie by ID
router.post('/updateMovie/:id', async (req, res) => {
    try { 
        const movieId = req.params.id
        // Extract movie ID and updated data from the request body
        const { plot, runtime, rated, num_mflix_comments, poster, title, fullplot, released, lastupdated, year, type } = req.body;
        // Split comma-separated values into arrays with checks for undefined or null
        const genres = req.body.genres ? req.body.genres.split(',').map(item => item.trim()) : [];
        const cast = req.body.cast ? req.body.cast.split(',').map(item => item.trim()) : [];
        const languages = req.body.languages ? req.body.languages.split(',').map(item => item.trim()) : [];
        const directors = req.body.directors ? req.body.directors.split(',').map(item => item.trim()) : [];
        const writers = req.body.writers ? req.body.writers.split(',').map(item => item.trim()) : [];
        const countries = req.body.countries ? req.body.countries.split(',').map(item => item.trim()) : [];

        // Build objects for awards, imdb, and tomatoes
        const awards = {
            wins: req.body.awardswins,
            nominations: req.body.awardsnominations,
            text: req.body.awardstext,
        };

        const imdb = {
            rating: req.body.imdbrating,
            votes: req.body.imdbvotes,
            id: req.body.imdbid,
        };

        const tomatoes = {
            viewer: {
                rating: req.body.tomatoesviewerrating,
                numReviews: req.body.tomatoesviewernumreviews,
                meter: req.body.tomatoesviewermeter,
            },
            production: req.body.tomatoesproduction,
            lastUpdated: req.body.tomatoeslastupdated,
        };

        // Check if movieId is valid
        if (!movieId) {
            return res.status(400).json({ error: 'Invalid movie ID' });
        }

        // Find the movie by ID
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Update movie fields with new data
        movie.plot = plot;
        movie.genres = genres;
        movie.runtime = runtime;
        movie.rated = rated;
        movie.cast = cast;
        movie.poster = poster;
        movie.title = title;
        movie.fullplot = fullplot;
        movie.languages = languages;
        movie.released = released;
        movie.directors = directors;
        movie.writers = writers;
        movie.awards = awards;
        movie.lastupdated = lastupdated;
        movie.year = year;
        movie.imdb = imdb;
        movie.countries = countries;
        movie.type = type;
        movie.tomatoes = tomatoes;

        // Save the updated movie
        await movie.save();

        // Respond with the updated movie data
        res.status(200).json(movie);
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// DELETE route for deleting a movie// DELETE route for deleting a movie
// DELETE route for deleting a movie
router.post('/deleteMovie', async (req, res) => {
    try {
        // Extract the movie ID from the request body
        const movieId = req.body.movieId;

        // Check if movieId is valid
        if (!movieId) {
            return res.status(400).json({ error: 'Invalid movie ID' });
        }

        // Find the movie by ID and delete it
        const deletedMovie = await Movie.findByIdAndDelete(movieId);

        if (!deletedMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Redirect to the movies page
        res.redirect('/movies');
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





module.exports = router;
