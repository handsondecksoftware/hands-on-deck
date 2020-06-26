//This is a test comment 

var express = require('express')
const app = express();
var http = require('http');

var PORT = 8080;

var server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});
