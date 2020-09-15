////////////////////////////////////////////////////////////
// server.js -- starts the server to allow for local devlopment 
//              and editting
//                   
// Denys Dziubii,	26/06/20
//    - File Created and configured
// Ryan Stolys, 14/09/20
//    - File organized, added references to modularization
//
////////////////////////////////////////////////////////////

global.users = false;

var express = require('express')
const app = express();
const bodyParser = require('body-parser');
var http = require('http');
var passport = require('passport');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy; // strategy for authenticating with a username and password
const session = require('express-session');


////////////////////////////////////////////////////////////////////////
// GLOABL CONSTANTS AND VARIABLES
////////////////////////////////////////////////////////////////////////
const NOERROR = 0; 
const DATABASE_ACCESS_ERROR = 1; 
////////////////////////////////////////////////////////////////////////
// END OF GLOABL CONSTANTS AND VARIABLES
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// REQUIRED BACKEND FUCNTIONS
////////////////////////////////////////////////////////////////////////
const volunteer = require('./backend/volunteer');
const oppourtunity = require('./backend/oppourtunity');
const team = require('./backend/team');
const general = require('./backend/general');
const auth = require('./backend/authentification');
////////////////////////////////////////////////////////////////////////
// END OF REQUIRED BACKEND FUCNTIONS
////////////////////////////////////////////////////////////////////////

var currentAccountsData = [];

// set loggedIn to false as it is assumed no one is logged in atm
// this will be expanded to include unique users and encryption for safe transfer over the Internet
global.loggedIn = false;

//Files for databae access
// var volunteerAccess = require('./backend/volunteerAccess');

// Added by Denys: delete after db is working on Ryan's end
const { Pool, Client } = require('pg');
const { exit } = require('process');
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');
const pool = new Pool(
  {
  connectionString: "postgres://kuskxdbbzhvwkz:68cbfc9d44fbc241c4f3e26a56327d009f5f6e4b75d04a7c0874e9b2536c1ade@ec2-3-222-30-53.compute-1.amazonaws.com:5432/d8sc0ku4m33dnj", //process.env.DATABASE_URL,  //This is undefined. We  need to insert the actual URL -- I couldnt find it
  ssl: 
    {
    rejectUnauthorized: false
    }
  });

var server = app.listen(process.env.PORT || 5000, () => console.log(`Listening on 5000`));

////////////////////////////////////////////////////////////////////////
// EXPRESS AND PASSPORT SETUP
////////////////////////////////////////////////////////////////////////
app.set('view engine', 'ejs') // added by Denys

app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('cookie-parser')())
app.use(cookieParser('secretString'));

app.use(session({
    secret: 'bulky keyboard',
    resave: true,
    cookie: { maxAge: 120000 },
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

////////////////////////////////////////////////////////////////////////
// END OF EXPRESS AND PASSPORT SETUP
////////////////////////////////////////////////////////////////////////

/******************************************************************************************************
DENYS can you move the authcheck and passport functions to the authentification file if possible 
    we can talk about how to setup our request routing to make this happen
*******************************************************************************************************/
// Access Control will be exapanded to include passport and auth check, for now, this will do.
// this function will be used to make sure only logged in users have access to sensitive information
function authcheck(req, res, next) {
    // if (req.isAuthenticated()) {
    if (req.isAuthenticated()) {
    	// if the user is logged in, proceed to the next function, as needed
        return next();
    }
    // otherwise, redirect to sign in page and send the message below
    else {
        res.render('pages/signIn', { message: 'Not authorized, please login' });
    }
}

////////////////////////////////////////////////////////////////////////
// GET REQUESTS
////////////////////////////////////////////////////////////////////////
app.get('*', function (req, res, next) { // universal access variable, keep working
    console.log("THE USER IS currently " + req.isAuthenticated());

    global.uname = null;

    if (req.user) {
        uname = req.user[0].username;
    }

    res.locals.user = req.user || null;

    if (res.locals.user != null) {
        console.log("the user is ");
        console.log(res.locals.user);
    }

    next();
})


app.get('/', function(request, response){
	if(request.isAuthenticated())
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
    req.isAuthenticated();
    req.logout();
    users = req.isAuthenticated();
    console.log("Upon logout user status is " + users);
    res.redirect('/');
});
////////////////////////////////////////////////////////////////////////
// END OF GET REQUESTS
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// POST REQUESTS
////////////////////////////////////////////////////////////////////////
app.post('/getInstitutionStats', authcheck, (request, response) =>
  {
  //get the users authentification info including volunteerID
  var volunteerID = 1; //Default for now

  response.send(general.getInstitutionStats(volunteerID));
  });
////////////////////////////////////////////////////////////////////////
// END OF POST REQUESTS
////////////////////////////////////////////////////////////////////////


/******************************************************************************************************
DENYS can you move the authcheck and passport functions to the authentification file if possible 
    we can talk about how to setup our request routing to make this happen
*******************************************************************************************************/
app.post('/signIn', passport.authenticate('local'),
  async function (request, response) {
	// post method was specified in signIn.ejs form
  console.log("The user is being authenticated: " + request.isAuthenticated());
  console.log("The user is currently written below");
  console.log(request.session.passport.user);
  if (request.body.remember) {
      request.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
  }
  else {
      request.session.cookie.expires = false; // Cookie expires at end of session
  }
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
            	users = request.isAuthenticated();
              global.user_name = uname;
         		  response.redirect('home');
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

// idea for using session based login came from a medium article https://medium.com/@timtamimi/getting-started-with-authentication-in-node-js-with-passport-and-postgresql-2219664b568c
passport.use('local', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {

    loginAttempt();
    async function loginAttempt() {
        if (username.toString().includes("GOOGLE#AUTH#USER:")) {
            return done(null, false);
        }

        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            console.log("CURRENT USERNAME IS " + username);
            // currentAccountsData array is empty, see in console.log. Why?
            var currentAccountsData = await JSON.stringify(client.query('SELECT firstname, lastname, email, password FROM volunteer WHERE firstname=$1', [username], function (err, result) {
                if (err) {
                    return done(err)
                }
                if (result.rows[0] == null) {
                    console.log("Oops. Incorrect login details.");
                    return done(null, false, { message: 'No user found' });
                }
                else {
                    var isMatch = false;
                    if(password == result.rows[0].password)
                      isMatch = true;
                        if (isMatch) {
                            console.log("Passwords matched!");
                            return done(null, [{ firstname: result.rows[0].firstname, volunteer_id: result.rows[0].volunteer_id, email: result.rows[0].email }]);
                        }
                        else {
                            console.log("Oops. Incorrect login details.");
                            return done(null, false);
                        }
                }
            }))
        }
        catch (e) { throw (e); }
    };
}
))

passport.serializeUser(function (user, done) {
    //console.log(user);
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    //console.log("deserial" + user);
    done(null, user);
});
