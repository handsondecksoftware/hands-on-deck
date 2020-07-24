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

//Files for databae access
var volunteerAccess = require('./backend/volunteerAccess');

var server = app.listen(process.env.PORT || 5000, () => console.log(`Listening on 5000`));

app.set('view engine', 'ejs') // added by Denys

app.use(express.static(__dirname + '/public'));


app.get('/', function(request, response){
  response.render('pages/signIn');
});

app.get('/index', function(request, response){
  response.render('pages/index');
});

app.get('/volunteers', function(request, response){
  response.render('pages/volunteers');
  //var result = volunteerAccess.loadVolunteerInfo(1, -1);
  //console.log(result);
});

app.get('/oppourtunities', function(request, response){
  response.render('pages/oppourtunities');
});

app.get('/teams', function(request, response){
  response.render('pages/teams');
});

app.get('/signIn', function(request, response){
  console.log('Logout Request Recieved');
  response.render('pages/signIn');
});

