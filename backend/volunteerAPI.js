////////////////////////////////////////////////////////////////////////
// volunteer.js -- backend functions for volunteer related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
// Jayden Cole, 18/01/21
//    - File updated to new design document
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const util = require('./utils');
const error = require('./errorCodes');
const bcrypt = require('bcryptjs');
const enumType = require('./enumTypes');


////////////////////////////////////////////////////////////
// Will get the volunteer info
//
// @param[in]  user             user information
// @param[in]  vol_ID           ID of volunteer client is looking for detail on
//                              value of -1 means all values are of interest
//
// @param[out] volunteerInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteerInfo = async (user, volunteerID) => 
    {
    var response = {success: false, errorcode: -1, volunteerInfo: []};
    var goodQuery = true;
    var query = "";

    try 
        {
        util.logINFO("getVolunteerInfo(): called by: " + user.volunteer_id);

        //Set the query
        query =  "SELECT V.volunteer_id AS id, CONCAT(V.firstname, ' ', V.lastname) AS name, V.email, V.username,";
        query += " CONCAT(T.sex, ' - ', T.name) AS teamname, V.team_id, V.leaderboards, VS.num_hours AS numhours";
        query += " FROM volunteer AS V";
        query += " LEFT JOIN team AS T ON T.team_id = V.team_id";
        query += " LEFT JOIN volunteer_stats AS VS ON VS.volunteer_id = V.volunteer_id";
        query += " WHERE V.volunteer_type != '" + enumType.VT_DEV + "' AND V.institution_id = " + user.institution_id;

        //Determine Correct Query to run
        if(volunteerID == -1 && (user.volunteer_type == enumType.VT_DEV || user.volunteer_type == enumType.VT_ADMIN))
            {
            query += ";";
            }
        else if(volunteerID == 0)
            {
            query += " AND V.volunteer_id = " + user.volunteer_id + ";";
            }
        //To access specific volunteer that is not that user they must have admin or dev privileges
        else if(volunteerID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
            {
            query += " AND V.volunteer_id = " + user.volunteer_id + ";";
            }
        else 
            {
            response.volunteerInfo = null;
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            goodQuery = false;
            util.logWARN("getVolunteerInfo(): User is of type: " + user.volunteer_type, error.PERMISSION_ERROR);
            }

        //Run query if query is valid
        if(goodQuery)
            {
            await database.queryDB(query, (res, e) => 
                { 
                if(e) 
                    {
                    response.volunteerInfo = null;
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("getVolunteerInfo(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    response.volunteerInfo = res.rows;
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.volunteerInfo = null;
        response.success = false;

        util.logWARN("getVolunteerInfo(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getVolunteerInfo(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getVolunteerInfo(): Result is: " + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
// Will get the volunteer data
//
// @param[in]  user             user information
// @param[in]  volunteerID      ID of volunteer client is looking for detail on
//                              value of 0 means current volunteer
//
// @param[out] volunteerData    Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteerData = async (user, vol_ID) => 
    {
    var response = {success: false, errorcode: -1, volunteerData: null};
    var goodQuery = true;
    var query = "";
    var query2 = "";

    try 
        {
        util.logINFO("getVolunteerData(): called by: " + user.volunteer_id + " for user " + vol_ID);

        //Set the default query
        query =  "SELECT V.volunteer_id AS id, CONCAT(V.firstname, ' ', V.lastname) AS name, V.email, V.username,";
        query += " CONCAT(T.sex, ' - ', T.name) AS teamname, V.team_id, V.leaderboards, vd_data.numhours";
        query += " FROM volunteer AS V";
        query += " LEFT JOIN";
        query +=    " (SELECT VD.volunteer_id, SUM(extract(HOUR FROM (VD.endtime - VD.starttime))) AS numhours";
        query +=    " FROM volunteeringdata AS VD";
        query +=    " GROUP BY VD.volunteer_id) vd_data";
        query += " ON vd_data.volunteer_id = V.volunteer_id";
        query += " LEFT JOIN team AS T ON T.team_id = V.team_id";

        //Set the query condition
        if(vol_ID == 0)     //Query from volunteer themself
            {
            query += " WHERE V.volunteer_id = " + user.volunteer_id + ";";
            }
        else if(vol_ID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
            {
            query += " WHERE V.volunteer_id = " + vol_ID + ";";
            }
        else 
            {
            response.volunteerInfo = null;
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            goodQuery = false;
            util.logWARN("getVolunteerData(): User is of type: " + user.volunteer_type, error.PERMISSION_ERROR);
            }

        //Run query #1 if query is valid
        if(goodQuery)
            {
            await database.queryDB(query, (res, e) => 
                { 
                if(e) 
                    {
                    response.volunteerData = null;
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("getVolunteerData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    response.volunteerData = res.rows[0];
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });


            //Make sure the original query worked properly
            if(response.success)
                {
                //Get the volunteering data in seperate query 
                //      Is it possible to get the nested query in one? 
                //      Will have to learn this, currently don't think it is

                //Set the default query
                query2 =  "SELECT VD.volunteeringdata_id AS id, VD.volunteer_id AS vol_id, VD.opp_id, oInfo.title, oInfo.type, VD.starttime, VD.endtime, VD.validated"; 
                query2 += " FROM volunteeringdata AS VD";
                query2 += " LEFT JOIN (SELECT opp_id AS oID, title, opportunity_type AS type FROM opportunity AS O) oInfo";
                query2 += " ON oInfo.oID = VD.opp_id";

                //Set the query condition
                if(vol_ID == 0)     //Query by volunteer
                    {
                    query2 += " WHERE VD.volunteer_id = " + user.volunteer_id + ";";
                    }
                else if(vol_ID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
                    {
                    query2 += " WHERE VD.volunteer_id = " + vol_ID + ";";
                    }
                //We already know the vol_ID is valid at this point since it has been checked

                await database.queryDB(query2, (res, e) => 
                    { 
                    if(e) 
                        {
                        response.volunteerData = null;
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("getVolunteerData(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                        }
                    else 
                        {
                        response.volunteerData['volunteeringdata'] = res.rows;
                        response.errorcode = error.NOERROR;
                        response.success = true;
                        }
                    });
                }
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.volunteerData = null;
        response.success = false;

        util.logWARN("getVolunteerData(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getVolunteerData(): " + err.message, error.UNKNOWN_ERROR);
        }

    //Log completion of function
    util.logINFO("getVolunteerData(): Result is: " + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
// Will editVolunteer to database
//
// @param[in]  user                     user information
// @param[in]  volunteerData            Data of volunteer to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.editVolunteer = async (user, volunteerData) => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var tempResult = {content: true};      //Will be overwritten
    var query2 = "";

    try 
        {
        util.logINFO("editVolunteer(): called by: " + user.volunteer_id);

        //Verify all the inputs from the volunteerData element that will be placed in SQL query
        if(util.verifyInput(volunteerData.name) && util.verifyInput(volunteerData.username) &&
            util.verifyInput(volunteerData.email) && util.verifyInput(volunteerData.leaderboards))
            {
            //The inputs do not contain SQL injection attacks

            //Ensure the username and name is not empty
            if(volunteerData.username != "" && volunteerData.username != undefined && 
                volunteerData.name != "" && volunteerData.name != undefined && util.isValidEmail(volunteerData.email))
                {
                 //Ensure the username provided is not used by anyone else 
                query = "SELECT * FROM volunteer";
                query += " WHERE username = '" + volunteerData.username + "' AND volunteer_id != " + user.volunteer_id;

                await database.queryDB(query, (res, e) => 
                    { 
                    if(e) 
                        {
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("editVolunteer(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                        }
                    else 
                        {
                        tempResult = res.rows;
                        response.errorcode = error.NOERROR;
                        response.success = true;
                        }
                    });

                //if the username is not duplicated
                if(tempResult === undefined || tempResult.length == 0)
                    {
                    //Update the volunteers information
                    query2 =  "UPDATE volunteer SET";
                    query2 += " firstname = '" + volunteerData.name.split(' ')[0] + "', lastname = '" + volunteerData.name.split(' ')[1];
                    query2 += "', email = '" + volunteerData.email + "', username = '" + volunteerData.username;
                    query2 += "', leaderboards = " + volunteerData.leaderboards;
                    query2 += " WHERE volunteer_id = " + user.volunteer_id + ";";
        
                    await database.queryDB(query2, (res, e) => 
                        { 
                        if(e) 
                            {
                            response.errorcode = error.DATABASE_ACCESS_ERROR;
                            response.success = false;
                            util.logWARN("editVolunteer(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
                    util.logWARN("editVolunteer(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
                    }
                }
            else 
                {
                response.errorcode = error.INVALID_INPUT_ERROR;
                response.success = false;
                util.logWARN("editVolunteer(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
                }
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("editVolunteer(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("editVolunteer(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("editVolunteer(): Result is: " + response.success);

    return response;
    }



////////////////////////////////////////////////////////////
// Will update user info in database
//
// @param[in]  user                     user information
// @param[in]  userInfo                 Info of user to be updated
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.changePassword = async (user, oldPassword, newPassword) => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var query2 = "";
    var passwordMatch = false;

    try 
        {
        util.logINFO("changePassword(): called by: " + user.volunteer_id);

        //Validate the inputs from the passwords 
        if(util.verifyInput(oldPassword) && util.verifyInput(newPassword))
            {
            //Can assume inputs are now valid, check that the old password is valid
            query = "SELECT password FROM volunteer WHERE volunteer_id = " + user.volunteer_id;

            await database.queryDB(query, (res, e) => 
                { 
                if(e) 
                    {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("changePassword(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else if(bcrypt.compareSync(oldPassword, res.rows[0].password))
                    {
                    passwordMatch = true;
                    }
                });

            //If the passwords match
            if(passwordMatch)
                {
                query2 =  "UPDATE volunteer SET";
                query2 += " password = '" + bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)) + "'";
                query2 += " WHERE volunteer_id = " + user.volunteer_id + ";";

                await database.queryDB(query2, (res, e) => 
                    { 
                    if(e) 
                        {
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("changePassword(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                        }
                    else 
                        {
                        response.errorcode = error.NOERROR;
                        response.success = true;
                        }
                    });
                }
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("changePassword(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("changePassword(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("changePassword(): Result is: " + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will update user info in database
//
// @param[in]  user             user information
//
// @param[out] volunteerInfo    array of top 10 volunteers based on hours
//
////////////////////////////////////////////////////////////
exports.getVolunteerLeaderboard = async user => 
    {
    var response = {success: false, errorcode: -1, volunteerLeader: []};
    var query = "";

    try 
        {
        util.logINFO("getVolunteerLeaderboard(): called by: " + user.volunteer_id);

        // Can look at reordering query with innner join so that we do not have to consider null situations with num_hours
        query =  " SELECT CONCAT(V.firstname, ' ', V.lastname) AS name, CONCAT(T.sex, ' - ', T.name) AS teamname, VS.num_hours";
        query += " FROM volunteer_stats AS VS";
        query += " LEFT JOIN volunteer AS V ON V.volunteer_id = VS.volunteer_id";
        query += " LEFT JOIN team AS T ON T.team_id = VS.team_id";
        query += " WHERE VS.institution_id = " + user.institution_id + " AND V.leaderboards = true";
        query += " ORDER BY num_hours DESC NULLS LAST LIMIT 10;";

        //case when MyDate is null then 1 else 0 end, MyDate
       
        await database.queryDB(query, (res, e) => 
            { 
            if(e) 
                {
                response.volunteerLeader = [];
                response.errorcode = error.DATABASE_ACCESS_ERROR;
                response.success = false;
                util.logWARN("getVolunteerLeaderboard(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                }
            else 
                {
                response.volunteerLeader = res.rows;

                //Set the rank of each volunteer -- assuming they are in sorted order already
                for(var v = 0; v < response.volunteerLeader.length; v++)
                    {
                    response.volunteerLeader[v]['rank'] = v+1; 
                    }

                response.errorcode = error.NOERROR;
                response.success = true;
                }
            });
        }
    catch (err)
        {
        response.volunteerLeader = null;
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("getVolunteerLeaderboard(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("getVolunteerLeaderboard(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("getVolunteerLeaderboard(): Result is: " + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
// Will addVolunteer to database
//
// @param[in]  user                     user information
// @param[in]  volunteerData            Data of volunteer to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.createAccount = async vData => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var tempResult = [];
    var query2 = "";


    try {
        util.logINFO("createAccount(): called by: " +  vData.username + " for institution: " + vData.institution_id);

        //Validate all inputs 
        if(util.verifyInput(vData.name) && util.verifyInput(vData.username) && 
            util.verifyInput(vData.leaderboards) && util.verifyInput(vData.password) &&
            util.verifyInput(vData.institution_id) && util.verifyInput(vData.team_id) &&
            util.verifyInput(vData.email) && util.isValidEmail(vData.email))
            {            
            //Make sure the provided username is unique
            query = "SELECT volunteer_id FROM volunteer WHERE username = '" + vData.username + "';";

            await database.queryDB(query, (res, e) => 
                {
                if(e) 
                    {
                    tempResult = [];
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("createAccount(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    tempResult = res.rows;
                    }
                });

            //Check if query returned nothing which means the username is unique
            if(tempResult != undefined && tempResult.length == 0)
                {
                query2 =  "INSERT INTO volunteer(team_id, institution_id, firstname, lastname, email, password, username, volunteer_type, leaderboards)";
                query2 += "VALUES (" + vData.team_id + ", " + vData.institution_id + ", '" + vData.name.split(" ")[0] + "', '" + vData.name.split(" ")[1] + "', '";
                query2 += vData.email + "', '" + bcrypt.hashSync(vData.password, bcrypt.genSaltSync(10)) + "', '" + vData.username + "', '";
                query2 += enumType.VT_VOLUNTEER + "', '" + vData.leaderboards + "');"

                await database.queryDB(query2, (res, e) => 
                    {
                    if(e) 
                        {
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("createAccount(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
                util.logWARN("createAccount(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
                util.logINFO("createAccount(): The username was already taken");
                }
            }
        else 
            {
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            util.logWARN("createAccount(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
            }
        }
    catch (err) 
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("createAccount(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("createAccount(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("createAccount(): Result is: " + response.success);


    return response;
    }