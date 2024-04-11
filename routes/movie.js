const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// GET all movies with pagination and optional title filter
router.get("/api/movies", async (req, res) => {
    const { page = 1, perPage = 10, title } = req.query;
    const query = title ? { title: { $regex: title, $options: "i" } } : {};
    const options = {
        page: parseInt(page),
        limit: parseInt(perPage),
        sort: { _id: "asc" },
    };

    try {
        const movies = await Movie.paginate(query, options);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single movie by ID
router.get("/api/movies/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new movie
router.post("/api/movies", async (req, res) => {
    const {
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
    } = req.body;

    try {
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
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT update a movie by ID
router.put("/api/movies/:id", async (req, res) => {
    const { id } = req.params;
    const {
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
    } = req.body;

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            {
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
            },
            { new: true }
        );
        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a movie by ID
router.delete("/api/movies/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMovie = await Movie.findByIdAndDelete(id);
        if (!deletedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(204).json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
