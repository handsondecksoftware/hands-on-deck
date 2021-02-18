////////////////////////////////////////////////////////////
// server.js -- starts the server to allow for local devlopment 
//              and editting
//                   
// Denys Dziubii,	26/06/20
//    - File Created and configured
// Ryan Stolys, 14/09/20
//    - File organized, added references to modularization
// Jayden Cole, 18/01/21
//    - Update to current design documentation
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
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
////////////////////////////////////////////////////////////////////////
// GLOABL CONSTANTS AND VARIABLES
////////////////////////////////////////////////////////////////////////

var HOURS_IN_DAY = 24;
var SECONDS_IN_HOUR = 3600;
var MILISECS_IN_SECOND = 1000;

////////////////////////////////////////////////////////////////////////
// END OF GLOABL CONSTANTS AND VARIABLES
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// REQUIRED BACKEND FUCNTIONS
////////////////////////////////////////////////////////////////////////
const database = require('./backend/databaseSetup');

const error = require('./backend/errorCodes');

const institution = require('./backend/institutionAPI');
const volunteer = require('./backend/volunteerAPI');
const opportunity = require('./backend/opportunityAPI');
const team = require('./backend/teamAPI');
const auth = require('./backend/authentication');
const general = require('./backend/general');
////////////////////////////////////////////////////////////////////////
// END OF REQUIRED BACKEND FUCNTIONS
////////////////////////////////////////////////////////////////////////

//
//Log start of server session
//
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
    cookie: { maxAge: MILISECS_IN_SECOND * SECONDS_IN_HOUR * HOURS_IN_DAY },
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
////////////////////////////////////////////////////////////////////////
// END OF EXPRESS AND PASSPORT SETUP
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// GET REQUESTS
////////////////////////////////////////////////////////////////////////
app.get('*', async function (req, res, next) { // universal access variable, keep working
    
    //Log status of user
    console.log("THE USER IS currently " + req.isAuthenticated());

    res.locals.user = req.user || null;
    if (res.locals.user != null) {
        console.log("the user is");
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

app.get('/home', auth.authcheck_get, function(request, response){
    response.render('pages/home', { home: true, opps: false, volunt: false, teams: false, settings: false});
});

app.get('/volunteers', auth.authcheck_get, function(request, response){
  response.render('pages/volunteers', { home: false, opps: false, volunt: true, teams: false, settings: false});
});

app.get('/opportunities', auth.authcheck_get, function(request, response){
  response.render('pages/opportunities', { home: false, opps: true, volunt: false, teams: false, settings: false});
});

app.get('/teams', auth.authcheck_get, function(request, response){
  response.render('pages/teams', { home: false, opps: false, volunt: false, teams: true, settings: false});
});

app.get('/settings', auth.authcheck_get, function(request, response){
    response.render('pages/settings', { home: false, opps: false, volunt: false, teams: false, settings: true});
  });

app.get('/signIn', function(request, response) {
  response.render('pages/signIn', { 'message': (request.message || '')});
});

app.get('/logout', auth.authcheck_get, function (req, res) {
    req.logout();             //Logout user using passport
    console.log("Upon logout user status is " + req.isAuthenticated());     //log new status of user
    res.redirect('/');        //Redirect to signIn page
});
////////////////////////////////////////////////////////////////////////
// END OF GET REQUESTS
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// API INTERFACE
////////////////////////////////////////////////////////////////////////

/////////INSTITUITION API CALLS///////////////////////////////////////////////
app.get('/api/getInstitutionInfo', auth.authcheck, async (request, response) =>
    {
    console.log("HELLO?");
    response.send(await institution.getInstitutionInfo(request.user[0]));
    });

app.get('/api/editInstitutionStats', auth.authcheck, async (request, response) =>
    {
    response.send(await institution.editInstitutionInfo(request.user[0], request.body.iInfo));
    });

/* We don't need this yet -- can be implemented later
app.get('/api/addInstitution', auth.authcheck, async (request, response) =>
    {
    response.send(await institution.addInstitution(request.user[0], request.iInfo));
    });
*/


/////////VOLUNTEER API CALLS/////////////////////////////////////////////
app.get('/api/getVolunteerInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerInfo(request.user[0], request.body.vol_ID));
    });

app.get('/api/getVolunteerData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerData(request.user[0], request.body.vol_ID));
    });

app.get('/api/editVolunteer', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.editVolunteer(request.user[0], request.body.volunteerData));
    });

