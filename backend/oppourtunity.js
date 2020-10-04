////////////////////////////////////////////////////////////////////////
// oppourtunity.js -- backend functions for oppourtuntiy related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const general = require('./general');


////////////////////////////////////////////////////////////
// Will get the oppourtunity data
//
// @param[in]  volunteerID      volunteerID of client making function call
// @param[in]  oppourtunityID   ID of opp user is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] oppData          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getOpportunityData = async (volunteerID, oppourtunityID) => 
  {
  var response = {success: false, errorCode: -1, oppData: []};

  try 
    {
    console.log('getOpportunityData() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    //Set some default values to use for now
    var oppElement = 
        {
        title: "Testing Opp", 
        date: "Oct 7 2020", 
        startTime: "19:30", 
        endTime: "20:30", 
        location: "Zoom", 
        id: 1, 
        occured: false, 
        type: "SAAC Meeting", 
        viewableBy: -1, 
        description: "This is a text event that is the next SAAC meeting which we will use to test post method", 
        sequenceNum: 1, 
        numVolunteers: 1 
        };
    
    response.oppData.push(oppElement);
    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.oppData = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getOpportunityData() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////
// Will get the oppoutunity info
//
// @param[in]  volunteerID      volunteerID of client making function call
// @param[in]  oppourtunityID   ID of opp user is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] oppInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getOpportunityInfo = async (volunteerID, oppourtunityID) => 
  {
  var response = {success: false, errorCode: -1, oppInfo: []};

  try 
    {
    console.log('getOpportunityInfo() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    //Set some default values to use for now
    var oppElement = 
        {
        title: "Testing Opp", 
        date: "Oct 7 2020", 
        startTime: "19:30", 
        endTime: "20:30", 
        type: "SAAC Meeting", 
        numVolunteers: 1 
        };
    
    response.oppInfo.push(oppElement);
    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getOpportunityInfo() is: ' + response.success);
  
  return response;
  }



////////////////////////////////////////////////////////////////////////////////////
// Will save oppourtunity to database
//
// @param[in]  volunteerID              volunteerID of client making function call
// @param[in]  oppData                  JSON of oppourtunity JSON for event being added
//
// @param[out] {success, errorCode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.addOppourtunity = async (volunteerID, oppData) => 
  {
  var response = {success: false, errorCode: -1};

  try 
    {
    console.log('addOppourtunity() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY TO ADD DATA HERE////////////////////////////////////
    
    ////////////////////////ADD SQL QUERY TO ADD DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of addOppourtunity() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////////////////////////////
// Will edit oppourtunity to database
//
// @param[in]  volunteerID              volunteerID of client making function call
// @param[in]  oppData                  JSON of oppourtunity JSON for event being editted
//
// @param[out] {success, errorCode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.editOppourtunity = async (volunteerID, oppData) => 
  {
  var response = {success: false, errorCode: -1};

  try 
    {
    console.log('editOppourtunity() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of editOppourtunity() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////////////////////////////
// Will get the oppourtunity types availible for display
//
// @param[in]  volunteerID          volunteerID of client making function call
//
// @param[out] oppourtunityTypes    Array of oppourtunity types availible at instituion
//
////////////////////////////////////////////////////////////////////////////////////
exports.getOppourtunityTypes = async volunteerID => 
  {
  var response = {success: false, errorCode: -1, oppourtunityTypes: []};

  try 
    {
    console.log('getOppourtunityTypes() called by: ' + volunteerID);

    var instituionIdOfVolunteer = await general.getVolunteerInstitutionID(volunteerID);

    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    //Set default values for now
    response.oppourtunityTypes = ["SAAC Meetings", "Special Olympics", "Game Day Events", "Social Events"];
    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getOppourtunityTypes() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////////////////////////////
// Will add the oppourtunity types to the institution enum
//
// @param[in]  volunteerID              volunteerID of client making function call
// @param[in]  oppourtunityType         volunteerID of client making function call
//
// @param[out] {success, errorCode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.addOppourtunityType = async (volunteerID, oppourtunityType)  => 
  {
  var response = {success: false, errorCode: -1, oppourtunityTypes: []};

  try 
    {
    console.log('addOppourtunityType() called by: ' + volunteerID);

    var instituionIdOfVolunteer = await general.getVolunteerInstitutionID(volunteerID);

    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of addOppourtunityType() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////////////////////////////
// Will determine what teams are availible to view a specific oppourtunity
//
// @param[in]  volunteerID              volunteerID of client making function call
//
// @param[out] {success, errorCode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.getTeamsForViewable = async volunteerID => 
  {
  var response = {success: false, errorCode: -1, teams: []};

  try 
    {
    console.log('getTeamsForViewable() called by: ' + volunteerID);

    var instituionIdOfVolunteer = await general.getVolunteerInstitutionID(volunteerID);

    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    response.teams = ["M - Golf", "W - Golf", "M - Swim", "W - Swim"];
    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getTeamsForViewable() is: ' + response.success);
  
  return response;
  }