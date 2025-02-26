const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

// ✅ CORS Configuration (Important: credentials: true)
app.use(cors({
    origin: 'http://localhost:5173', // ✅ React Client
    credentials: true, // ✅ Allow cookies to be sent
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle CORS Preflight
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
});

app.post('/api/auth/token', (req, res) => {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "User ID is required" });

    try {
        const token = jwt.sign({ uid }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.cookie(process.env.COOKIE_NAME, token, {
            httpOnly: true,
            secure: false, // Change to true for HTTPS
            sameSite: 'Lax'
        });

        res.status(200).json({ message: "JWT token issued successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error generating JWT token" });
    }
});

app.get('/api/auth/verify/:uid', (req, res) => {
    const { uid } = req.params; // Extract UID from URL
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "Token not found" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.uid === uid) {
            res.status(200).json({ message: "Token is valid", uid: decoded.uid });
        } else {
            res.status(403).json({ error: "Unauthorized: UID mismatch" });
        }
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
});

app.listen(PORT, () => {
    console.log(`JWT service is running on port ${PORT}`);
});
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(express.json());
// app.use(cookieParser());
// // ✅ CORS Configuration
// app.use(cors({
//     origin: ['http://54.252.9.15:3000', 'http://localhost:5173'],
//     credentials: true, 
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // ✅ Handle CORS Preflight
// app.options('*', (req, res) => {
//     res.header('Access-Control-Allow-Origin', 'http://54.252.9.15:3000'); 
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.status(204).end();
// });

// app.post('/api/auth/token', (req, res) => {
//     const { uid } = req.body;
//     if (!uid) return res.status(400).json({ error: "User ID is required" });

//     try {
//         const token = jwt.sign({ uid }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN
//         });

     
// res.cookie(process.env.COOKIE_NAME, token, {
//     httpOnly: true, 
//     secure: false,  
//     sameSite: 'Lax', 
//     path: '/',       
//     domain: '54.252.9.15' 
// });

//         res.status(200).json({ message: "JWT token issued successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Error generating JWT token" });
//     }
// });

// app.get('/api/auth/verify/:uid', (req, res) => {
//     const { uid } = req.params; // Extract UID from URL
//     const token = req.cookies[process.env.COOKIE_NAME];
//     if (!token) return res.status(401).json({ error: "Token not found" });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (decoded.uid === uid) {
//             res.status(200).json({ message: "Token is valid", uid: decoded.uid });
//         } else {
//             res.status(403).json({ error: "Unauthorized: UID mismatch" });
//         }
//     } catch (error) {
//         res.status(401).json({ error: "Invalid token" });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`JWT service is running on port ${PORT}`);
// });