//var http = require('http');

//create a server object:
//http.createServer(function (req, res) {
 // console.log("Listening on port 8080");
  //res.write('Hello World! - ryan '); //write a response to the client
 // res.sendFile('index.html');
  //res.http(index.html);
 // res.end(); //end the response
//}).listen(8080); //the server object listens on port 8080

//This is a test comment 

const express = require('express');
const app = new express();

app.get('/', function(request, response){
    response.sendFile('index.html');
});
