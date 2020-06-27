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

app.get('/', function(request, response){
    response.sendFile(__dirname + '/html_files/index.html');
});
