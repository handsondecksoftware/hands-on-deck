////////////////////////////////////////////////////////////////////////
// volunteer.js -- backend functions for volunteer related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
// Jayden Cole, 18/01/21
//    - File updated to new design document
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const general = require('./general');
const error = require('./errorCodes');
const bcrypt = require('bcryptjs');
const enumType = require('./enumTypes');


////////////////////////////////////////////////////////////
// Will get the volunteer info
//
// @param[in]  user             user information
// @param[in]  vol_ID           ID of volunteer client is looking for detail on
//                              value of -1 means all values are of interest
//
// @param[out] volunteerInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteerInfo = async (user, volunteerID) => 
    {
    var response = {success: false, errorcode: -1, volunteerInfo: []};
    var goodQuery = true;

    try 
        {
        console.log('getVolunteerInfo() called by: ' + user.volunteer_id);

        //Determine Correct Query to run
        if(volunteerID == -1 && (user.volunteer_type == enumType.VT_DEV || user.volunteer_type == enumType.VT_ADMIN))
            {
            //Set the query
            var query = "SELECT V.volunteer_id AS id, CONCAT(V.firstname, ' ', V.lastname) AS name, V.email, CONCAT(T.sex, ' - ', T.name) AS teamname, V.team_id, vd_data.numhours"; 
            query += " FROM volunteer AS V LEFT JOIN";
            query += " (SELECT VD.volunteer_id, SUM(extract(HOUR FROM (VD.endtime - VD.starttime))) AS numhours FROM volunteeringdata AS VD GROUP BY VD.volunteer_id) vd_data";
            query += " ON vd_data.volunteer_id = V.volunteer_id";
            query += " LEFT JOIN team AS T ON T.team_id = V.team_id"
            query += " WHERE V.volunteer_type != '" + enumType.VT_DEV + "' AND V.institution_id = " + user.institution_id + ";";
            }
        else if(volunteerID == 0 && user.volunteer_type == enumType.VT_VOLUNTEER)
            {
            //Set the query
            var query = "SELECT V.volunteer_id AS id, CONCAT(V.firstname, ' ', V.lastname) AS name, V.email, CONCAT(T.sex, ' - ', T.name) AS teamname, V.team_id, vd_data.numhours"; 
            query += " FROM volunteer AS V LEFT JOIN";
            query += " (SELECT VD.volunteer_id, SUM(extract(HOUR FROM (VD.endtime - VD.starttime))) AS numhours FROM volunteeringdata AS VD GROUP BY VD.volunteer_id) vd_data";
            query += " ON vd_data.volunteer_id = V.volunteer_id";
            query += " LEFT JOIN team AS T ON T.team_id = V.team_id"
            query += " WHERE V.volunteer_type != '" + enumType.VT_DEV + "' AND V.institution_id = " + user.institution_id + " AND V.volunteer_id = " + user.volunteer_id + ";";
            }
        //To access specific volunteer that is not that user they must have admin or dev privileges
        else if(volunteerID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
            {
            //Set the query
            var query = "SELECT V.volunteer_id AS id, CONCAT(V.firstname, ' ', V.lastname) AS name, V.email, CONCAT(T.sex, ' - ', T.name) AS teamname, V.team_id, vd_data.numhours"; 
            query += " FROM volunteer AS V LEFT JOIN";
            query += " (SELECT VD.volunteer_id, SUM(extract(HOUR FROM (VD.endtime - VD.starttime))) AS numhours FROM volunteeringdata AS VD GROUP BY VD.volunteer_id) vd_data";
            query += " ON vd_data.volunteer_id = V.volunteer_id";
            query += " LEFT JOIN team AS T ON T.team_id = V.team_id"
            query += " WHERE V.volunteer_type != '" + enumType.VT_DEV + "' AND V.institution_id = " + user.institution_id + " AND V.volunteer_id = " + volunteerID + ";";
            }
        else 
            {
            response.volunteerInfo = null;
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            goodQuery = false;
            }

        //Run query if query is valid
        if(goodQuery)
            {
            await database.queryDB(query, (res, e) => 
                { 
                if(e) 
                    {
                    response.volunteerInfo = null;
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    }
                else 
                    {
                    //Send the user an email with their account info 
                    response.volunteerInfo = res.rows;
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
            }
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.volunteerInfo = null;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getVolunteerInfo() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will get the volunteer data
//
// @param[in]  user             user information
// @param[in]  volunteerID      ID of volunteer client is looking for detail on
//                              value of -1 means all values are of interest
//
// @param[out] volunteerData    Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteerData = async (user, vol_ID) => 
    {
    var response = {success: false, errorcode: -1, volunteerData: []};

    try 
        {
        console.log('getVolunteerData() called by: ' + user.volunteer_id + ' for user: ' + vol_ID);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        if(vol_ID == 1)
            {
            var volunteerElement = 
                {
                id: 1,
                name: "Ryan Stolys",
                email: "rstolys@sfu.ca",
                leaderboards: true, 
                teamname: "M - Golf", 
                team_id: 1,
                numhours: 23,
                volunteeringData: null
                };
                
            
            response.volunteerData.push(volunteerElement);
            }
        else if(vol_ID == 2)
            {
            var volunteerElement = 
                {
                id: 2,
                name: "Jayden Cole",
                email: "jcole@sfu.ca",
                leaderboards: true, 
                teamname: "M - Swim", 
                team_id: 1,
                numhours: 34, 
                volunteeringData: null
                };
                
            response.volunteerData.push(volunteerElement);
            }
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.volunteerData = null;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getVolunteerData() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will editVolunteer to database
//
// @param[in]  user                     user information
// @param[in]  volunteerData            Data of volunteer to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.editVolunteer = async (user, volunteerData) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('editVolunteer() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //JSON element is in form
        /*
        var volunteerElement = 
            {
            id:
            name:
            email:
            leaderboards: 
            teammame: 
            team_id:
            numhours:
            volunteeringData:
            };
        */
              
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of editVolunteer() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will update user info in database
//
// @param[in]  user                     user information
// @param[in]  userInfo                 Info of user to be updated
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.changePassword = async (user, oldPassword, newPassword) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('changePassword() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Will need to hash oldPassword to compare it
        //The hash new password and store that 
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of changePassword() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will update user info in database
//
// @param[in]  user             user information
//
// @param[out] volunteerInfo    array of top 10 volunteers based on hours
//
////////////////////////////////////////////////////////////
exports.getVolunteerLeaderboard = async user => 
    {
    var response = {success: false, errorcode: -1, volunteerInfo: []};

    try 
        {
        console.log('getVolunteerLeaderboard() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Query only the top 10 volunteers in the list
        // Don't send any personal information such as email, team_id, user_id, or leaderboards
        // only name, team and number of hours
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        var volunteerElement = 
                {
                id: null,
                name: "Ryan Stolys",
                email: null,
                leaderboards: null, 
                teammame: "M - Golf", 
                numhours: 23,
                };

        var volunteerElement2 = 
            {
            id: null,
            name: "Jayden Cole",
            email: null,
            leaderboards: null, 
            teammame: "M - Swim", 
            numhours: 3,
            };

        response.volunteerInfo.push(volunteerElement);
        response.volunteerInfo.push(volunteerElement2);

        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.volunteerInfo = null;
        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getVolunteerLeaderboard() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will addVolunteer to database
//
// @param[in]  user                     user information
// @param[in]  volunteerData            Data of volunteer to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
/* THIS WILL NEED TO BE MOVED TO CREATE ACCOUNT
exports.addVolunteer = async (user, volunteerData) => 
    {
    var response = {success: false, errorcode: -1};
    var errorOccurred = false;

    try {
        console.log('addVolunteer() called by: ' + user);


        //Validate inputs here

        //If input is false
        // use -- INVALID_INPUT_ERROR
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        //Add volunteerData
        //JSON element is in form
        
        volunteerData = 
            {
            firstName: <string>,
            lastName: <string>,
            email: <string>, 
            type: <int>,
            id: <int>, 
            teamName: <string>, 
            teamID: <string>, 
            volHours: <int>, 
            volunteeringData []: <JSON> 
            };
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        //Generate user password
        var userPassword = general.generatePassword();

        //Hash password to store in db
        var hashedPassword = await bcrypt.hash(userPassword, 10).catch(e => {
            console.log("An Error Occured in hasing the password");
            errorOccurred = true; 
        });

        if(!errorOccurred) {
            await database.queryDB("INSERT INTO volunteer (volunteer_id, team_id, firstname, lastname, password, email, volunteertype) VALUES ('" + (Math.floor(Math.random() * 100) + 10) + "', '" + 1 + "', '" + volunteerData.firstName + "', '" + volunteerData.lastName + "', '" + hashedPassword + "', '" + volunteerData.email + "', '" + volunteerData.type + "')", 
                                (res, e) => {
                if(e) {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                }
                else {
                    //Send the user an email with their account info 
                    response.errorcode = error.NOERROR;
                    response.success = true;
                }
            });
        }
    }
    catch (err) {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
    }

    //Log completion of function
    console.log('Result of addVolunteer() is: ' + response.success);

    return response;
    }
*/