////////////////////////////////////////////////////////////
// server.js -- starts the server to allow for local devlopment 
//              and editting
//                   
// Denys Dziubii,	26/06/20
//    - File Created and configured
//
////////////////////////////////////////////////////////////

var express = require('express')
const app = express();
var http = require('http');

var server = app.listen(process.env.PORT || 5000, () => console.log(`Listening on 5000`));

app.use(express.static(__dirname + '/public'));


app.get('/', function(request, response){
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
