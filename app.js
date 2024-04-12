const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require('express-flash');
const passport = require("passport");
const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const exphbs  = require('express-handlebars');
const app = express();
app.use(express.static('public'));

// Set the correct MIME type for CSS files
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});


// Configure Handlebars view engine
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs' ,
    helpers: {
        gt: function (a, b) {
            return a > b;
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', '.hbs');

app.use(
    session({
      secret: process.env.SECRETKEY,
      resave: true,
      saveUninitialized: true,
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Passport
app.use(passport.initialize());

// Passport Configuration
require("./config/passport")(passport);

// Routes
app.use("/", movieRoutes);
app.use(authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