app.get('/api/changePassword', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.changePassword(request.user[0], request.body.oldPassword, request.body.newPassword));
    });

/* Can add this at the end. Volunteers are added from app through the "createAccount" api call
app.get('/api/addVolunteer', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.addVolunteer(request.user[0], request.body.volunteerData));
    });
*/



/////////VOLUNTEERING DATA API CALLS/////////////////////////////////////////////
app.get('/api/getVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.getVolunteeringData(request.user[0], request.body.vol_ID));
    });

app.get('/api/addVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.addVolunteeringData(request.user[0], request.body.volunteeringData));
    });

app.get('/api/editVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.editVolunteeringData(request.user[0], request.body.volunteeringData));
    });



/////////TEAM API CALLS//////////////////////////////////////////////////
app.get('/api/getTeamInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamInfo(request.user[0], request.body.teamID));
    });

app.get('/api/getTeamData', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamData(request.user[0], request.body.teamID));
    });

app.get('/api/editTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.editTeam(request.user[0], request.teamData));
    });

app.get('/api/addTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.addTeam(request.user[0], request.body.teamData));
    });

app.get('/api/getTeamsForViewable', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamsForViewable(request.user[0]));
    });



/////////OPPORTUNITY API CALLS//////////////////////////////////////////
app.get('/api/getAllOpportunityInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getAllOpportunityInfo(request.user[0], request.body.oppID));
    });

app.get('/api/getOpportunityInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityInfo(request.user[0], request.body.oppID));
    });

app.get('/api/getOpportunityData', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityData(request.user[0], request.body.oppID));
    });

app.get('/api/addOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunity(request.user[0], request.body.oppData));
    });


app.get('/api/editOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.editOpportunity(request.user[0], request.body.oppData));
    });


app.get('/api/deleteOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.deleteOpportunity(request.user[0], request.body.opportunityID));
    });


app.get('/api/getOpportunityTypes', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityTypes(request.user[0]));
    });

/* Not availible due to use of enum for opp types
app.get('/api/addOpportunityType', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunityType(request.user[0], request.body.opportunityType));
    });
*/

app.get('/api/getTeamsForViewable', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getTeamsForViewable(request.user[0]));
    });



/////////ACCOUNT/ AUTHENTICATION API CALLS///////////////////////////////////////////////
app.get('/api/createAccount', async (request, response) =>
    {
    //Temp response until we implement this funtionality
    response.send({success: false, errormessage: " Request Recieved. Not yet implemented."});
    });



app.get('/api/signIn', function(request, response, next) {
    const email = request.query.username;
    const password = request.query.password;
    console.log(request.query)
    const user = {
        email: email,
        password: password
    }

    try {
          console.log("CURRENT USERNAME IS " + email);
          database.queryDB('SELECT volunteer_id, institution_id, email, password, volunteertype FROM volunteer WHERE email=\'' + email + '\';', function (result, err) {
    
              if (err) {
                console.log('Error Occured: ');
                console.log(err);
                response.send(err);
              }
  
              if (result.rows[0] == null) {
                console.log("Oops. Incorrect login details.");
                response.send(null, false, { message: 'Incorrect Email' });
              }
              else {
  
                  bcrypt.compare(password, result.rows[0].password, function (err, isMatch) {
                    if (err) throw err;
                    else if (isMatch) {
                        console.log("Passwords matched!");
                        //if user log in success, generate a JWT token for the user with a secret key
                        jwt.sign({user}, 'privatekey', { expiresIn: '1h' },(err, token) => {
                            if(err) { console.log(err) }    
                            response.send(token);
                        })
                        //return done(null, [{ institution_id: result.rows[0].institution_id, volunteer_id: result.rows[0].volunteer_id, volunteertype: result.rows[0].volunteertype}]);
                      }
                      else {
                        console.log("Oops. Incorrect login details.");
                        response.send(null, false, { message: 'Incorrect Password' });
                        }
                    });
                };
          })
         }
        catch (e) { throw (e); }

})
//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}

