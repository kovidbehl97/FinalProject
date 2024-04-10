// models/Movie.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // Define other movie properties
});

module.exports = mongoose.model('Movie', movieSchema);
