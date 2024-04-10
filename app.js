// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');
const uiRoutes = require('./routes/uiRoutes'); 

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs'); 
app.use(express.static('public')); 
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Routes
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);
app.use('/ui', uiRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
