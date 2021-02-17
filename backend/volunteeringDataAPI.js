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
// @param[in]  user             user information 
// @param[in]  vol_ID           the volunteer id of the volunteering instance
//                              If the value is 0 then we will provide all info for specific volunteer                   
//
// @param[out] volunteerData    Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteeringData = async (user, vol_ID) => 
    {
    var response = {success: false, errorcode: -1, volunteeringData: []};

    try 
        {
        console.log('getVolunteeringData() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        // Will need to check that the user is either admin (can access all of their own volunteer data elements)
        //      or  that user is accessing their own data elements

        //Set some default values to use for now
        var dataElement = 
            {
            id: 1, 
            vol_id: 1, 
            opp_id: 1, 
            title: "SAAC Meeting", 
            type: "Meetings",
            starttime: 1616617800000,
            endtime: 1616625000000,
            validated: false,
            };
            
        
        response.volunteeringData.push(dataElement);
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.volunteeringData = null;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getVolunteeringData() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will add the volunteering data to the database
//
// @param[in]  user                 user information 
// @param[in]  volunteeringData     Volunteering data to be added to database                 
//
// @param[out] volunteerData        Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.addVolunteeringData = async (user, volunteeringData) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('addVolunteeringData() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
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
    console.log('Result of addVolunteeringData() is: ' + response.success);
    
    return response;
    }


    
////////////////////////////////////////////////////////////
// Will edit the volunteering data
//
// @param[in]  user                 user information 
// @param[in]  volunteeringData     Volunteering data to be added to database                 
//
// @param[out] volunteerData        Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.editVolunteeringData = async (user, volunteeringData) => 
    {
    var response = {success: false, errorCode: -1};

    try 
        {
        console.log('editVolunteeringData() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

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
    console.log('Result of editVolunteeringData() is: ' + response.success);

    return response;
    }