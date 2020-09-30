////////////////////////////////////////////////////////////////////////
// team.js -- backend functions for team related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const general = require('./general');


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
exports.getTeamData = (volunteerID, teamID) => 
  {
  var response = {success: false, errorCode: -1, teamData: []};

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
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
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
// @param[in]  teamID           ID of team client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getTeamInfo = (volunteerID, teamID) => 
  {
  var response = {success: false, errorCode: -1, teamInfo: []};

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
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.teamInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getTeamInfo() is: ' + response.success);
  
  return response;
  }