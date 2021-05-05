////////////////////////////////////////////////////////////////////////
// team.js -- backend functions for team related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
// Jayden Cole, 18/01/21
//    - Update to current design documentation
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const general = require('./general');
const error = require('./errorCodes');


const MALE = 1; 
const FEMALE = 0; 


////////////////////////////////////////////////////////////
// Will get the team info
//
// @param[in]  user             user information
// @param[in]  teamID           ID of team the client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getTeamInfo = async (user, teamID) => 
    {
    var response = {success: false, errorcode: -1, teamInfo: []};

    try 
        {
        console.log('getTeamInfo() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        var teamElement = 
            {
            id: 1, 
            name: "Golf", 
            sex: MALE, 
            numvolunteers: 1, 
            numhours: 23, 
            };
                

        response.teamInfo.push(teamElement);
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.teamInfo = null;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getTeamInfo() is: ' + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
// Will get all the team info
//
// @param[in]  institution_id       institution_id to get teams for
//
// @param[out] teamInfo             Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getAllTeamInfo = async (institution_id) => 
    {
    var response = {success: false, errorcode: -1, teamInfo: []};
    var query = "";

    try 
        {
        var currTime = new Date().toISOString();
        console.log('getAllTeamInfo() called at: ' + currTime);

        //Set the query -- need to exclude the developer accounts
        if(general.verifyInput(institution_id))
            {
            query = "SELECT team_id AS id, name, sex FROM team WHERE institution_id = " + institution_id + ";";

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
                    response.teamInfo = res.rows;
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
                });
            }
        else 
            {
            response.teamInfo = [{id: null, name: "No Team's Availible", sex: "" }];
            response.errorcode = error.INVALID_INPUT_ERROR;
            response.success = true;
            }
        
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.teamInfo = [{id: null, name: "No Team's Availible", sex: "" }];
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getAllTeamInfo() is: ' + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
// Will get the team data
//
// @param[in]  user             user information
// @param[in]  teamID           ID of team client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerData    Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getTeamData = async (user, teamID) => 
    {
    var response = {success: false, errorcode: -1, teamData: null};

    try 
        {
        console.log('getTeamData() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        var volunteerElement = 
                {
                id: 1,
                name: "Ryan Stolys",
                email: "rstolys@sfu.ca",
                leaderboards: true, 
                teamname: "M - Golf", 
                team_id: 1,
                numhours: 23, 
                };

        var volunteerElement2 = 
                {
                id: 2,
                name: "Jayden Cole",
                email: "jcole@sfu.ca",
                leaderboards: true, 
                teamname: "M - Swim", 
                team_id: 1,
                numhours: 34, 
                };
            

        var teamElement = 
            {
            id: 1, 
            name: "Golf", 
            sex: "Men", 
            numvolunteers: 1, 
            numhours: 23,
            leaderboard: true, 
            volunteers: [volunteerElement, volunteerElement2],
            };
            

        response.teamData = teamElement;
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.teamData = null;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getTeamData() is: ' + response.success);

    return response;
    }


////////////////////////////////////////////////////////////
// Will edit the team to database
//
// @param[in]  user                     user information
// @param[in]  teamData                 Data of team to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.editTeam = async (user, teamData) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('editTeam() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Edit team data
        //JSON element is in form
        /*
        teamData = 
            { 
            id, 
            name, 
            sex, 
            numvolunteers, 
            numhours, 
            volunteers,
            }; 
        */   
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of editTeam() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will add the team to database
//
// @param[in]  user                     user information
// @param[in]  teamData                 Data of team to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.addTeam = async (user, teamData) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('addTeam() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Edit team data
        //JSON element is in form
        /*
        teamData = 
            { 
            id, 
            name, 
            sex, 
            numvolunteers, 
            numhours, 
            volunteers,
            }; 
        */   
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        /* FIX QUERY TO BE LEGITIMATE ADD WITH NEW DATABASE
        await database.queryDB("INSERT INTO team (team_id, name, institution_id, leaderboard, sex) VALUES ('" + (Math.floor(Math.random() * 100) + 10) + "', '" + teamData.name + "', '" + 1 + "', '" + teamData.leaderboards + "', '" + teamData.sex + "')", 
                                (res, e) => {
                if(e) {
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                }
                else {
                    //Send the user an email with their account info 
                    response.errorcode = error.NOERROR;
                    response.success = true;
                }
            });
        */

        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of addTeam() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will add the team to database
//
// @param[in]  user                     user information
// @param[in]  teamData                 Data of team to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.deleteTeam = async (user, teamID) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('deleteTeam() called by: ' + user.volunteer_id + ' for team: ' + teamID);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
          
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    
        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of deleteTeam() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will get teams to view -- function call for admin portal
//
// @param[in]  user             user information
//
// @param[out] teamInfo[]       Array of teamInfos that are part of an institution
//
////////////////////////////////////////////////////////////
exports.getTeamsForViewable = async user => 
    {
    var response = {success: false, errorcode: -1, teamInfo: []};

    try 
        {
        console.log('getTeamsForViewable() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Used as default values for now -- we don't need numvolunteers and num hours in response 
        //  will make query faster to exclude them
        response.teamInfo.push({id: 1, name: "Golf", sex: 'Men', numvolunteers: null, numhours: null});
        response.teamInfo.push({id: 3, name: "Golf", sex: 'Women', numvolunteers: null, numhours: null});
        response.teamInfo.push({id: 2, name: "Golf", sex: 'Men', numvolunteers: null, numhours: null});
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getTeamsForViewable() is: ' + response.success);
    
    return response;
    }


////////////////////////////////////////////////////////////
// Will update user info in database
//
// @param[in]  user             user information
//
// @param[out] teamInfo         array of all teams from an insitution
//
////////////////////////////////////////////////////////////
exports.getTeamLeaderboard = async user => 
    {
    var response = {success: false, errorcode: -1, teamLeader: []};

    try 
        {
        console.log('getTeamLeaderboard() called by: ' + user.volunteer_id);

        query =  " SELECT CONCAT(T.sex, ' - ', T.name) AS teamname, VS.num_hours";
        query += " FROM volunteer_stats AS VS";
        query += " LEFT JOIN team AS T ON T.team_id = VS.team_id";
        query += " WHERE VS.institution_id = " + user.institution_id;
        query += " ORDER BY num_hours DESC;";
       
        await database.queryDB(query, (res, e) => 
            { 
            if(e) 
                {
                console.log("DATABASE ERROR: " + e.message);
                response.teamLeader = [];
                response.errorcode = error.DATABASE_ACCESS_ERROR;
                response.success = false;
                }
            else 
                {
                response.teamLeader = res.rows;

                //Set the rank of each volunteer -- assuming they are in sorted order already
                for(var t = 1; i <= response.teamLeader.length; t++)
                    {
                    response.teamLeader[t]['rank'] = t; 
                    }

                response.errorcode = error.NOERROR;
                response.success = true;
                }
            });
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.teamLeader = null;
        response.errorcode = error.SERVER_ERROR;
        response.success = false;
        }

    //Log completion of function
    console.log('Result of getTeamLeaderboard() is: ' + response.success);
    
    return response;
    }
