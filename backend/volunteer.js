////////////////////////////////////////////////////////////////////////
// volunteer.js -- backend functions for volunteer related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const general = require('./general');
const error = require('./errorCodes');




////////////////////////////////////////////////////////////
// Will get the volunteer data
//
// @param[in]  clientID         volunteerID of client making function call
// @param[in]  volunteerID      ID of volunteer client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerData    Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteerData = async (clientID, volunteerID) => 
    {
    var response = {success: false, errorCode: -1, volunteerData: []};

    try 
        {
        console.log('getVolunteerData() called by: ' + clientID);

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
        
        response.errorCode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorCode = error.SERVER_ERROR;
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
// @param[in]  clientID         volunteerID of client making function call
// @param[in]  volunteerID      ID of volunteer client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteerInfo = async (clientID, volunteerID) => 
    {
    var response = {success: false, errorCode: -1, volunteerInfo: []};

    try 
        {
        console.log('getVolunteerInfo() called by: ' + clientID);

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
        
        response.errorCode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorCode = error.SERVER_ERROR;
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
// @param[in]  clientID                 volunteerID of client making function call
// @param[in]  volunteerData            Data of volunteer to be added
//
// @param[out] {success, errorCode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.editVolunteer = async (clientID, volunteerData) => 
    {
    var response = {success: false, errorCode: -1};

    try 
        {
        console.log('editVolunteer() called by: ' + clientID);

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
        
        response.errorCode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorCode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of editVolunteer() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will addVolunteer to database
//
// @param[in]  clientID                 volunteerID of client making function call
// @param[in]  volunteerData            Data of volunteer to be added
//
// @param[out] {success, errorCode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.addVolunteer = async (clientID, volunteerData) => 
    {
    var response = {success: false, errorCode: -1};

    try 
        {
        console.log('addVolunteer() called by: ' + clientID);

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
        
        response.errorCode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorCode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of addVolunteer() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will addVolunteer to database
//
// @param[in]  clientID                 volunteerID of client making function call
// @param[in]  userInfo                 Info of user to be updated
//
// @param[out] {success, errorCode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.updateUserInfo = async (clientID, userInfo) => 
    {
    var response = {success: false, errorCode: -1};

    try 
        {
        console.log('updateUserInfo() called by: ' + clientID);

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
        
        response.errorCode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorCode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of updateUserInfo() is: ' + response.success);
    
    return response;
    }