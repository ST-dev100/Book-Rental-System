// const { Pool } = require('pg');
// const { dbConfig } = require('./config');

// const pool = new Pool(dbConfig);
// try{
  
// pool.on('connect', () => {
//     console.log('Connected to the database');
//   });
// }
// catch(err)
// {
//    console.log("error")
// }

// module.exports = pool;

// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;

