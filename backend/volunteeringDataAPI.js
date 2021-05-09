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
const error = require('./errorcodes');
const enumType = require('./enumTypes');


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
    var goodQuery = true;

    try 
        {
        util.logINFO("getVolunteeringData(): called by: " + user.volunteer_id);

        //Ensure the input passed is valid
        if(util.verifyInput(vol_ID))
            {
            //Set the query
            query =  "SELECT volunteeringdata_id AS id, volunteer_id AS vol_id, VD.opp_id,"; 
            query += " VD.starttime, VD.endtime, validated, title, opportunity_type AS type"; 
            query += " FROM volunteeringdata AS VD, opportunity AS O WHERE VD.opp_id = O.opp_id";

            //Determine Correct Query to run
            if(vol_ID == 0)
                {
                //Set the query
                query += " AND VD.volunteer_id = " + user.volunteer_id + ";";
                }
            //To access specific volunteer that is not that user they must have admin or dev privileges
            else if(vol_ID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
                {
                query += " AND VD.volunteer_id = " + vol_ID + ";";
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
                await database.queryDB(query, (res, e) => 
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
        else 
            {
            response.volunteeringData = [];
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            util.logWARN("getVolunteeringData(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
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
    var goodQuery = true;

    try 
        {
        util.logINFO("getVolunteeringDataInstance(): called by: " + user.volunteer_id + " for instance: " + vdata_ID);

        if(util.verifyInput(vdata_ID))
            {
            //Set the query
            query =  "SELECT volunteeringdata_id AS id, volunteer_id AS vol_id, VD.opp_id,"; 
            query += " VD.starttime, VD.endtime, validated, title, opportunity_type AS type"; 
            query += " FROM volunteeringdata AS VD, opportunity AS O WHERE VD.opp_id = O.opp_id";

            //Determine Correct Query to run
            if(vdata_ID > 0 && user.volunteer_type == enumType.VT_VOLUNTEER)    //If this volunteer is calling for data, they must have permission
                {
                query += " AND VD.volunteer_id = " + user.volunteer_id + " AND VD.volunteeringdata_id = " + vdata_ID  + ";";
                }
            //To access specific volunteer that is not that user they must have admin or dev privileges
            else if(vdata_ID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
                {
                query += " AND VD.volunteeringdata_id = " + vdata_ID  + ";";
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
                await database.queryDB(query, (res, e) => 
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
        else 
            {
            response.volunteeringData = null;
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            util.logWARN("getVolunteeringDataInstance(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
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

    try 
        {
        util.logINFO("addVolunteeringData(): called by: " + user.volunteer_id);

        //Ensure all the inputs are valid
        if(util.verifyInput(volunteeringData.starttime) && 
            util.verifyInput(volunteeringData.endtime) &&
            util.verifyInput(volunteeringData.opp_id))
            {
            //Inputs are valid, insert new element to database

            //Set the volunteer_id
            if(volunteeringData.vol_id == 0)
                volunteeringData.vol_id = user.volunteer_id;


            query =  "INSERT INTO volunteeringdata(volunteer_id, opp_id, starttime, endtime, validated)";
            query += " VALUES (" + volunteeringData.vol_id + ", " + volunteeringData.opp_id + ",";
            query += " '" + volunteeringData.starttime + "', '" + volunteeringData.endtime + "',";
            query += " false);"

            await database.queryDB(query, (res, e) => 
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

    try 
        {
        util.logINFO("editVolunteeringData(): called by: " + user.volunteer_id);

        //Ensure all the inputs are valid
        if(util.verifyInput(volunteeringData.starttime) && 
            util.verifyInput(volunteeringData.endtime) &&
            util.verifyInput(volunteeringData.opp_id))
            {
            //Inputs are valid, insert new element to database

            //Set the volunteer_id
            if(volunteeringData.vol_id == 0)
                volunteeringData.vol_id = user.volunteer_id;


            query =  "UPDATE volunteeringdata SET";
            query += " volunteer_id = " + volunteeringData.vol_id + ", opp_id = " + volunteeringData.opp_id;
            query += ", starttime = '" + volunteeringData.starttime + "', endtime = '" + volunteeringData.endtime + "',";
            query += " validated = '" + volunteeringData.validated + "'";
            query += " WHERE volunteeringdata_id = " + volunteeringData.id + ";";

            await database.queryDB(query, (res, e) => 
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

    try 
        {
        util.logINFO("deleteVolunteeringData(): called by: " + user.volunteer_id + " for volunteering data: " + vData_ID);


        if(isNaN(vData_ID))
            {
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            }
        else 
            {
            //Can add verification that this deletion is happening by authorized party
            //  authrorized is admin or volunteer themself
            query =  "DELETE FROM volunteeringdata WHERE volunteeringdata_id = " + vData_ID;

            //Run query
            await database.queryDB(query, (res, e) => 
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

    try 
        {
        util.logINFO("validateVolunteeringData(): called by: " + user.volunteer_id + " for volunteering data: " + vdata_ID);

        //Check the input is valid
        if(util.verifyInput(vdata_ID))
            {
            if(user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV)
                {
                query =  "UPDATE volunteeringdata SET";
                query += " validated = '" + validated + "' WHERE ";
                query += "volunteeringdata_id = " + vdata_ID + ";";

                //Run query
                await database.queryDB(query, (res, e) => 
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
        else 
            {
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            util.logWARN("validateVolunteeringData(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
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