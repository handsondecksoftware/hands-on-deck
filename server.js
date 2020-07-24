////////////////////////////////////////////////////////////
// server.js -- starts the server to allow for local devlopment 
//              and editting
//                   
// Denys Dziubii,	26/06/20
//    - File Created and configured
//		Hi Ryan and Jayden!
////////////////////////////////////////////////////////////

var express = require('express')
const app = express();
var http = require('http');

var server = app.listen(process.env.PORT || 5000, () => console.log(`Listening on 5000`));

app.use(express.static(__dirname + '/public'));


app.get('/', function(request, response){
    response.sendFile(__dirname + '/views/html_files/signIn.html');
});

app.get('/index.html', function(request, response){
  response.sendFile(__dirname + '/views/html_files/index.html');
});

app.get('/volunteers.html', function(request, response){
  response.sendFile(__dirname + '/views/html_files/volunteers.html');
});

app.get('/oppourtunities.html', function(request, response){
  response.sendFile(__dirname + '/views/html_files/oppourtunities.html');
});

app.get('/teams.html', function(request, response){
  response.sendFile(__dirname + '/views/html_files/teams.html');
});


app.get('/signIn.html', function(request, response){
  console.log('Logout Request Recieved');
  response.sendFile(__dirname + '/views/html_files/signIn.html');
});


//Database testing 
const { Client } = require('pg');

const client = new Client(
  {
  connectionString: "postgres://kuskxdbbzhvwkz:68cbfc9d44fbc241c4f3e26a56327d009f5f6e4b75d04a7c0874e9b2536c1ade@ec2-3-222-30-53.compute-1.amazonaws.com:5432/d8sc0ku4m33dnj", //process.env.DATABASE_URL,  //This is undefined. We  need to insert the actual URL -- I couldnt find it
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