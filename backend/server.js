const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (curl/Postman) and same-origin requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*')) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
// Express 5 + path-to-regexp: "*" is an invalid route pattern.
// Use a RegExp to match all preflight requests.
app.options(/.*/, cors());

const donorRoutes = require('./routes/donorRoutes');
app.use('/api/donors',donorRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected successfully! "))
.catch(err => console.log("DB Connection Error: ❌ ",err));

app.listen(5000,()=> console.log("Server Running on 5000 "));