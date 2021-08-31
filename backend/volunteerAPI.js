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
    var values = [];

    try 
        {
        util.logINFO("getVolunteerInfo(): called by: " + user.volunteer_id);

        //Set the query
        query =  "SELECT V.volunteer_id AS id, CONCAT(V.firstname, ' ', V.lastname) AS name, V.email, V.username,";
        query += " CONCAT(T.sex, ' - ', T.name) AS teamname, V.team_id, V.leaderboards, VS.num_hours AS numhours";
        query += " FROM volunteer AS V";
        query += " LEFT JOIN team AS T ON T.team_id = V.team_id";
        query += " LEFT JOIN volunteer_stats AS VS ON VS.volunteer_id = V.volunteer_id";
        query += " WHERE V.volunteer_type != $1 AND V.institution_id = $2";

        values.push(enumType.VT_DEV);
        values.push(user.institution_id);

        //Determine Correct Query to run
        if(volunteerID == -1 && (user.volunteer_type == enumType.VT_DEV || user.volunteer_type == enumType.VT_ADMIN))
            {
            query += ";";
            }
        else if(volunteerID == 0)
            {
            query += " AND V.volunteer_id = $3;";

            values.push(user.volunteer_id);
            }
        //To access specific volunteer that is not that user they must have admin or dev privileges
        else if(volunteerID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
            {
            query += " AND V.volunteer_id = $3;";

            values.push(volunteerID);
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
            await database.queryDB(query, values, (res, e) => 
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
    var values = [];
    var query2 = "";
    var values2 = [];

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
            query += " WHERE V.volunteer_id = $1;";

            values.push(user.volunteer_id);
            }
        else if(vol_ID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
            {
            query += " WHERE V.volunteer_id = $1;";

            values.push(vol_ID);
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
            await database.queryDB(query, values, (res, e) => 
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
                    query2 += " WHERE VD.volunteer_id = $1;";

                    values2.push(user.volunteer_id);
                    }
                else if(vol_ID > 0 && (user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV))
                    {
                    query2 += " WHERE VD.volunteer_id = $1;";

                    values2.push(vol_ID);
                    }
                //We already know the vol_ID is valid at this point since it has been checked

                await database.queryDB(query2, values2, (res, e) => 
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
    var values = [];
    var tempResult = {content: true};      //Will be overwritten
    var query2 = "";
    var values2 = [];

    try 
        {
        util.logINFO("editVolunteer(): called by: " + user.volunteer_id);

        //Ensure the username and name is not empty
        if(volunteerData.username != "" && volunteerData.username != undefined && 
            volunteerData.name != "" && volunteerData.name != undefined && util.isValidEmail(volunteerData.email))
            {
            //Ensure the username provided is not used by anyone else 
            query = "SELECT * FROM volunteer WHERE username = $1 AND volunteer_id != $2;";

            values.push(volunteerData.username);
            values.push(user.volunteer_id);

            await database.queryDB(query, values, (res, e) => 
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
                query2 += " firstname = $1, lastname = $2, email = $3,";
                query2 += " username = $4, leaderboards = $5";
                query2 += " WHERE volunteer_id = $6;";

                values2.push(volunteerData.name.split(' ')[0]);
                values2.push(volunteerData.name.split(' ')[1]);
                values2.push(volunteerData.email);
                values2.push(volunteerData.username);
                values2.push(volunteerData.leaderboards);
                values2.push(user.volunteer_id);

                await database.queryDB(query2, values2, (res, e) => 
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
            }
        else 
            {
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            util.logWARN("editVolunteer(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
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
    var values = [];
    var query2 = "";
    var values2 = [];
    var passwordMatch = false;

    try 
        {
        util.logINFO("changePassword(): called by: " + user.volunteer_id);

        //Can assume inputs are now valid, check that the old password is valid
        query = "SELECT password FROM volunteer WHERE volunteer_id = $1";

        values.push(user.volunteer_id);

        await database.queryDB(query, values, (res, e) => 
            { 
            if(e) 
                {
                response.errorcode = error.DATABASE_ACCESS_ERROR;
                response.success = false;
                util.logWARN("changePassword(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                passwordMatch = false;
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
            query2 += " password = $1 WHERE volunteer_id = $2;";
            
            values2.push(bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)));
            values2.push(user.volunteer_id);

            await database.queryDB(query2, values2, (res, e) => 
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
        else 
            {
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = false;
            util.logINFO("changePassword(): Password provided did not match the saved password");
            util.logWARN("changePassword(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
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
// Will update users password in database -- only allowed if user is admin or dev
//
// @param[in]  user                     user information
// @param[in]  userInfo                 Info of user to be updated
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.changePasswordAdmin = async (user, vol_ID, institutionSecret, newPassword) => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var values = [];
    var query2 = "";
    var values2 = [];
    var secretMatch = false;

    try 
        {
        util.logINFO("changePasswordAdmin(): called by: " + user.volunteer_id + " for user: " + vol_ID);

        if(user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV)
            {
            query = "SELECT secret FROM institution WHERE institution_id = $1";
            values.push(user.institution_id);
    
            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("changePasswordAdmin(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    secretMatch = false;
                    }
                else if(institutionSecret == res.rows[0].secret)   // Values should be encrypted eventually -- bcrypt.compareSync(oldPassword, res.rows[0].password)
                    {
                    secretMatch = true;
                    }
                });
    
            //If the secret is correct
            if(secretMatch)
                {
                query2 =  "UPDATE volunteer SET";
                query2 += " password = $1 WHERE volunteer_id = $2;";
                
                values2.push(bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)));
                values2.push(vol_ID);
    
                await database.queryDB(query2, values2, (res, e) => 
                    { 
                    if(e) 
                        {
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("changePasswordAdmin(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
                util.logINFO("changePasswordAdmin(): The institution secret provided did not match the expected secret");
                util.logWARN("changePasswordAdmin(): Set errorcode to: " + error.INVALID_INPUT_ERROR, error.INVALID_INPUT_ERROR);
                }
            }
        else
            {
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            util.logWARN("changePasswordAdmin(): User is of type: " + user.volunteer_type, error.PERMISSION_ERROR);
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("changePasswordAdmin(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("changePasswordAdmin(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("changePasswordAdmin(): Result is: " + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will delete a user from the database
//
// @param[in]  user             user information
// @param[in]  vol_ID           ID of volunteer to delete
//
// @param[out] {success, errorcode}
//
////////////////////////////////////////////////////////////
exports.deleteVolunteer = async (user, vol_ID) => 
    {
    var response = {success: false, errorcode: -1};
    var query = "";
    var values = [];

    try 
        {
        util.logINFO("deleteVolunteer(): called by: " + user.volunteer_id);

        //Verify the user permission
        if(user.volunteer_type == enumType.VT_ADMIN || user.volunteer_type == enumType.VT_DEV)
            {
            var volunteerDeleteSuccess = false;

            // Set the query to delete the volunteer
            query = "DELETE FROM volunteer WHERE volunteer_id = $1;";

            values.push(vol_ID);
        
            await database.queryDB(query, values, (res, e) => 
                { 
                if(e) 
                    {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    util.logWARN("deleteVolunteer(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
                    }
                else 
                    {
                    volunteerDeleteSuccess = true;
                    }
                });

            if (volunteerDeleteSuccess)
                {
                // Set the query to delete the volunteering 
                var query2 = "DELETE FROM volunteeringdata WHERE volunteer_id = $1;";

                var values2 = [vol_ID];

                await database.queryDB(query2, values2, (res, e) => 
                    { 
                    if(e) 
                        {
                        response.errorcode = error.DATABASE_ACCESS_ERROR;
                        response.success = false;
                        util.logWARN("deleteVolunteer(): Set errorcode to: " + error.DATABASE_ACCESS_ERROR, error.DATABASE_ACCESS_ERROR);
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
            response.errorcode = error.PERMISSION_ERROR;
            response.success = false;
            util.logWARN("deleteVolunteer(): User is of type: " + user.volunteer_type, error.PERMISSION_ERROR);
            }
        }
    catch (err)
        {
        response.errorcode = error.SERVER_ERROR;
        response.success = false;

        util.logWARN("deleteVolunteer(): Set errorcode to: " + error.SERVER_ERROR, error.SERVER_ERROR);
        util.logERROR("deleteVolunteer(): " + err.message, err.code);
        }

    //Log completion of function
    util.logINFO("deleteVolunteer(): Result is: " + response.success);

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
    var values = [];

    try 
        {
        util.logINFO("getVolunteerLeaderboard(): called by: " + user.volunteer_id);

        // Can look at reordering query with innner join so that we do not have to consider null situations with num_hours
        query =  " SELECT CONCAT(V.firstname, ' ', V.lastname) AS name, CONCAT(T.sex, ' - ', T.name) AS teamname, VS.num_hours AS numhours";
        query += " FROM volunteer_stats AS VS";
        query += " LEFT JOIN volunteer AS V ON V.volunteer_id = VS.volunteer_id";
        query += " LEFT JOIN team AS T ON T.team_id = VS.team_id";
        query += " WHERE VS.institution_id = $1 AND V.leaderboards = true";
        query += " ORDER BY num_hours DESC NULLS LAST LIMIT 10;";

        values.push(user.institution_id);
       
        await database.queryDB(query, values, (res, e) => 
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
                var tempRank = res.rows;

                //Set the rank of each volunteer
                for(var v = 0; v < tempRank.length; v++)
                    {
                    if(tempRank[v].numhours == null)
                        break;

                    tempRank[v]['rank'] = v+1;
                    response.volunteerLeader.push(tempRank[v]); 
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
    var values = [];
    var tempResult = [];
    var query2 = "";
    var values2 = [];


    try {
        util.logINFO("createAccount(): called by: " +  vData.username + " for institution: " + vData.institution_id);

        //Validate email input 
        if(util.isValidEmail(vData.email))
            {            
            //Make sure the provided username is unique
            query = "SELECT volunteer_id FROM volunteer WHERE username = $1;";

            values.push(vData.username);

            await database.queryDB(query, values, (res, e) => 
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
                query2 += "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);"

                values2.push(vData.team_id);
                values2.push(vData.institution_id);
                values2.push(vData.name.split(" ")[0]);
                values2.push(vData.name.split(" ")[1]);
                values2.push(vData.email);
                values2.push(bcrypt.hashSync(vData.password, bcrypt.genSaltSync(10)));
                values2.push(vData.username);
                values2.push(enumType.VT_VOLUNTEER);
                values2.push(vData.leaderboards);

                await database.queryDB(query2, values2, (res, e) => 
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