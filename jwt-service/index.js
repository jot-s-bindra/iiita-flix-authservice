const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.post('/api/auth/token', (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const token = jwt.sign({ uid }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.cookie(process.env.COOKIE_NAME, token, {
            httpOnly: true,   // Important: Prevents client-side access
            secure: false,    // Set to true in production (with HTTPS)
            sameSite: 'Strict'
        });

        res.status(200).json({ message: "JWT token issued successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error generating JWT token" });
    }
});

app.get('/api/auth/verify', (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) {
        return res.status(401).json({ error: "Token not found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: "Token is valid", uid: decoded.uid });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
});

app.listen(PORT, () => {
    console.log(`JWT service is running on port ${PORT}`);
});
