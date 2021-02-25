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
    //console.log("THE USER IS currently " + req.isAuthenticated());

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
app.post('/api/getInstitutionInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await institution.getInstitutionInfo(request.user[0]));
    });

app.post('/api/editInstitutionStats', auth.authcheck, async (request, response) =>
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
app.post('/api/getVolunteerInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerInfo(request.user[0], request.body.vol_ID));
    });

app.post('/api/getVolunteerData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerData(request.user[0], request.body.vol_ID));
    });

app.post('/api/editVolunteer', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.editVolunteer(request.user[0], request.body.volunteerData));
    });

app.post('/api/changePassword', auth.authcheck, async (request, response) =>
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
app.post('/api/getVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.getVolunteeringData(request.user[0], request.body.vol_ID));
    });

app.post('/api/addVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.addVolunteeringData(request.user[0], request.body.volunteeringData));
    });

app.post('/api/editVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.editVolunteeringData(request.user[0], request.body.volunteeringData));
    });



/////////TEAM API CALLS//////////////////////////////////////////////////
app.post('/api/getTeamInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamInfo(request.user[0], request.body.teamID));
    });

app.post('/api/getTeamData', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamData(request.user[0], request.body.teamID));
    });

app.post('/api/editTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.editTeam(request.user[0], request.teamData));
    });

app.post('/api/addTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.addTeam(request.user[0], request.body.teamData));
    });

app.post('/api/getTeamsForViewable', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamsForViewable(request.user[0]));
    });



/////////OPPORTUNITY API CALLS//////////////////////////////////////////
app.post('/api/getAllOpportunityInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getAllOpportunityInfo(request.user[0], request.body.oppID));
    });

app.post('/api/getOpportunityInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityInfo(request.user[0], request.body.oppID));
    });

app.post('/api/getOpportunityData', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityData(request.user[0], request.body.oppID));
    });

app.post('/api/addOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunity(request.user[0], request.body.oppData));
    });


app.post('/api/editOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.editOpportunity(request.user[0], request.body.oppData));
    });


app.post('/api/deleteOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.deleteOpportunity(request.user[0], request.body.opportunityID));
    });


app.post('/api/getOpportunityTypes', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityTypes(request.user[0]));
    });

/* Not availible due to use of enum for opp types
app.get('/api/addOpportunityType', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunityType(request.user[0], request.body.opportunityType));
    });
*/

app.post('/api/getTeamsForViewable', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getTeamsForViewable(request.user[0]));
    });



/////////ACCOUNT/ AUTHENTICATION API CALLS///////////////////////////////////////////////
app.post('/api/createAccount', async (request, response) =>
    {
    //Temp response until we implement this funtionality
    response.send({success: false, errormessage: " Request Recieved. Not yet implemented."});
    });

app.post('/api/signIn', function(request, response, next) {
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