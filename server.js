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
var express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const SECRETKEY = "it'sALL____ON____";      //Should probably revise this and should probably be an environment variable
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

//const error = require('./backend/errorCodes');

const institution = require('./backend/institutionAPI');
const volunteer = require('./backend/volunteerAPI');
const volunteerData = require('./backend/volunteeringDataAPI');
const opportunity = require('./backend/opportunityAPI');
const team = require('./backend/teamAPI');
const auth = require('./backend/authentication');
const error = require('./backend/errorCodes');
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


////////////////////////////////////////////////////////////////////////
// END OF EXPRESS AND PASSPORT SETUP
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// GET REQUESTS
////////////////////////////////////////////////////////////////////////
/*
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
*/


app.get('/', (request, response) => {
    //Always send to signin
	response.redirect('signIn');
});

app.get('/home', auth.authcheck_get, (request, response) => {
    console.log("Rendering home");
    response.render('pages/home', { home: true, opps: false, volunt: false, teams: false, settings: false});
});

app.get('/volunteers', auth.authcheck_get, (request, response) => {
    console.log("Rendering vols");
    response.render('pages/volunteers', { home: false, opps: false, volunt: true, teams: false, settings: false});
});

app.get('/opportunities', auth.authcheck_get, (request, response) => {
    console.log("Rendering opps");
    response.render('pages/opportunities', { home: false, opps: true, volunt: false, teams: false, settings: false});
});

app.get('/teams', auth.authcheck_get, (request, response) => {
    console.log("Rendering teams");
    response.render('pages/teams', { home: false, opps: false, volunt: false, teams: true, settings: false});
});

app.get('/settings', auth.authcheck_get, (request, response) => {
    response.render('pages/settings', { home: false, opps: false, volunt: false, teams: false, settings: true});
});

app.get('/signIn', (request, response) =>  {
    response.render('pages/signIn', { 'message': (request.message || '')});
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
    response.send(await institution.getInstitutionInfo(request.user));
    });

app.post('/api/getAllInstitutionInfo', async (request, response) =>
    {
    response.send(await institution.getAllInstitutionInfo());
    });

app.post('/api/editInstitutionInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await institution.editInstitutionInfo(request.user, request.body.iInfo));
    });

/* We don't need this yet -- can be implemented later
app.post('/api/addInstitution', auth.authcheck, async (request, response) =>
    {
    response.send(await institution.addInstitution(request.user, request.iInfo));
    });
*/


/////////VOLUNTEER API CALLS/////////////////////////////////////////////
app.post('/api/getVolunteerInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerInfo(request.user, request.body.vol_ID));
    });

app.post('/api/getVolunteerData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerData(request.user, request.body.vol_ID));
    });

app.post('/api/editVolunteer', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.editVolunteer(request.user, request.body.volunteerData));
    });

app.post('/api/changePassword', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.changePassword(request.user, request.body.oldPassword, request.body.newPassword));
    });

/* Can add this at the end. Volunteers are added from app through the "createAccount" api call
app.post('/api/addVolunteer', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.addVolunteer(request.user, request.body.volunteerData));
    });
*/



/////////VOLUNTEERING DATA API CALLS/////////////////////////////////////////////
app.post('/api/getVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.getVolunteeringData(request.user, request.body.vol_ID));
    });

app.post('/api/getVolunteeringDataInstance', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.getVolunteeringDataInstance(request.user, request.body.vdata_ID));
    });

app.post('/api/addVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.addVolunteeringData(request.user, request.body.volunteeringData));
    });

app.post('/api/editVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.editVolunteeringData(request.user, request.body.volunteeringData));
    });

app.post('/api/deleteVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.deleteVolunteeringData(request.user, request.body.vdata_ID));
    });

app.post('/api/validateVolunteeringData', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteerData.validateVolunteeringData(request.user, request.body.vdata_ID, request.body.validated));
    });



/////////TEAM API CALLS//////////////////////////////////////////////////
app.post('/api/getTeamInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamInfo(request.user, request.body.teamID));
    });

app.post('/api/getAllTeamInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getAllTeamInfo(request.body.institution_id));
    });

app.post('/api/getTeamData', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamData(request.user, request.body.teamID));
    });

