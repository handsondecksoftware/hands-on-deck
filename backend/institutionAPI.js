////////////////////////////////////////////////////////////////////////
// institutionAPI.js -- API for instituiton calls
//                  
// Ryan Stolys, 17/02/21
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const error = require('./errorCodes');
const enumType = require('./enumTypes');


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

        if(user.volunteer_type == enumType.VT_DEV || user.volunteer_type == enumType.VT_ADMIN)
            {
            await database.queryDB("SELECT institution_id AS id, name, location FROM institution WHERE institution_id = '" + user.institution_id + "';",
            (res, e) => 
                { 
                if(e) 
                    {
                    console.log("error occured")
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    }
                else 
                    {
                    //Send the user an email with their account info 
                    response.iInfo = res.rows[0];
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
    
            //Set some default values to use for now
            response.iInfo['numVolunteers'] = 2;
            response.iInfo['totalHours'] = 5;
            }
        else 
            {
            response.iInfo = null;
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            }
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
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('editInstitutionInfo() called by: ' + user.volunteer_id);

        if(user.volunteer_type == DEV || user.volunteer_type == ADMIN)
            {
            await database.queryDB("UPDATE institution SET name = '" + iInfo.name + "', location = '" + iInfo.location + "' WHERE institution_id = '" + user.institution_id + "';",
            (res, e) => 
                { 
                if(e) 
                    {
                    console.log("error occured")
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    }
                else 
                    {
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
            }
        else 
            {
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            }
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