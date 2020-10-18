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
const bcrypt = require('bcryptjs');

////////////////////////////////////////////////////////////////////////
// GLOABL CONSTANTS AND VARIABLES
////////////////////////////////////////////////////////////////////////
// NONE
////////////////////////////////////////////////////////////////////////
// END OF GLOABL CONSTANTS AND VARIABLES
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// REQUIRED BACKEND FUCNTIONS
////////////////////////////////////////////////////////////////////////
const database = require('./backend/databaseSetup');

const error = require('./backend/errorCodes');

const volunteer = require('./backend/volunteer');
const opportunity = require('./backend/opportunity');
const team = require('./backend/team');
const general = require('./backend/general');
const auth = require('./backend/authentification');
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
    cookie: { maxAge: 120000 },
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

app.get('/home', auth.authcheck, function(request, response){
  response.render('pages/home', { home: true, opps: false, volunt: false, teams: false});
});

app.get('/volunteers', auth.authcheck, function(request, response){
  response.render('pages/volunteers', { home: false, opps: false, volunt: true, teams: false});
});

app.get('/opportunities', auth.authcheck, function(request, response){
  response.render('pages/opportunities', { home: false, opps: true, volunt: false, teams: false});
});

app.get('/teams', auth.authcheck, function(request, response){
  response.render('pages/teams', { home: false, opps: false, volunt: false, teams: true});
});

app.get('/signIn', function(request, response) {
  response.render('pages/signIn', { 'message': (request.message || '')});
});

app.get('/logout', auth.authcheck, function (req, res) {
    req.logout();             //Logout user using passport
    console.log("Upon logout user status is " + req.isAuthenticated());     //log new status of user
    res.redirect('/');        //Redirect to signIn page
});
////////////////////////////////////////////////////////////////////////
// END OF GET REQUESTS
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// POST REQUESTS
////////////////////////////////////////////////////////////////////////

/////////GENERAL REQUESTS///////////////////////////////////////////////
app.post('/getInstitutionStats', auth.authcheck, async (request, response) =>
    {
    response.send(await general.getInstitutionStats(request.user[0].volunteer_id));
    });


/////////opportunity REQUESTS//////////////////////////////////////////
app.post('/getOpportunityData', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityData(request.user[0].volunteer_id, request.opportunityID));
    });


app.post('/getOpportunityInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityInfo(request.user[0].volunteer_id, request.opportunityID));
    });


app.post('/addOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunity(request.user[0].volunteer_id, request.oppData));
    });


app.post('/editOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.editOpportunity(request.user[0].volunteer_id, request.oppData));
    });

app.post('/deleteOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.deleteOpportunity(request.user[0].volunteer_id, request.opportunityID));
    });


app.post('/getOpportunityTypes', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityTypes(request.user[0].volunteer_id));
    });


app.post('/addOpportunityType', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunityType(request.user[0].volunteer_id, request.opportunityType));
    });


app.post('/getTeamsForViewable', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getTeamsForViewable(request.user[0].volunteer_id));
    });



/////////VOLUNTEERING DATA REQUESTS/////////////////////////////////////////////
app.post('/getVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.getVolunteeringData(request.user[0].volunteer_id, request.volunteerID));
    });

app.post('/addVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.addVolunteeringData(request.user[0].volunteer_id, request.volunteerID));
    });

app.post('/editVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.editVolunteeringData(request.user[0].volunteer_id, request.volunteerID));
    });


/////////VOLUNTEER REQUESTS/////////////////////////////////////////////
app.post('/getVolunteerData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerData(request.user[0].volunteer_id, request.volunteerID));
    });


app.post('/getVolunteerInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerInfo(request.user[0].volunteer_id, request.volunteerID));
    });


app.post('/editVolunteer', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.editVolunteer(request.user[0].volunteer_id, request.volunteerData));
    });


app.post('/addVolunteer', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.addVolunteer(request.user[0].volunteer_id, request.body));
    });


app.post('/updateUserInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.updateUserInfo(request.user[0].volunteer_id, request.userInfo));
    });



/////////TEAM REQUESTS//////////////////////////////////////////////////
app.post('/getTeamData', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamData(request.user[0].volunteer_id, request.teamID));
    });


app.post('/getTeamInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamInfo(request.user[0].volunteer_id, request.teamID));
    });


app.post('/editTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.editTeam(request.user[0].volunteer_id, request.teamData));
    });


app.post('/addTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.addTeam(request.user[0].volunteer_id, request.teamData));
    });


app.post('/getTeamsForViewable', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamsForViewable(request.user[0].volunteer_id));
    });



/////////AUTHENTICATION REQUESTS////////////////////////////////////////
app.post('/signIn', function(request, response, next) {
    passport.authenticate('local', function(err, user, info) {
    if (err) { 
        return next(err); 
    }

    if (!user) { 
        //return response.redirect('/signIn');
        return response.render('pages/signIn', { 'message': info.message}); 
    }
    else {
        request.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }

            return response.redirect('home');
        });
    }
    
    })(request, response, next);
  });
////////////////////////////////////////////////////////////////////////
// END OF POST REQUESTS
////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////
// PASSPORT AUTHENTIFICATION FUNCTIONS
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
//
// Authenticate users using passport
//
// idea for using session based login came from a medium article https://medium.com/@timtamimi/getting-started-with-authentication-in-node-js-with-passport-and-postgresql-2219664b568c
//
////////////////////////////////////////////////////////////////////////
passport.use('local', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {

    loginAttempt();
    async function loginAttempt() {
  
        try {
          console.log("CURRENT USERNAME IS " + username);
          database.queryDB('SELECT firstname, lastname, volunteer_id, email, password FROM volunteer WHERE firstname=\'' + username + '\';', function (result, err) {
    
              if (err) {
                console.log('Error Occured: ');
                console.log(err);
                return done(err);
              }
  
              if (result.rows[0] == null) {
                console.log("Oops. Incorrect login details.");
                return done(null, false, { message: 'Incorrect Username' });
              }
              else {
  
                  bcrypt.compare(password, result.rows[0].password, function (err, isMatch) {
                    if (err) throw err;
                    else if (isMatch) {
                        console.log("Passwords matched!");
                        return done(null, [{ firstname: result.rows[0].firstname, volunteer_id: result.rows[0].volunteer_id, email: result.rows[0].email }]);
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