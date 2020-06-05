var http = require('http');
const express = require('express')
const app = express()

//create a server object:
http.createServer(function (req, res) {
  console.log("Listening on port 8080");
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080



app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})