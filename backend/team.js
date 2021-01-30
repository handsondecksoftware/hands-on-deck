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
// Will get the team data
//
// @param[in]  volunteerID      volunteerID of client making function call
// @param[in]  teamID           ID of team client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerData    Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getTeamData = async (volunteerID, teamID) => 
  {
  var response = {success: false, errorcode: -1, teamData: []};

  try 
    {
    console.log('getTeamData() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    //Set some default values to use for now
    var teamElement = 
        {
        name: "Golf", 
        id: 1, 
        numHours: 23, 
        sex: MALE,
        leaderboards: true,
        volunteerIDs: [1]
        };
        
    
    response.teamData.push(teamElement);
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
// Will get the team info
//
// @param[in]  volunteerID      volunteerID of client making function call
// @param[in]  teamID           ID of team the client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getTeamInfo = async (volunteerID, teamID) => 
  {
  var response = {success: false, errorcode: -1, teamInfo: []};

  try 
    {
    console.log('getTeamInfo() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    //Set some default values to use for now
    var teamElement = 
        {
        name: "Golf", 
        id: 1, 
        numHours: 23, 
        sex: MALE
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
// Will edit the team to database
//
// @param[in]  volunteerID              volunteerID of client making function call
// @param[in]  teamData                 Data of team to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.editTeam = async (volunteerID, teamData) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('editTeam() called by: ' + volunteerID);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Edit team data
        //JSON element is in form
        /*
        teamData = 
            { 
            name: <string>, 
            id: <int>, 
            numHours: <int>, 
            sex: <int>, 
            leaderboards: <bool>,
            volunteerIDs: <int> [] 
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
// @param[in]  volunteerID              volunteerID of client making function call
// @param[in]  teamData                 Data of team to be added
//
// @param[out] {success, errorcode}     return variables indicating the success or failure of the request 
//
////////////////////////////////////////////////////////////
exports.addTeam = async (volunteerID, teamData) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('addTeam() called by: ' + volunteerID);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Edit team data
        //JSON element is in form
        /*
        teamData = 
            { 
            name: <string>, 
            id: <int>, 
            numHours: <int>, 
            sex: <int>, 
            leaderboards: <bool>,
            volunteerIDs: <int> [] 
            }; 
        */    
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        
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
// Will get teams to view
//
// @param[in]  volunteerID          volunteerID of client making function call
//
// @param[out] teamInfo[]      Array of teamInfos that are part of an institution
//
////////////////////////////////////////////////////////////
exports.getTeamsForViewable = async volunteerID => 
    {
    var response = {success: false, errorcode: -1, teamInfo: []};

    try 
        {
        console.log('getTeamsForViewable() called by: ' + volunteerID);

        //Get the volunteers instituion
        var institutionID = await general.getVolunteerInstitutionID(volunteerID);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Used as default values for now
        response.teamInfo.push({name: "Golf", id: 1, sex: 1});
        response.teamInfo.push({name: "Golf", id: 1, sex: 0});
        response.teamInfo.push({name: "Swim", id: 1, sex: 1});
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