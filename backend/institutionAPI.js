////////////////////////////////////////////////////////////////////////
// institutionAPI.js -- API for instituiton calls
//                  
// Ryan Stolys, 17/02/21
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const error = require('./errorCodes');


////////////////////////////////////////////////////////////
//
// Will get the volunteers instituion information
//
////////////////////////////////////////////////////////////
exports.getInstitutionInfo = async user => 
    {
    var response = {success: false, errorcode: -1, iInfo: null};

    try 
        {
        console.log('getInstitutionInfo() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        response.iInfo = 
            {
            id: user.institution_id,
            name: "Simon Fraser University",
            location: "Burnaby, BC", 
            numVolunteers: 2, 
            totalHours: 5,
            }
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.iInfo = null;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getInstitutionInfo() is: ' + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
//
// Will edit the volunteers instituion info 
//
////////////////////////////////////////////////////////////
exports.editInstitutionInfo = async (user, iInfo) => 
    {
    var response = {success: false, errormessage: -1};

    try 
        {
        console.log('editInstitutionInfo() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        // Query to update instituion stats
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        response.errormessage = "";
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errormessage = "Something unexpected happened. Please try again";
        response.success = false;
        }

    //Log completion of function
    console.log('Result of editInstitutionInfo() is: ' + response.success);

    return response;
    }