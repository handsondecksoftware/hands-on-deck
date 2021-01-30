////////////////////////////////////////////////////////////////////////
// volunteeringData.js -- backend functions for volunteering data related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
// Jayden Cole, 18/01/21
//    - Update to current design documentation
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const general = require('./general');
const error = require('./errorCodes');


////////////////////////////////////////////////////////////
// Will get the volunteering data
//
// @param[in]  volunteerID      ID of volunteer client is looking for detail on
// @param[in]  dataID []        Volunteering data IDs to be accessed                    
//
// @param[out] volunteerData    Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteeringData = async (volunteerID, dataID) => 
    {
    var response = {success: false, errorCode: -1, volunteeringData: []};

    try 
        {
        console.log('getVolunteeringData() called by: ' + volunteerID);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        // Will need to check that the user is either admin (can access all of their own volunteer data elements)
        //      or  that user is accessing their own data elements

        //Set some default values to use for now
        var dataElement = 
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
            
        
        response.volunteerData.push(dataElement);
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
    console.log('Result of getVolunteeringData() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will add the volunteering data to the database
//
// @param[in]  volunteerID          ID of volunteer client who is adding data
// @param[in]  volunteeringData     Volunteering data to be added to database                 
//
// @param[out] volunteerData        Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.addVolunteeringData = async (volunteerID, volunteeringData) => 
    {
    var response = {success: false, errorCode: -1};

    try 
        {
        console.log('addVolunteeringData() called by: ' + volunteerID);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        // Will need to check that the user is either admin (can access all of their own volunteer data elements)
        //      or  that user is accessing their own data elements

        //Set some default values to use for now
        var dataElement = 
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
            
        
        // response.volunteerData.push(dataElement);
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        response.errorCode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorCode = error.SERVER_ERROR;
        // response.volunteerData = null;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of addVolunteeringData() is: ' + response.success);
    
    return response;
    }


    
////////////////////////////////////////////////////////////
// Will edit the volunteering data
//
// @param[in]  volunteerID          ID of volunteer client who is editing
// @param[in]  volunteeringData     Volunteering data to be added to database                 
//
// @param[out] volunteerData        Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.editVolunteeringData = async (volunteerID, volunteeringData) => 
{
var response = {success: false, errorCode: -1};

try 
    {
    console.log('editVolunteeringData() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    
    // Will need to check that the user is either admin (can access all of their own volunteer data elements)
    //      or  that user is accessing their own data elements

    //Set some default values to use for now
    var dataElement = 
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
console.log('Result of editVolunteeringData() is: ' + response.success);

return response;
}