app.post('/api/editTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.editTeam(request.user, request.teamData));
    });

app.post('/api/addTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.addTeam(request.user, request.body.teamData));
    });

app.post('/api/deleteTeam', auth.authcheck, async (request, response) =>
    {
    response.send(await team.deleteTeam(request.user, request.body.teamID));
    });

app.post('/api/getTeamsForViewable', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamsForViewable(request.user));
    });



/////////OPPORTUNITY API CALLS//////////////////////////////////////////
app.post('/api/getAllOpportunityInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getAllOpportunityInfo(request.user, request.body.oppID));
    });

app.post('/api/getOpportunityInfo', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityInfo(request.user, request.body.oppID));
    });

app.post('/api/getOpportunityData', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityData(request.user, request.body.oppID));
    });

app.post('/api/addOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunity(request.user, request.body.oppData));
    });


app.post('/api/editOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.editOpportunity(request.user, request.body.oppData));
    });


app.post('/api/deleteOpportunity', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.deleteOpportunity(request.user, request.body.oppID));
    });


app.post('/api/getOpportunityTypes', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.getOpportunityTypes(request.user));
    });

/* Not availible due to use of enum for opp types
app.post('/api/addOpportunityType', auth.authcheck, async (request, response) =>
    {
    response.send(await opportunity.addOpportunityType(request.user, request.body.opportunityType));
    });
*/

/////////LEADERBOARD API CALLS///////////////////////////////////////////////
app.post('/api/getVolunteerLeaderboard', auth.authcheck, async (request, response) =>
    {
    response.send(await volunteer.getVolunteerLeaderboard(request.user));
    });


app.post('/api/getTeamLeaderboard', auth.authcheck, async (request, response) =>
    {
    response.send(await team.getTeamLeaderboard(request.user));
    });


/////////ACCOUNT/ AUTHENTICATION API CALLS///////////////////////////////////////////////
app.post('/api/createAccount', async (request, response) =>
    {
    //Temp response until we implement this funtionality
    response.send(await volunteer.createAccount(request.body));
    });

app.post('/api/isTokenValid',  auth.authcheck, async (request, response) =>
    {
    //if authcheck passes the token is valid
    response.send({success: true, errorcode: error.NOERROR});
    });


app.post('/api/logout', auth.makeTokenInvalid, (request, response) => 
    {
    response.send({success: true, session: null, message: "Logout Successful"});
    });


app.post('/api/signIn', function(request, response, next) 
    {

    try 
        {
        const username = request.body.username;
        const password = request.body.password;
        const isMobile = JSON.parse(request.body.isMobile); 
            // JSON.parse() ensures that isMobile acts as a boolean instead of string

        //Query database
        database.queryDB("SELECT volunteer_id, institution_id, username, password, volunteer_type FROM volunteer WHERE username='" + username + "';", (result, err) => 
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
                        response.send({success: false, session: null, message: "Incorrect Username"});
                    else
                        response.render('pages/signIn', { 'message': "Incorrect Username"}); 
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
                                username: username,
                                institution_id: result.rows[0].institution_id,
                                volunteer_id: result.rows[0].volunteer_id,
                                volunteer_type: result.rows[0].volunteer_type
                            };

                            //if user log in success, generate a JWT token for the user with a secret key
                            jwt.sign({user}, SECRETKEY, { expiresIn: (isMobile ? APP_EXPIRY : WEB_EXPIRY) }, (err, token) => 
                                {
                                if(err) { console.log(err) }
                                else
                                    {
                                    if(isMobile)
                                        response.send({success: true, access_token: token, message: "Successful Sign In"});
                                    else 
                                        {
                                        response.cookie("access_token", token)
                                        return response.redirect('../home');
                                        }
                                    }
                                });
                            }
                        else 
                            {
                            //console.log("Oops. Incorrect login details.");

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
    catch (e) 
        { 
        console.log("UNEXPECTED ERROR OCCURRED");
        console.log("Sent Request Body:");
        console.log(request);
        console.log("Error:");
        console.log(e); 

        response.send({success: false, session: null, message: "An Unexpected Error Occurred"});
       
        //throw (e); 
        }
    });
////////////////////////////////////////////////////////////////////////
// END OF API INTERFACE
////////////////////////////////////////////////////////////////////////