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
// Will get the volunteer data
//
// @param[in]  user         volunteerID of client making function call
// @param[in]  volunteerID      ID of volunteer client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerData    Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteerData = async (user, volunteerID) => 
    {
    var response = {success: false, errorcode: -1, volunteerData: []};

    try 
        {
        console.log('getVolunteerData() called by: ' + user);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        var volunteerElement = 
            {
            firstName: "Ryan",
            lastName: "Stolys",
            email: "rstolys@sfu.ca", 
            type: 1,
            id: 1, 
            teamName: "M - Golf", 
            teamID: 1, 
            volHours: 23, 
            volunteeringData: null
            };
            
        
        response.volunteerData.push(volunteerElement);
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
// Will get the volunteer info
//
// @param[in]  user             volunteerID of client making function call
// @param[in]  volunteerID      ID of volunteer client is looking for detail on
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
        console.log('getVolunteerInfo() called by: ' + user);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        var volunteerElement = 
            {
            firstName: "Ryan",
            lastName: "Stolys",
            email: "rstolys@sfu.ca", 
            teamName: "M - Golf", 
            volHours: 23, 
            id: 1 
            };
                
        
        response.volunteerInfo.push(volunteerElement);
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
// Will editVolunteer to database
//
// @param[in]  user                 volunteerID of client making function call
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
        console.log('editVolunteer() called by: ' + user);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        //Add volunteerData
        //JSON element is in form
        /*
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
// Will addVolunteer to database
//
// @param[in]  user                 volunteerID of client making function call
// @param[in]  volunteerData            Data of volunteer to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.addVolunteer = async (user, volunteerData) => {
    var response = {success: false, errorcode: error.UNKNOWN_ERROR};
    var errorOccurred = false;

    try {
        console.log('addVolunteer() called by: ' + user);


        //Validate inputs here

        //If input is false
        // use -- INVALID_INPUT_ERROR
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        //Add volunteerData
        //JSON element is in form
        /*
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
        */
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


////////////////////////////////////////////////////////////
// Will update user info in database
//
// @param[in]  user                     volunteerID of client making function call
// @param[in]  userInfo                 Info of user to be updated
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.changePassword = async (user, userInfo) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('changePassword() called by: ' + user);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        //update the userInfo
        //JSON element is in form
        /*
        userInfo = 
            {
            displayName: <string>,
            teamName: <string>, 
            email: <string>,    
            };
        //*** Note the password wasn't passed since we will update passwords using seperate method ***
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
    console.log('Result of changePassword() is: ' + response.success);
    
    return response;
    }