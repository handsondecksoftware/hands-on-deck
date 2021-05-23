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
const util = require('./utils');


////////////////////////////////////////////////////////////
//
// Will get the volunteers instituion information
//
////////////////////////////////////////////////////////////
exports.getInstitutionInfo = async user => 
    {
    var response = {success: false, errorcode: -1, iInfo: null};
    var values = [];
    var query = "";

    try 
        {
        util.logINFO("getInstitutionInfo(): called by: " + user.volunteer_id);

        //Set the query
        query =  "SELECT institution_id AS id, name, location, numvolunteers, totalhours";
        query += " FROM institution AS i";
        query += " LEFT JOIN (SELECT institution_id AS id, COUNT(*) AS numvolunteers, SUM(num_hours) AS totalhours FROM volunteer_stats GROUP BY institution_id) i_stats";
        query += " ON i_stats.id = i. institution_id";
        query += " WHERE i.institution_id = $1;"

        values.push(user.institution_id);

        if(user.volunteer_type == enumType.VT_DEV || user.volunteer_type == enumType.VT_ADMIN)
            {
            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("getInstitutionInfo(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    response.iInfo = res.rows[0];
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
            }
        else 
            {
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            util.logWARN("getInstitutionInfo(): User is of type: " + user.volunteer_type, error.PERMISSION_ERROR);
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.iInfo = null;
        response.success = false;

        util.logWARN("getInstitutionInfo(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getInstitutionInfo(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getInstitutionInfo(): Result is: " + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
//
// Will get the volunteers instituion information
//
////////////////////////////////////////////////////////////
exports.getAllInstitutionInfo = async () => 
    {
    var response = {success: false, errorcode: -1, iInfo: []};
    var query = "";
    var values = [];

    try 
        {
        util.logINFO("getAllInstitutionInfo(): called");

        //Set the query -- need to exclude the developer accounts
        query = "SELECT institution_id AS id, name, location FROM institution WHERE institution_id >= 1;";

        await database.queryDB(query, values, (res, e) => 
            { 
            if(e) 
                {
                response.errorcode = error.DATABASE_ACCESS_ERROR;
                response.success = false;
                util.logWARN("getAllInstitutionInfo(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                }
            else 
                {
                response.iInfo = res.rows;
                response.errorcode = error.NOERROR;
                response.success = true;
                }
            });
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.iInfo = [];
        response.success = false;

        util.logWARN("getAllInstitutionInfo(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getAllInstitutionInfo(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getAllInstitutionInfo(): Result is: " + response.success);

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
    var values = [];

    try 
        {
        util.logINFO("getAllInstitutionInfo(): called by: " + user.volunteer_id);

        //Validate the inputs from iInfo
        if(iInfo.name.length > 0 && iInfo.location.length > 0)
            {
            //Inputs are valid, Make sure the volunteer is of proper type
            if(user.volunteer_type == enumType.VT_DEV || user.volunteer_type == enumType.VT_ADMIN)
                {
                query =  "UPDATE institution SET";
                query += " name = $1, location = $2";
                query += " WHERE institution_id = $3;";

                values.push(iInfo.name);
                values.push(iInfo.location);
                values.push(user.institution_id);
                }
            }

        if(user.volunteer_type == enumType.VT_DEV || user.volunteer_type == enumType.VT_ADMIN)
            {
            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("editInstitutionInfo(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
            util.logWARN("editInstitutionInfo(): User is of type: " + user.volunteer_type, error.PERMISSION_ERROR);
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("editInstitutionInfo(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("editInstitutionInfo(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("editInstitutionInfo(): Result is: " + response.success);

    return response;
    }