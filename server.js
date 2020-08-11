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
const bodyParser = require('body-parser');
var http = require('http');

// set loggedIn to false as it is assumed no one is logged in atm
// this will be expanded to include unique users and encryption for safe transfer over the Internet
global.loggedIn = false;

//Files for databae access
// var volunteerAccess = require('./backend/volunteerAccess');

// Added by Denys: delete after db is working on Ryan's end
const { Pool, Client } = require('pg');
const { exit } = require('process');
const pool = new Pool(
  {
  connectionString: "postgres://kuskxdbbzhvwkz:68cbfc9d44fbc241c4f3e26a56327d009f5f6e4b75d04a7c0874e9b2536c1ade@ec2-3-222-30-53.compute-1.amazonaws.com:5432/d8sc0ku4m33dnj", //process.env.DATABASE_URL,  //This is undefined. We  need to insert the actual URL -- I couldnt find it
  ssl: 
    {
    rejectUnauthorized: false
    }
  });

var server = app.listen(process.env.PORT || 5000, () => console.log(`Listening on 5000`));

app.set('view engine', 'ejs') // added by Denys

app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({ extended: true }))

// Access Control will be exapanded to include passport and auth check, for now, this will do.
// this function will be used to make sure only logged in users have access to sensitive information
function authcheck(req, res, next) {
    // if (req.isAuthenticated()) {
    if (loggedIn) {
    	// if the user is logged in, proceed to the next function, as needed
        return next();
    }
    // otherwise, redirect to sign in page and send the message below
    else {
        res.render('pages/signIn', { message: 'Not authorized, please login' });
    }
}

app.get('/', function(request, response){
	if(loggedIn)
		response.redirect('home');
  	else
  		response.redirect('signIn');
});

app.get('/home', authcheck, function(request, response){
  response.render('pages/home', { home: true, opps: false, volunt: false, teams: false});
});

app.get('/volunteers', authcheck, function(request, response){
  response.render('pages/volunteers', { home: false, opps: false, volunt: true, teams: false});
  //var result = volunteerAccess.loadVolunteerInfo(1, -1);
  //console.log(result);
});

app.get('/oppourtunities', authcheck, function(request, response){
  response.render('pages/oppourtunities', { home: false, opps: true, volunt: false, teams: false});
});

app.get('/teams', authcheck, function(request, response){
  response.render('pages/teams', { home: false, opps: false, volunt: false, teams: true});
});

app.get('/signIn', function(request, response){
  console.log('Logout Request Recieved');
  response.render('pages/signIn', { 'message': ''});
});

app.get('/logout', authcheck, function (req, res) {
	// set loggedIn to false as the user is logged out
    loggedIn = false;
    res.redirect('/');
});

app.post('/signIn', async function (request, response) {
	// post method was specified in signIn.ejs form

	// try catch error block
	try {
			// get username and password from signIn.ejs
			var uname = request.body.username;
      var password = request.body.password;

			// using asynchronus function, check if the input data belong to one of the entries in the db
			const client = await pool.connect();
            const result = await client.query("SELECT * FROM volunteer where firstname='" + uname + "' AND password='" + password + "'");
            // log it for reference
            console.log(result.rows[0]);
            console.log(uname);

            // if the result is non null, set loggedIn to true and allow acces to all other pages
            if(result.rows[0])
            {	
            	loggedIn = true;
         		response.redirect('index');
         	}
         	// otherwise, redirect to signIn page and send a message to be shown in the red box
            else
				response.render('pages/signIn', { 'message': "Wrong password, try again"});
			// release db
            client.release();
            // catch any errors and log them
        } catch (err) {
            console.error(err);
            response.send("Error " + err);
        }
	
});
