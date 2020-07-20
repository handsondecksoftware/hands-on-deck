const { Client } = require('pg');

const client = new Client(
  {
  connectionString: process.env.DATABASE_URL,  //This is undefined. We  need to insert the actual URL -- I couldnt find it
  ssl: 
    {
    rejectUnauthorized: false
    }
  });

client.connect();

client.query('SELECT * FROM volunteer;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) 
    {
    console.log(JSON.stringify(row));
    }
  client.end();
});