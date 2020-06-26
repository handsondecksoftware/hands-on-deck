<<<<<<< HEAD
const express = require('express')
const app = express()
const { Client } = require('pg');

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Heroku dynamically assigns a port to the app
// so we cannot set the port to a fixed number, use an OR statement instead
// since Heroku ads PORT to env
app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!')
})


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
=======
var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  console.log("Listening on port 8080");
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080

//This is a test comment 
>>>>>>> 76b794c99e3b03161fb96e912e15a51360bbf4be
