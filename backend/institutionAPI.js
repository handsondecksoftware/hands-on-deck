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
const general = require('./general');


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

        //Set the query
        var query = "SELECT institution_id AS id, name, location, numvolunteers, totalhours";
        query += " FROM institution AS i";
        query += " LEFT JOIN (SELECT institution_id AS id, COUNT(*) AS numvolunteers, SUM(num_hours) AS totalhours FROM volunteer_stats GROUP BY institution_id) i_stats";
        query += " ON i_stats.id = i. institution_id";
        query += " WHERE i.institution_id = " + user.institution_id + ";"

        if(user.volunteer_type == enumType.VT_DEV || user.volunteer_type == enumType.VT_ADMIN)
            {
            await database.queryDB(query, (res, e) => 
                { 
                if(e) 
                    {
                    console.log("DATABASE ERROR: " + e.message);
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
    var query = "";

    try 
        {
        console.log('editInstitutionInfo() called by: ' + user.volunteer_id);

        //Validate the inputs from iInfo
        if(general.verifyInput(iInfo.name) && general.verifyInput(iInfo.location))
            {
            //Inputs are valid, Make sure the volunteer is of proper type
            if(user.volunteer_type == DEV || user.volunteer_type == ADMIN)
                {
                query =  "UPDATE institution SET";
                query += " name = '" + iInfo.name + "', location = '" + iInfo.location;
                query += "' WHERE institution_id = " + user.institution_id + ";";
                }
            }

        if(user.volunteer_type == DEV || user.volunteer_type == ADMIN)
            {
            await database.queryDB(query, (res, e) => 
                { 
                if(e) 
                    {
                    console.log("DATABASE ERROR: " + e.message);
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