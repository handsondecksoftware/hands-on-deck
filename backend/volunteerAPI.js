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

    try 
        {
        console.log('getVolunteerInfo() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        var volunteerElement = 
            {
            id: 1,
            name: "Ryan Stolys",
            email: "rstolys@sfu.ca",
            leaderboards: true, 
            teamname: "M - Golf", 
            team_id: 1,
            numhours: 23, 
            };
        response.volunteerInfo.push(volunteerElement);

        var volunteerElement2 = 
            {
            id: 2,
            name: "Jayden Cole",
            email: "jcole@sfu.ca",
            leaderboards: true, 
            teamname: "M - Swim", 
            team_id: 1,
            numhours: 34, 
            };
        response.volunteerInfo.push(volunteerElement2);
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        response.errorcode = error.NOERROR;
        response.success = true;
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