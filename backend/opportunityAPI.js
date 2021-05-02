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
const general = require('./general');
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
    var goodQuery = true;

    try 
        {
        console.log('getAllOpportunityInfo() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        var oppElement = 
            {
            id: 1,
            sequencenum: 1,
            title: "Testing Opp",
            //Create query base
            query =  "SELECT O.opp_id AS id, sequencenum, title, opportunity_type AS type,";
            query += " starttime, endtime, oStat.numvolunteers";
            query += " FROM opportunity AS O";
            query += " LEFT JOIN (SELECT VD.opp_id, COUNT(*) AS numvolunteers FROM volunteeringdata AS VD";
            query += " GROUP BY VD.opp_id) oStat";
            query += " ON O.opp_id = oStat.opp_id";

            //Set the query condiditon
            if(oppID == -1)
                {
                query += " WHERE institution_id = " + user.institution_id + " ORDER BY starttime DESC;";
                }
            else if(oppID > 0)
                {
                query += " WHERE O.opp_id = " + oppID + ";";
                }
            else 
                {
                response.errorcode = error.INVALID_INPUT_ERROR;
                response.success = false;
                goodQuery = true;
                }

            if(goodQuery)
                {
                //Run the query
                await database.queryDB(query, (res, e) => 
                    { 
                    if(e) 
                        {
                        console.log("DATABASE ERROR: " + e.message);
                        response.oppInfo = [];
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
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
            }
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.oppInfo = null;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getAllOpportunityInfo() is: ' + response.success);

    return response;
    }

////////////////////////////////////////////////////////////
// Will get the opportunity info -- 
//      eventually seperating this from the AllInfo call will allow us to 
//      to seperate the opportunities by what teams can view the opportunity
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

    try 
        {
        console.log('getOpportunityInfo() called by: ' + user.volunteer_id);

        //Check that the caller is valid and that the input is valid
        if(general.verifyInput(oppID))
            {
            //Create query base
            query =  "SELECT O.opp_id AS id, sequencenum, title, opportunity_type AS type,";
            query += " starttime, endtime, oStat.numvolunteers";
            query += " FROM opportunity AS O";
            query += " LEFT JOIN (SELECT VD.opp_id, COUNT(*) AS numvolunteers FROM volunteeringdata AS VD";
            query += " GROUP BY VD.opp_id) oStat";
            query += " ON O.opp_id = oStat.opp_id";

            //Set the query condiditon
            if(oppID == -1)
                {
                query += " WHERE institution_id = " + user.institution_id + " ORDER BY starttime DESC;";
                }
            else if(oppID > 0)
                {
                query += " WHERE institution_id = " + user.institution_id + " AND O.opp_id = " + oppID + ";";
                //Make sure the opportunity being requested is from the correct institution
                }
            else 
                {
                response.oppInfo = [];
                response.errorcode = error.INVALID_INPUT_ERROR;
                response.success = false;
                goodQuery = false;
                }

            if(goodQuery)
                {
                //Run the query
                await database.queryDB(query, (res, e) => 
                    { 
                    if(e) 
                        {
                        console.log("DATABASE ERROR: " + e.message);
                        response.oppInfo = [];
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
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
            }
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.oppInfo = null;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getOpportunityInfo() is: ' + response.success);

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
    var query2 = "";

    try 
        {
        console.log('getOpportunityData() called by: ' + user.volunteer_id);

        //Check that the caller is valid and that the input is valid
        if(general.verifyInput(oppID))
            {
            //Create query base
            query =  "SELECT O.opp_id AS id, sequencenum, title, opportunity_type AS type,";
            query += " starttime, endtime, location, description, volunteerlimit,";
            query += " coordinatorname, coordinatoremail, coordinatorphone, oStat.numvolunteers"
            query += " FROM opportunity AS O";
            query += " LEFT JOIN (SELECT VD.opp_id, COUNT(*) AS numvolunteers FROM volunteeringdata AS VD";
            query += " GROUP BY VD.opp_id) oStat";
            query += " ON O.opp_id = oStat.opp_id";
            query += " WHERE institution_id = " + user.institution_id + " AND O.opp_id = " + oppID + ";";
            //Make sure the opportunity being requested is from the correct institution
            
            //Run the query
            await database.queryDB(query, (res, e) => 
                { 
                if(e) 
                    {
                    console.log("DATABASE ERROR: " + e.message);
                    response.oppData = [];
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
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
                query2 = "SELECT CONCAT(V.firstname, ' ', V.lastname) AS name, V.volunteer_id AS id, ";
                query2 += " VD.starttime, VD.endtime, VD.validated, ";
                query2 += " extract(HOUR FROM (VD.endtime - VD.starttime)) AS num_hours";
                query2 += " FROM volunteer AS V, volunteeringdata AS VD";
                query2 += " WHERE V.volunteer_id = VD.volunteer_id AND V.institution_id = " + user.institution_id;
                query2 += " AND VD.opp_id = " + oppID + ";";

                await database.queryDB(query2, (res, e) => 
                    { 
                    if(e) 
                        {
                        console.log("DATABASE ERROR: " + e.message);
                        response.oppData = [];
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
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
        else 
            {
            response.oppData = [];
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            }
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.oppData = [];
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getOpportunityData() is: ' + response.success);

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

    try 
        {
        console.log('addOpportunity() called by: ' + user.volunteer_id);

        //Validate the inputs and the user adding the opportunity
        if((user.volunteer_type == enumTypes.VT_ADMIN || user.volunteer_type == enumTypes.VT_DEV) &&
            general.verifyInput(oppData.title) && general.verifyInput(oppData.type) && 
            general.verifyInput(oppData.starttime) && general.verifyInput(oppData.endtime) &&
            general.verifyInput(oppData.location) && general.verifyInput(oppData.description) &&
            general.verifyInput(oppData.coordinatorname) && general.verifyInput(oppData.coordinatoremail) &&
            general.verifyInput(oppData.coordinatorphone) )
            {
            //Inputs and user are valid, create insert query

            query =  "INSERT INTO opportunity (title, opportunity_type, starttime, endtime, location,";
            query += " description, volunteerlimit, coordinatorname, coordinatoremail, coordinatorphone) VALUES";
            query += "('" + oppData.title + "', '" + oppData.type + "', '" + oppData.starttime + "',";
            query += " '" + oppData.endtime + "', '" + oppData.location + "', '" + oppData.description + "',";
            query += oppData.volunteerlimit + ", '" + oppData.coordinatorname + "',";
            query += " '" + oppData.coordinatoremail + "', '" + oppData.coordinatorphone + "');";
        
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
            response.oppInfo = [];
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            }
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of addOpportunity() is: ' + response.success);

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

    try 
        {
        console.log('editOpportunity() called by: ' + user.volunteer_id);

        //Validate the inputs and the user editting the opportunity
        if((user.volunteer_type == enumTypes.VT_ADMIN || user.volunteer_type == enumTypes.VT_DEV) &&
            general.verifyInput(oppData.id) && general.verifyInput(oppData.title) && 
            general.verifyInput(oppData.type) && general.verifyInput(oppData.starttime) && 
            general.verifyInput(oppData.endtime) && general.verifyInput(oppData.location) && 
            general.verifyInput(oppData.description) && general.verifyInput(oppData.coordinatorname) && 
            general.verifyInput(oppData.coordinatoremail) && general.verifyInput(oppData.coordinatorphone) )
            {
            //Inputs and user are valid, create insert query

            query =  "UPDATE opportunity SET";
            query += " title = '" + oppData.title + "', opportunity_type = '" + oppData.type + "',";
            query += " starttime = '" + oppData.starttime + "', endtime = '" + oppData.endtime + "',";
            query += " location = '" + oppData.location + "', description = '" + oppData.description + "',";
            query += " volunteerlimit = " + oppData.volunteerlimit + ", coordinatorname = '" + oppData.coordinatorname + "',";
            query += " coordinatoremail = '" + oppData.coordinatoremail + "', coordinatorphone = '" + oppData.coordinatorphone + "'";
            query += " WHERE opp_id = " + oppData.id + ";";
        
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
            response.oppInfo = [];
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            }
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of editOpportunity() is: ' + response.success);

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

    try 
        {
        console.log('deleteOpportunity() called by: ' + user.volunteer_id);

        //Verify that this volunteer is allowed to delete this opportunity
        if(general.verifyInput(oppID) && 
            (user.volunteer_type == enumTypes.VT_ADMIN || user.volunteer_type == enumTypes.VT_DEV))
            {
            query =  "DELETE FROM opportunity WHERE opp_id = " + oppID + ";";

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
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            }
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of deleteOpportunity() is: ' + response.success);

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
        console.log('getOpportunityTypes() called by: ' + user.volunteer_id);

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
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.oppTypes = [];
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getOpportunityTypes() is: ' + response.success);

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
/*
exports.addOpportunityType = async (user, type)  => 
  {
  var response = {success: false, errorcode: -1, oppTypes: []};

  try 
    {
    console.log('addOpportunityType() called by: ' + user.volunteer_id);

    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    response.oppTypes = ["Meetings", "Special Olympics", "Game Day Events", "Social Events"];
    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    response.errorcode = error.NOERROR;
    response.success = true;
    }
  catch (err)
    {
    console.log("Error Occurred: " + err.message);

    response.errorcode = error.SERVER_ERROR;
    response.oppTypes = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of addOpportunityType() is: ' + response.success);
  
  return response;
  }
*/