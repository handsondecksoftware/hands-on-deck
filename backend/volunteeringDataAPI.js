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
const util = require('./utils');
const error = require('./errorCodes');
const enumType = require('./enumTypes');
const e = require('express');


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
    var query = "";
    var values = [];
    var goodQuery = true;

    try 
        {
        util.logINFO("getVolunteeringData(): called by: " + user.volunteer_id);

        //Set the query
        query =  "SELECT volunteeringdata_id AS id, volunteer_id AS vol_id, VD.opp_id,"; 
        query += " VD.starttime, VD.endtime, validated, title, opportunity_type AS type"; 
        query += " FROM volunteeringdata AS VD, opportunity AS O WHERE VD.opp_id = O.opp_id";

        //Determine Correct Query to run
        if(vol_ID == 0)
            {
            query += " AND VD.volunteer_id = $1;";

            values.push(user.volunteer_id);
            }
        //To access specific volunteer that is not that user they must have admin or dev privileges
        else if(vol_ID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
            {
            query += " AND VD.volunteer_id = $1;";

            values.push(vol_ID);
            }
        else 
            {
            response.volunteeringData = null;
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            goodQuery = false;
            util.logWARN("getVolunteeringData(): User is of type: " + user.volunteer_type, error.PERMISSION_ERROR);
            }

        //Run query if query is valid
        if(goodQuery)
            {
            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.volunteeringData = null;
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("getVolunteeringData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    response.volunteeringData = res.rows;
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.volunteeringData = null;
        response.success = false;

        util.logWARN("getVolunteeringData(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getVolunteeringData(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getVolunteeringData(): Result is: " + response.success);

    return response;
    }


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
exports.getVolunteeringDataInstance = async (user, vdata_ID) => 
    {
    var response = {success: false, errorcode: -1, volunteeringData: null};
    var query = "";
    var values = [];
    var goodQuery = true;

    try 
        {
        util.logINFO("getVolunteeringDataInstance(): called by: " + user.volunteer_id + " for instance: " + vdata_ID);

        //Set the query
        query =  "SELECT volunteeringdata_id AS id, volunteer_id AS vol_id, VD.opp_id,"; 
        query += " VD.starttime, VD.endtime, validated, title, opportunity_type AS type"; 
        query += " FROM volunteeringdata AS VD, opportunity AS O WHERE VD.opp_id = O.opp_id";

        //Determine Correct Query to run
        if(vdata_ID > 0 && user.volunteer_type == enumType.VT_VOLUNTEER)    //If this volunteer is calling for data, they must have permission
            {
            query += " AND VD.volunteer_id = $1 AND VD.volunteeringdata_id = $2;";

            values.push(user.volunteer_id);
            values.push(vdata_ID);
            }
        //To access specific volunteer that is not that user they must have admin or dev privileges
        else if(vdata_ID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
            {
            query += " AND VD.volunteeringdata_id = $1;";

            values.push(vdata_ID);
            }
        else 
            {
            response.volunteeringData = null;
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            goodQuery = false;
            util.logWARN("getVolunteeringDataInstance(): User is of type: " + user.volunteer_type, error.PERMISSION_ERROR);
            }

        //Run query if query is valid
        if(goodQuery)
            {
            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.volunteeringData = null;
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("getVolunteeringDataInstance(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    response.volunteeringData = res.rows[0];
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.volunteeringData = null;
        response.success = false;

        util.logWARN("getVolunteeringDataInstance(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getVolunteeringDataInstance(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getVolunteeringDataInstance(): Result is: " + response.success);

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
    var query = "";
    var values = [];
    var oppData = null;
    var query2 = "";
    var values2 = [];

    try 
        {
        util.logINFO("addVolunteeringData(): called by: " + user.volunteer_id);

        //Get the start and end time of the opportunity
        query  = "SELECT starttime, endtime FROM opportunity WHERE opp_id = $1;"
        values.push(volunteeringData.opp_id);

        await database.queryDB(query, values, (res, e) => 
            { 
            if(e) 
                {
                response.errorcode = error.DATABASE_ACCESS_ERROR;
                response.success = false;
                util.logWARN("addVolunteeringData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                }
            else 
                {
                oppData = res.rows[0];
                }
            });

        //If we were able to find a valid opportunity
        if(oppData != null && oppData != undefined)
            {
            //Compare dates to make sure they are in valid range
            if(new Date(oppData.starttime) <= new Date(volunteeringData.starttime) &&
                new Date(oppData.endtime) >= new Date(volunteeringData.endtime))
                {
                //Set the volunteer_id
                if(volunteeringData.vol_id == 0)
                    volunteeringData.vol_id = user.volunteer_id;

                query2 =  "INSERT INTO volunteeringdata(volunteer_id, opp_id, starttime, endtime, validated)";
                query2 += " SELECT $1, $2, $3, $4, false";
                query2 += " WHERE NOT EXISTS (SELECT volunteer_id, opp_id FROM volunteeringdata WHERE volunteer_id = $1 AND opp_id = $2);";

                values2.push(volunteeringData.vol_id);
                values2.push(volunteeringData.opp_id);
                values2.push(volunteeringData.starttime);
                values2.push(volunteeringData.endtime);

                await database.queryDB(query2, values2, (res, e) => 
                    { 
                    if(e) 
                        {
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("addVolunteeringData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
                response.errorcode = error.INVALID_INPUT_ERROR;
                response.success = false;
                util.logINFO("addVolunteeringData(): Date of inputs were not in valid range");
                util.logWARN("addVolunteeringData(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
                }
            }
        else 
            {
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            util.logINFO("addVolunteeringData(): The opportunity could not be located");
            util.logWARN("addVolunteeringData(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR); 
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("addVolunteeringData(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("addVolunteeringData(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("addVolunteeringData(): Result is: " + response.success);

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
    var response = {success: false, errorcode: -1};
    var query = "";
    var values = [];
    var oppDate = null;
    var query2 = "";
    var values2 = [];

    try 
        {
        util.logINFO("editVolunteeringData(): called by: " + user.volunteer_id);

        //Get the start and end time of the opportunity
        query  = "SELECT starttime, endtime FROM opportunity WHERE opp_id = $1;"
        values.push(volunteeringData.opp_id);

        await database.queryDB(query, values, (res, e) => 
            { 
            if(e) 
                {
                response.errorcode = error.DATABASE_ACCESS_ERROR;
                response.success = false;
                util.logWARN("editVolunteeringData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                }
            else 
                {
                oppData = res.rows[0];
                }
            });

        //If we were able to find a valid opportunity
        if(oppData != null && oppData != undefined)
            {
            //Compare dates to make sure they are in valid range
            if(new Date(oppData.starttime) <= new Date(volunteeringData.starttime) &&
                new Date(oppData.endtime) >= new Date(volunteeringData.endtime))
                {
                //Set the volunteer_id
                if(volunteeringData.vol_id == 0)
                    volunteeringData.vol_id = user.volunteer_id;

                query2 =  "UPDATE volunteeringdata SET";
                query2 += " volunteer_id = $1, opp_id = $2, starttime = $3, endtime = $4";

                values2.push(volunteeringData.vol_id);
                values2.push(volunteeringData.opp_id);
                values2.push(volunteeringData.starttime);
                values2.push(volunteeringData.endtime);

                //Can only update validated if this is not the volunteer 
                if(user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV)
                    {
                    query2 += ", validated = $5 WHERE volunteeringdata_id = $6;";

                    values2.push(volunteeringData.validated);
                    values2.push(volunteeringData.id);
                    }
                else 
                    {
                    query2 += " WHERE volunteeringdata_id = $5;";

                    values2.push(volunteeringData.id);
                    }

                await database.queryDB(query2, values2, (res, e) => 
                    { 
                    if(e) 
                        {
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("editVolunteeringData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
                response.errorcode = error.INVALID_INPUT_ERROR;
                response.success = false;
                util.logINFO("editVolunteeringData(): Date of inputs were not in valid range");
                util.logWARN("editVolunteeringData(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
                }
            }
        else 
            {
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            util.logINFO("editVolunteeringData(): The opportunity could not be located");
            util.logWARN("editVolunteeringData(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR); 
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("editVolunteeringData(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("editVolunteeringData(): " + err.message, err.code);

        }

    //Log completion of function
    util.logINFO("editVolunteeringData(): Result is: " + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
// Will delete the volunteering instance
//
// @param[in]  user             user information 
// @param[in]  vData_ID         Volunteering data id to be deleted                 
//
// @param[out] {success, errorcode}        Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.deleteVolunteeringData = async (user, vData_ID) => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var values = [];

    try 
        {
        util.logINFO("deleteVolunteeringData(): called by: " + user.volunteer_id + " for volunteering data: " + vData_ID);

        //Should add verification that this deletion is happening by authorized party
        //  authrorized is admin or volunteer themself
        query =  "DELETE FROM volunteeringdata WHERE volunteeringdata_id = $1;";

        values.push(vData_ID);

        //Run query
        await database.queryDB(query, values, (res, e) => 
            { 
            if(e) 
                {
                response.errorcode = error.DATABASE_ACCESS_ERROR;
                response.success = false;
                util.logWARN("deleteVolunteeringData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                }
            else 
                {
                response.errorcode = error.NOERROR;
                response.success = true;
                }
            });
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("deleteVolunteeringData(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("deleteVolunteeringData(): " + err.message, err.code);

        }

    //Log completion of function
    util.logINFO("deleteVolunteeringData(): Result is: " + response.success);

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
exports.validateVolunteeringData = async (user, vdata_ID, validated) => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var values = [];

    try 
        {
        util.logINFO("validateVolunteeringData(): called by: " + user.volunteer_id + " for volunteering data: " + vdata_ID);

        if(user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV)
            {
            query =  "UPDATE volunteeringdata SET";
            query += " validated = $1 WHERE volunteeringdata_id =$2;";

            values.push(validated);
            values.push(vdata_ID);

            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("validateVolunteeringData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
            util.logWARN("validateVolunteeringData(): User is of type: " + user.volunteer_type, error.PERMISSION_ERROR);
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("validateVolunteeringData(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("validateVolunteeringData(): " + err.message, err.code);

        }

    //Log completion of function
    util.logINFO("validateVolunteeringData(): Result is: " + response.success);

    return response;
    }