//This is a protected route 
app.get('/user/data', checkToken, (req, res) => {
    //verify the JWT token generated for the user
    jwt.verify(req.token, 'privatekey', (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
        } else {
            //If token is successfully verified, we can send the autorized data 
            res.json({
                message: 'Successful log in',
                authorizedData
            });
            console.log('SUCCESS: Connected to protected route');
        }
    })
});

app.get('/api/signIndummy', function(request, response, next) {
    passport.authenticate('local', (err, user, info) => {
    if (err) { 
        return next(err); 
    }

    if (!user) { 
        return response.render('pages/signIn', { 'message': info.message}); 
    }
    else {
        request.logIn(user, (err) => {
            if (err) { 
                return next(err); 
            }

            var isMobile = JSON.parse(request.query.isMobile);
            if(isMobile)
                {
                return response.send({success: true, session: user, message: "Successful Sign In"});
                }
            else
                {
                return response.redirect('../home');
                }
                
        });
    }
    
    })(request, response, next);
  });
////////////////////////////////////////////////////////////////////////
// END OF API INTERFACE
////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////
// PASSPORT AUTHENTIFICATION FUNCTIONS
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
//
// Authenticate users using passport
//
// idea for using session based login came from a medium article 
// https://medium.com/@timtamimi/getting-started-with-authentication-in-node-js-with-passport-and-postgresql-2219664b568c
//
////////////////////////////////////////////////////////////////////////
passport.use('local', new LocalStrategy({ passReqToCallback: true }, (req, email, password, done) => {

    loginAttempt();
    async function loginAttempt() {
  
        try {
          console.log("CURRENT USERNAME IS " + email);
          database.queryDB('SELECT volunteer_id, institution_id, email, password, volunteertype FROM volunteer WHERE email=\'' + email + '\';', function (result, err) {
    
              if (err) {
                console.log('Error Occured: ');
                console.log(err);
                return done(err);
              }
  
              if (result.rows[0] == null) {
                console.log("Oops. Incorrect login details.");
                return done(null, false, { message: 'Incorrect Email' });
              }
              else {
  
                  bcrypt.compare(password, result.rows[0].password, function (err, isMatch) {
                    if (err) throw err;
                    else if (isMatch) {
                        console.log("Passwords matched!");
                        return done(null, [{ institution_id: result.rows[0].institution_id, volunteer_id: result.rows[0].volunteer_id, volunteertype: result.rows[0].volunteertype}]);
                      }
                      else {
                        console.log("Oops. Incorrect login details.");
                        return done(null, false, { message: 'Incorrect Password' });
                        }
                    });
                };
          })
         }
        catch (e) { throw (e); }
    };
}));


////////////////////////////////////////////////////////////////////////
//
// Used by passport
//
////////////////////////////////////////////////////////////////////////
passport.serializeUser(function (user, done) {
  //console.log(user);
  done(null, user);
});

////////////////////////////////////////////////////////////////////////
//
// Used by passport
//
////////////////////////////////////////////////////////////////////////
passport.deserializeUser(function (user, done) {
  //console.log("deserial" + user);
  done(null, user);
});

////////////////////////////////////////////////////////////////////////
// END OF PASSPORT AUTHENTIFICATION FUNCTIONS
////////////////////////////////////////////////////////////////////////