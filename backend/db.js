const { Pool } = require('pg');
const { dbConfig } = require('./config');

const pool = new Pool(dbConfig);
try{
  
pool.on('connect', () => {
    console.log('Connected to the database');
  });
}
catch(err)
{
   console.log("error")
}

module.exports = pool;
