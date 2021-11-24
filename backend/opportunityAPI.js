////////////////////////////////////////////////////////////////////////
// opportunity.js -- backend functions for oppourtuntiy related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
// Jayden Cole, 18/01/21
//    - Updated to new design document
//
////////////////////////////////////////////////////////////////////////
const database = require('./databaseSetup');
const util = require('./utils');
const error = require('./errorCodes');
const enumTypes = require('./enumTypes');


////////////////////////////////////////////////////////////
// Will get all the oppoutunity info -- call for admin users
//
// @param[in]  user         user information
// @param[in]  oppID        ID of oppourtunity the user is looking for detail on
//                          value of -1 means all values are of interest
// @param[out] oppInfo      Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getAllOpportunityInfo = async (user, oppID) => 
    {
    var response = {success: false, errorcode: -1, oppInfo: []};
    var query = "";
    var values = [];
    var goodQuery = true;

    try 
        {
        util.logINFO("getAllOpportunityInfo(): called by: " + user.volunteer_id);

        //Check that the caller is valid
        if(user.volunteer_type == enumTypes.VT_DEV || user.volunteer_type == enumTypes.VT_ADMIN)
            {
            query =  "SELECT O.opp_id AS id, sequencenum, title, opportunity_type AS type,";
            query += " starttime, endtime, oStat.numvolunteers";
            query += " FROM opportunity AS O";
            query += " LEFT JOIN (SELECT VD.opp_id, COUNT(*) AS numvolunteers FROM volunteeringdata AS VD";
            query += " GROUP BY VD.opp_id) oStat";
            query += " ON O.opp_id = oStat.opp_id";

            //Set the query condiditon
            if(oppID == -1)
                {
                query += " WHERE institution_id = $1 ORDER BY starttime DESC;";

                values.push(user.institution_id);
                }
            else if(oppID > 0)
                {
                query += " WHERE O.opp_id = $1;";

                values.push(oppID);
                }
            else 
                {
                response.errorcode = error.INVALID_INPUT_ERROR;
                response.success = false;
                goodQuery = true;
                util.logWARN("getAllOpportunityInfo(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
                }

            if(goodQuery)
                {
                //Run the query
                await database.queryDB(query, values, (res, e) => 
                    { 
                    if(e) 
                        {
                        response.oppInfo = [];
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("getAllOpportunityInfo(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                        }
                    else 
                        {
                        response.oppInfo = res.rows;
                        response.errorcode = error.NOERROR;
                        response.success = true;
                        }
                    });
                }
            }
        else 
            {
            response.oppInfo = [];
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            util.logWARN("getAllOpportunityInfo(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.oppInfo = null;
        response.success = false;

        util.logWARN("getAllOpportunityInfo(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getAllOpportunityInfo(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getAllOpportunityInfo(): Result is: " + response.success);

    return response;
    }

////////////////////////////////////////////////////////////
// Will get the opportunity info -- called from app so only current opps appear
//
// @param[in]  user             user information
// @param[in]  opportunityID    ID of opp user is looking for detail on
//                              value of -1 means all values are of interest
//
// @param[out] oppInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getOpportunityInfo = async (user, oppID) => 
    {
    var response = {success: false, errorcode: -1, oppInfo: []};
    var query = "";
    var values = [];
    var goodQuery = true;

    try 
        {
        util.logINFO("getOpportunityInfo(): called by: " + user.volunteer_id);

        query =  "SELECT O.opp_id AS id, sequencenum, title, opportunity_type AS type,";
        query += " starttime, endtime, oStat.numvolunteers";
        query += " FROM opportunity AS O";
        query += " LEFT JOIN (SELECT VD.opp_id, COUNT(*) AS numvolunteers FROM volunteeringdata AS VD";
        query += " GROUP BY VD.opp_id) oStat";
        query += " ON O.opp_id = oStat.opp_id";

        //Set the query condiditon
        if(oppID == -1)
            {
            // Note that this timestamp adjustment will work for the current timezone difference between UTC and PST.
            // This is not a great practice and a better solution should be found
            query += " WHERE institution_id = $1 AND endtime > (NOW() - interval '8 hours') ORDER BY starttime ASC;";
            //Only provide opportunities that have not passed

            values.push(user.institution_id);
            }
        else if(oppID > 0)
            {
            query += " WHERE institution_id = $1 AND O.opp_id = $2;";
            //Make sure the opportunity being requested is from the correct institution

            values.push(user.institution_id);
            values.push(oppID);
            }
        else 
            {
            response.oppInfo = [];
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            goodQuery = false;
            util.logWARN("getOpportunityInfo(): Set error code to: " + user.volunteer_type, error.INVALID_INPUT_ERROR);
            }

        if(goodQuery)
            {
            //Run the query
            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.oppInfo = [];
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("getOpportunityInfo(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    response.oppInfo = res.rows;
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.oppInfo = null;
        response.success = false;

        util.logWARN("getOpportunityInfo(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getOpportunityInfo(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getOpportunityInfo(): Result is: " + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
// Will get the opportunity data
//
// @param[in]  user         user information
// @param[in]  oppID        ID of opp user is looking for detail on
//                          value of -1 means all values are of interest
//
// @param[out] oppData      Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getOpportunityData = async (user, oppID) => 
    {
    var response = {success: false, errorcode: -1, oppData: []};
    var query = "";
    var values = [];
    var query2 = "";
    var values2 = [];

    try 
        {
        util.logINFO("getOpportunityData(): called by: " + user.volunteer_id + " for opp: " + oppID);

        //Create query base
        query =  "SELECT O.opp_id AS id, sequencenum, title, opportunity_type AS type,";
        query += " starttime, endtime, location, description, volunteerlimit,";
        query += " coordinatorname, coordinatoremail, coordinatorphone, oStat.numvolunteers"
        query += " FROM opportunity AS O";
        query += " LEFT JOIN (SELECT VD.opp_id, COUNT(*) AS numvolunteers FROM volunteeringdata AS VD";
        query += " GROUP BY VD.opp_id) oStat";
        query += " ON O.opp_id = oStat.opp_id";
        query += " WHERE institution_id = $1 AND O.opp_id = $2;";
        //Make sure the opportunity being requested is from the correct institution

        values.push(user.institution_id);
        values.push(oppID);
        
        //Run the query
        await database.queryDB(query, values, (res, e) => 
            { 
            if(e) 
                {
                response.oppData = [];
                response.errorcode = error.DATABASE_ACCESS_ERROR;
                response.success = false;
                util.logWARN("getOpportunityData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                }
            else 
                {
                response.oppData = res.rows[0];
                response.errorcode = error.NOERROR;
                response.success = true;
                }
            });

        //if the first query was successful
        if(response.success)
            {
            query2 = "SELECT CONCAT(V.firstname, ' ', V.lastname) AS name, VD.volunteeringdata_id AS id, ";
            query2 += " VD.starttime, VD.endtime, VD.validated, ";
            query2 += " extract(HOUR FROM (VD.endtime - VD.starttime)) AS num_hours";
            query2 += " FROM volunteer AS V, volunteeringdata AS VD";
            query2 += " WHERE V.volunteer_id = VD.volunteer_id AND V.institution_id = " + user.institution_id;
            query2 += " AND VD.opp_id = $1;";

            values2.push(oppID);

            await database.queryDB(query2, values2, (res, e) => 
                { 
                if(e) 
                    {
                    response.oppData = [];
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("getOpportunityData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    response.oppData['volunteers'] = res.rows;
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.oppData = [];
        response.success = false;

        util.logWARN("getOpportunityData(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getOpportunityData(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getOpportunityData(): Result is: " + response.success);

    return response;
    }


////////////////////////////////////////////////////////////////////////////////////
// Will save opportunity to database
//
// @param[in]  user                     user information
// @param[in]  oppData                  JSON of opportunity JSON for event being added
//
// @param[out] {success, errorcode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.addOpportunity = async (user, oppData) => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var values = [];

    try 
        {
        util.logINFO("addOpportunity(): called by: " + user.volunteer_id);

        //Validate the inputs and the user adding the opportunity
        if(user.volunteer_type == enumTypes.VT_ADMIN || user.volunteer_type == enumTypes.VT_DEV)
            {
            query =  "INSERT INTO opportunity (title, opportunity_type, starttime, endtime, location,";
            query += " description, volunteerlimit, coordinatorname, coordinatoremail, coordinatorphone, institution_id)";
            query += " VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);";

            values.push(oppData.title);
            values.push(oppData.type);
            values.push(oppData.starttime);
            values.push(oppData.endtime);
            values.push(oppData.location);
            values.push(oppData.description);
            values.push(oppData.volunteerlimit);
            values.push(oppData.coordinatorname);
            values.push(oppData.coordinatoremail);
            values.push(oppData.coordinatorphone);
            values.push(user.institution_id);
        
            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("addOpportunity(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
            response.oppInfo = [];
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            util.logWARN("addOpportunity(): Set errorcode to: " + error.PERMISSION_ERROR, error.PERMISSION_ERROR);
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("addOpportunity(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("addOpportunity(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("addOpportunity(): Result is: " + response.success);

    return response;
    }


////////////////////////////////////////////////////////////////////////////////////
// Will edit opportunity to database
//
// @param[in]  user                     user information
// @param[in]  oppData                  JSON of opportunity data for event being editted
//
// @param[out] {success, errorcode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.editOpportunity = async (user, oppData) => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var values = [];
    var opportunityUpdated = false;

    try 
        {
        util.logINFO("editOpportunity(): called by: " + user.volunteer_id);

        //Validate the inputs and the user editting the opportunity
        if(user.volunteer_type == enumTypes.VT_ADMIN || user.volunteer_type == enumTypes.VT_DEV)
            {
            query =  "UPDATE opportunity SET";
            query += " title = $1, opportunity_type = $2, starttime = $3, endtime = $4,";
            query += " location = $5, description = $6, volunteerlimit = $7, coordinatorname = $8,";
            query += " coordinatoremail = $9, coordinatorphone = $10";
            query += " WHERE opp_id = $11;";

            values.push(oppData.title);
            values.push(oppData.type);
            values.push(oppData.starttime);
            values.push(oppData.endtime);
            values.push(oppData.location);
            values.push(oppData.description);
            values.push(oppData.volunteerlimit);
            values.push(oppData.coordinatorname);
            values.push(oppData.coordinatoremail);
            values.push(oppData.coordinatorphone);
            values.push(oppData.id);
        
            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("editOpportunity(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    opportunityUpdated = true;
                    }
                });

            if (opportunityUpdated)
                {
                // Update the related volunteering data
                var query2 =  "UPDATE volunteeringdata SET";
                query2 += " starttime = $1, endtime = $2";
                query2 += " WHERE opp_id = $3;";

                var values2 = [oppData.starttime, oppData.endtime, oppData.id];
            
                await database.queryDB(query2, values2, (res, e) => 
                    { 
                    if(e) 
                        {
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("editOpportunity(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                        }
                    else 
                        {
                        response.errorcode = error.NOERROR;
                        response.success = true;
                        }
                    });
                }
            }
        else 
            {
            response.oppInfo = [];
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            util.logWARN("editOpportunity(): Set errorcode to: " + error.PERMISSION_ERROR, error.PERMISSION_ERROR);
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("editOpportunity(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("editOpportunity(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("editOpportunity(): Result is: " + response.success);


    return response;
    }


////////////////////////////////////////////////////////////////////////////////////
// Will edit opportunity to database
//
// @param[in]  user                     user information
// @param[in]  oppID                    opportunityID to be deleted
//
// @param[out] {success, errorcode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.deleteOpportunity = async (user, oppID) => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var values = [];

    try 
        {
        util.logINFO("deleteOpportunity(): called by: " + user.volunteer_id);

        //Verify that this volunteer is allowed to delete this opportunity
        if(user.volunteer_type == enumTypes.VT_ADMIN || user.volunteer_type == enumTypes.VT_DEV)
            {
            query =  "DELETE FROM opportunity WHERE opp_id = $1;";

            values.push(oppID);

            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("deleteOpportunity(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
            util.logWARN("editInstitutionInfo(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("deleteOpportunity(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("deleteOpportunity(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("deleteOpportunity(): Result is: " + response.success);

    return response;
    }


////////////////////////////////////////////////////////////////////////////////////
// Will get the opportunity types availible for display
//
// @param[in]  user                 user information
//
// @param[out] opportunityTypes    Array of opportunity types availible at instituion
//
////////////////////////////////////////////////////////////////////////////////////
exports.getOpportunityTypes = async user => 
    {
    var response = {success: false, errorcode: -1, oppTypes: []};

    try 
        {
        util.logINFO("getOpportunityTypes(): called by: " + user.volunteer_id);

        response.oppTypes.push(enumTypes.OT_NOT_SET);
        response.oppTypes.push(enumTypes.OT_CAMPUS);
        response.oppTypes.push(enumTypes.OT_COMMUNITY);
        response.oppTypes.push(enumTypes.OT_GAME_DAY);
        response.oppTypes.push(enumTypes.OT_MEDIA);
        response.oppTypes.push(enumTypes.OT_MEETING);
        response.oppTypes.push(enumTypes.OT_PLANNING);
        response.oppTypes.push(enumTypes.OT_SOCIAL);
        response.oppTypes.push(enumTypes.OT_SPECIAL_O);
        response.oppTypes.push(enumTypes.OT_OTHER);

        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.oppTypes = [];
        response.success = false;

        util.logWARN("getOpportunityTypes(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getOpportunityTypes(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getOpportunityTypes(): Result is: " + response.success);


    return response;
    }


////////////////////////////////////////////////////////////////////////////////////
// Will add the opportunity types to the institution enum
//
// @param[in]  user                     user Information
// @param[in]  opportunityType          opportunity type to be added
//
// @param[out] {success, errorcode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
function isValidEnum_OT(value)
    {
    var enums = {
        'Not Set': true,
        'Meeting': true,
        'Special Olympics': true,
        'Game Day': true,
        'Campus': true,
        'Community': true,
        'Social': true,
        'Planning': true,
        'Media': true,
        'Other': true
        };

    return enums[value] || false; 
    }