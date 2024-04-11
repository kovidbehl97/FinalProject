const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const secret = process.env.SECRET_KEY;
const mongoURI = process.env.MONGODB_URI;

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { authenticateJWT, mongoURI };
