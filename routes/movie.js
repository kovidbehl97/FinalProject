const express = require('express');
const Movie = require('../models/Movie');
const { query, validationResult } = require('express-validator');
//const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Create movie
router.post('/', /* authenticate, */ async (req, res) => {
    try {
        const { title, /* Add other movie properties */ } = req.body;
        const movie = new Movie({ title, /* Add other movie properties */ });
        await movie.save();
        res.status(201).json({ message: 'Movie created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all movies
router.get('/', [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('perPage').optional().isInt({ min: 1 }).toInt(),
    query('title').optional().isString().trim(),
], /* authenticate, */ async (req, res) => {
   // Check for validation errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
   }

   try {
       const { page = 1, perPage = 10, title } = req.query;
       const skip = (page - 1) * perPage;
       let query = {};
       
       if (title) {
           query = { title: { $regex: title, $options: 'i' } }; // Case-insensitive search
       }

       const movies = await Movie.find(query)
           .sort({ Movie_id: 1 }) // Sorting by Movie_id
           .skip(skip)
           .limit(perPage);

       res.status(200).json(movies);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
});

// Get movie by ID
router.get('/:id', /* authenticate, */ async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update movie by ID
router.put('/:id', /* authenticate, */ async (req, res) => {
    try {
        const { title, /* Add other movie properties */ } = req.body;
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { title, /* Add other movie properties */ }, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete movie by ID
router.delete('/:id', /* authenticate, */ async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
