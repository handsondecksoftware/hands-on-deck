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
//var passport = require('passport');
const cookieParser = require('cookie-parser');
//const LocalStrategy = require('passport-local').Strategy; // strategy for authenticating with a username and password
const session = require('express-session');     //Do we need this?
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const SECRETKEY = "secretkey";      //Should probably revise this and should probably be an environment variable
const WEB_EXPIRY = "15m";
const APP_EXPIRY = "24h";
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


// app.use(session({
//     secret: 'bulky keyboard',
//     resave: true,
//     cookie: { maxAge: MILISECS_IN_SECOND * SECONDS_IN_HOUR * HOURS_IN_DAY },
//     saveUninitialized: true
// }))
// app.use(passport.initialize())
// app.use(passport.session())
////////////////////////////////////////////////////////////////////////
// END OF EXPRESS AND PASSPORT SETUP
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// GET REQUESTS
////////////////////////////////////////////////////////////////////////
app.get('*', async function (req, res, next) { // universal access variable, keep working
    
    //Log status of user
    //console.log("THE USER IS currently " + req.isAuthenticated());

    // res.locals.user = req.user || null;
    // if (res.locals.user != null) {
    //     console.log("the user is");
    //     console.log(res.locals.user);
    // }
  
    next();
})


app.get('/', (request, response) => {
    //Always send to signin
	response.redirect('signIn');
});

app.get('/home', auth.authcheck, (request, response) => {
    response.render('pages/home', { home: true, opps: false, volunt: false, teams: false, settings: false});
});

app.get('/volunteers', auth.authcheck, (request, response) => {
    response.render('pages/volunteers', { home: false, opps: false, volunt: true, teams: false, settings: false});
});

app.get('/opportunities', auth.authcheck, (request, response) => {
    response.render('pages/opportunities', { home: false, opps: true, volunt: false, teams: false, settings: false});
});

app.get('/teams', auth.authcheck, (request, response) => {
    response.render('pages/teams', { home: false, opps: false, volunt: false, teams: true, settings: false});
});

app.get('/settings', auth.authcheck, (request, response) => {
    response.render('pages/settings', { home: false, opps: false, volunt: false, teams: false, settings: true});
});

app.get('/signIn', (request, response) =>  {
    response.render('pages/signIn', { 'message': (request.message || '')});
});

app.get('/logout', auth.authcheck, function (req, res) {
    console.log("Upon logout user status is still valid. It is the responsibility of the client to delete their token.");
    // We can keep track of expired tokens in our database and then check against that 
    //  each time we do a new server call to make sure the token is valid. Then we can set a trigger
    //  on that table to remove rows whenever a new write (or read?) is made to that table
    // https://stackoverflow.com/questions/26046816/is-there-a-way-to-set-an-expiry-time-after-which-a-data-entry-is-automaticall 
    // More in-depth explanation of jwt expiry not being easily possible is here: https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6 
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
    response.send(await institution.getInstitutionInfo(request.user));
    });

app.get('/api/editInstitutionStats', auth.authcheck, async (request, response) =>
    {
    response.send(await institution.editInstitutionInfo(request.user, request.body.iInfo));
    });

/* We don't need this yet -- can be implemented later
app.get('/api/addInstitution', auth.authcheck, async (request, response) =>
    {
    response.send(await institution.addInstitution(request.user, request.iInfo));
    });
*/


/////////VOLUNTEER API CALLS/////////////////////////////////////////////
app.get('/api/getVolunteerInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerInfo(request.user, request.body.vol_ID));
    });

app.get('/api/getVolunteerData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerData(request.user, request.body.vol_ID));
    });

app.get('/api/editVolunteer', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.editVolunteer(request.user, request.body.volunteerData));
    });

app.get('/api/changePassword', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.changePassword(request.user, request.body.oldPassword, request.body.newPassword));
    });

/* Can add this at the end. Volunteers are added from app through the "createAccount" api call
app.get('/api/addVolunteer', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.addVolunteer(request.user, request.body.volunteerData));
    });
*/



/////////VOLUNTEERING DATA API CALLS/////////////////////////////////////////////
app.get('/api/getVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.getVolunteeringData(request.user, request.body.vol_ID));
    });

app.get('/api/addVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.addVolunteeringData(request.user, request.body.volunteeringData));
    });

app.get('/api/editVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.editVolunteeringData(request.user, request.body.volunteeringData));
    });



/////////TEAM API CALLS//////////////////////////////////////////////////
app.get('/api/getTeamInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamInfo(request.user, request.body.teamID));
    });

app.get('/api/getTeamData', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamData(request.user, request.body.teamID));
    });

app.get('/api/editTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.editTeam(request.user, request.teamData));
    });

app.get('/api/addTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.addTeam(request.user, request.body.teamData));
    });

app.get('/api/getTeamsForViewable', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamsForViewable(request.user));
    });



/////////OPPORTUNITY API CALLS//////////////////////////////////////////
app.get('/api/getAllOpportunityInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getAllOpportunityInfo(request.user, request.body.oppID));
    });

app.get('/api/getOpportunityInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityInfo(request.user, request.body.oppID));
    });

app.get('/api/getOpportunityData', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityData(request.user, request.body.oppID));
    });

app.get('/api/addOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunity(request.user, request.body.oppData));
    });


app.get('/api/editOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.editOpportunity(request.user, request.body.oppData));
    });


app.get('/api/deleteOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.deleteOpportunity(request.user, request.body.opportunityID));
    });


