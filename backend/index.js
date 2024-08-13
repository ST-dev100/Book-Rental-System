const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser =  require("cookie-parser");
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const multer = require("multer");
const path = require("path");

const { Pool } = require('pg');

require('dotenv').config();

// const pool = require('./db');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false, // Required for secure connections to Railway
  },
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
 const upload = multer({ storage });
const app = express();
const port = 5000;

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to the database:', result.rows);
  });
}); 

// You can query the database here to test the connection

// (async () => {
//     try {
//         const client = await pool.connect();
//         await client.query('SELECT NOW()');
//         client.release(); 
//     } catch (err) {
//         console.error('Error acquiring a client:', err.stack);
//     }
// })();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // your front-end URL
    credentials: true // allow sending cookies with requests
}));
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/admin',adminRoutes);
app.use('/owner',ownerRoutes);
app.get('/test',(req,res)=>{
  res.json("worked");
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});  