app.get('/api/getOpportunityTypes', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityTypes(request.user));
    });

/* Not availible due to use of enum for opp types
app.get('/api/addOpportunityType', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunityType(request.user, request.body.opportunityType));
    });
*/

app.get('/api/getTeamsForViewable', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getTeamsForViewable(request.user));
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
    const isMobile = JSON.parse(request.query.isMobile); 
        // JSON.parse() ensures that isMobile acts as a boolean instead of string

    try 
        {
        //console.log("CURRENT USERNAME IS " + email);
        //Query database
        database.queryDB("SELECT volunteer_id, institution_id, email, password, volunteertype FROM volunteer WHERE email='" + email + "';", (result, err) => 
            {
            if (err) 
                {
                console.log('Error Occured: ');
                console.log(err);

                if(isMobile)
                    response.send({success: false, session: null, message: "Unknown Database Error Occurred"});
                else
                    response.render('pages/signIn', { 'message': "Unknown Database Error Occurred"}); 
                }
            else 
                {
                //If there is no user matching the provided email
                if(result.rows[0] == null) 
                    {
                    console.log("Oops. Incorrect login details.");

                    if(isMobile)
                        response.send({success: false, session: null, message: "Incorrect Email"});
                    else
                        response.render('pages/signIn', { 'message': "Incorrect Email"}); 
                    }
                else 
                    {
                    bcrypt.compare(password, result.rows[0].password, (err, isMatch) => 
                        {
                        if (err) throw err;
                        else if (isMatch)       //Passwords matched
                            {
                            //console.log("Passwords matched!");
                            //Define payload data for user 
                            var user = {
                                email: email,
                                institution_id: result.rows[0].institution_id,
                                volunteer_id: result.rows[0].volunteer_id,
                                volunteertype: result.rows[0].volunteertype
                            };

                            //if user log in success, generate a JWT token for the user with a secret key
                            jwt.sign({user}, SECRETKEY, { expiresIn: (isMobile ? APP_EXPIRY : WEB_EXPIRY) }, (err, token) => 
                                {
                                if(err) { console.log(err) }
                                else
                                    {
                                    if(isMobile)
                                        response.send({success: true, session: token, message: "Successful Sign In"});
                                    else 
                                        {
                                        //Set the token in the cookie
                                        response.cookie('tokenKey', token);
                                        return response.redirect('../home');
                                        }
                                    }
                                
                                });
                            }
                        else 
                            {
                            console.log("Oops. Incorrect login details.");

                            if(isMobile)
                                response.send({success: false, session: null, message: "Incorrect Password"});
                            else
                                response.render('pages/signIn', { 'message': "Incorrect Password"}); 
                            }
                        });
                    }
                }
            });
        }
    catch (e) { throw (e); }
});

// app.get('/api/signIndummy', function(request, response, next) {
//     passport.authenticate('local', (err, user, info) => {
//     if (err) { 
//         return next(err); 
//     }

//     if (!user) { 
//         return response.render('pages/signIn', { 'message': info.message}); 
//     }
//     else {
//         request.logIn(user, (err) => {
//             if (err) { 
//                 return next(err); 
//             }

//             var isMobile = JSON.parse(request.query.isMobile);
//             if(isMobile)
//                 {
//                 return response.send({success: true, session: user, message: "Successful Sign In"});
//                 }
//             else
//                 {
//                 return response.redirect('../home');
//                 }
                
//         });
//     }
    
//     })(request, response, next);
//   });
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
// passport.use('local', new LocalStrategy({ passReqToCallback: true }, (req, email, password, done) => {

//     loginAttempt();
//     async function loginAttempt() {
  
//         try {
//           console.log("CURRENT USERNAME IS " + email);
//           database.queryDB('SELECT volunteer_id, institution_id, email, password, volunteertype FROM volunteer WHERE email=\'' + email + '\';', function (result, err) {
    
//               if (err) {
//                 console.log('Error Occured: ');
//                 console.log(err);
//                 return done(err);
//               }
  
//               if (result.rows[0] == null) {
//                 console.log("Oops. Incorrect login details.");
//                 return done(null, false, { message: 'Incorrect Email' });
//               }
//               else {
  
//                   bcrypt.compare(password, result.rows[0].password, function (err, isMatch) {
//                     if (err) throw err;
//                     else if (isMatch) {
//                         console.log("Passwords matched!");
//                         return done(null, [{ institution_id: result.rows[0].institution_id, volunteer_id: result.rows[0].volunteer_id, volunteertype: result.rows[0].volunteertype}]);
//                       }
//                       else {
//                         console.log("Oops. Incorrect login details.");
//                         return done(null, false, { message: 'Incorrect Password' });
//                         }
//                     });
//                 };
//           })
//          }
//         catch (e) { throw (e); }
//     };
// }));


////////////////////////////////////////////////////////////////////////
//
// Used by passport
//
////////////////////////////////////////////////////////////////////////
// passport.serializeUser(function (user, done) {
//   //console.log(user);
//   done(null, user);
// });

////////////////////////////////////////////////////////////////////////
//
// Used by passport
//
////////////////////////////////////////////////////////////////////////
// passport.deserializeUser(function (user, done) {
//   //console.log("deserial" + user);
//   done(null, user);
// });

////////////////////////////////////////////////////////////////////////
// END OF PASSPORT AUTHENTIFICATION FUNCTIONS
////////////////////////////////////////////////////////////////////////