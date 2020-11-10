////////////////////////////////////////////////////////////////////////
// opportunity.js -- backend functions for oppourtuntiy related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const general = require('./general');
const error = require('./errorCodes');

////////////////////////////////////////////////////////////
// Will get the opportunity data
//
// @param[in]  volunteerID      volunteerID of client making function call
// @param[in]  opportunityID   ID of opp user is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] oppData          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getOpportunityData = async (volunteerID, opportunityID) => 
  {
  var response = {success: false, errorCode: -1, oppData: []};

  try 
    {
    console.log('getOpportunityData() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    //Set some default values to use for now
    var cordinatorInfo = {name: "Ryan Stolys", email: "rstolys@sfu.ca", phone: "123-456-789"};
    var currentVolunteers = [{name: "Jayden Cole", email: "jcole@sfu.ca", team: "M - Swim", hours: 2.5, volDataID: 1}];
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
        description: "This is a test event that is the next SAAC meeting which we will use to test post method", 
        sequenceNum: 1, 
        coordinatorInfo: cordinatorInfo,
        volunteerLimt: 10,
        volunteers: currentVolunteers 
        };
    
    response.oppData.push(oppElement);
    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    
    response.errorCode = error.NOERROR;
    response.success = true;
    }
  catch (err)
    {
    console.log("Error Occurred: " + err.message);

    response.errorCode = error.SERVER_ERROR;
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
// @param[in]  opportunityID   ID of opp user is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] oppInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getOpportunityInfo = async (volunteerID, opportunityID) => 
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
    
    response.errorCode = error.NOERROR;
    response.success = true;
    }
  catch (err)
    {
    console.log("Error Occurred: " + err.message);

    response.errorCode = error.SERVER_ERROR;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getOpportunityInfo() is: ' + response.success);
  
  return response;
  }



////////////////////////////////////////////////////////////////////////////////////
// Will save opportunity to database
//
// @param[in]  volunteerID              volunteerID of client making function call
// @param[in]  oppData                  JSON of opportunity JSON for event being added
//
// @param[out] {success, errorCode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.addOpportunity = async (volunteerID, oppData) => 
  {
  var response = {success: false, errorCode: -1};

  try 
    {
    console.log('addOpportunity() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY TO ADD DATA HERE////////////////////////////////////
    
    /*
    Data in opp data is in form: 
    {
    title: <string>, 
    date: <string>, -- MMM DD YYYY (Mar 15 2020)
    startTime: <time>, 
    endTime: <time>, 
    location: <string>, 
    id: <int>,
    occurred: <bool>, 
    type: <string>, 
    viewableBy: [] <string>,		//This will be -1 if it  is viewable by all teams
    description: <string>, 
    sequenceNum: <int>, 
    coordinatorInfo: {name: <string>, email: <string>, phone: <string>},
    volunteerLimit: <int>
    volunteers: []   {name: <string>, email: <string>, team: <string>, hours: <number>}
    }
    */
    
    ////////////////////////ADD SQL QUERY TO ADD DATA HERE////////////////////////////////////
    
    response.errorCode = error.NOERROR;
    response.success = true;
    }
  catch (err)
    {
    console.log("Error Occurred: " + err.message);

    response.errorCode = error.SERVER_ERROR;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of addOpportunity() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////////////////////////////
// Will edit opportunity to database
//
// @param[in]  volunteerID              volunteerID of client making function call
// @param[in]  oppData                  JSON of opportunity JSON for event being editted
//
// @param[out] {success, errorCode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.editOpportunity = async (volunteerID, oppData) => 
  {
  var response = {success: false, errorCode: -1};

  try 
    {
    console.log('editOpportunity() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    response.errorCode = error.NOERROR;
    response.success = true;
    }
  catch (err)
    {
    console.log("Error Occurred: " + err.message);

    response.errorCode = error.SERVER_ERROR;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of editOpportunity() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////////////////////////////
// Will edit opportunity to database
//
// @param[in]  volunteerID              volunteerID of client making function call
// @param[in]  opportunityID           opportunityID to be deleted
//
// @param[out] {success, errorCode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.deleteOpportunity = async (volunteerID, opportunityID) => 
  {
  var response = {success: false, errorCode: -1};

  try 
    {
    console.log('deleteOpportunity() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    //Need to check that this user has permission to delete opportunity as well
    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    response.errorCode = error.NOERROR;
    response.success = true;
    }
  catch (err)
    {
    console.log("Error Occurred: " + err.message);

    response.errorCode = error.SERVER_ERROR;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of deleteOpportunity() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////////////////////////////
// Will get the opportunity types availible for display
//
// @param[in]  volunteerID          volunteerID of client making function call
//
// @param[out] opportunityTypes    Array of opportunity types availible at instituion
//
////////////////////////////////////////////////////////////////////////////////////
exports.getOpportunityTypes = async volunteerID => 
  {
  var response = {success: false, errorCode: -1, OpportunityTypes: []};

  try 
    {
    console.log('getOpportunityTypes() called by: ' + volunteerID);

    var instituionIdOfVolunteer = await general.getVolunteerInstitutionID(volunteerID);

    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    //Set default values for now
    response.opportunityTypes = ["SAAC Meetings", "Special Olympics", "Game Day Events", "Social Events"];
    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    response.errorCode = error.NOERROR;
    response.success = true;
    }
  catch (err)
    {
    console.log("Error Occurred: " + err.message);

    response.errorCode = error.SERVER_ERROR;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getOpportunityTypes() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////////////////////////////
// Will add the opportunity types to the institution enum
//
// @param[in]  volunteerID              volunteerID of client making function call
// @param[in]  opportunityType         volunteerID of client making function call
//
// @param[out] {success, errorCode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.addOpportunityType = async (volunteerID, opportunityType)  => 
  {
  var response = {success: false, errorCode: -1, OpportunityTypes: []};

  try 
    {
    console.log('addOpportunityType() called by: ' + volunteerID);

    var instituionIdOfVolunteer = await general.getVolunteerInstitutionID(volunteerID);

    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
    
    response.errorCode = error.NOERROR;
    response.success = true;
    }
  catch (err)
    {
    console.log("Error Occurred: " + err.message);

    response.errorCode = error.SERVER_ERROR;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of addOpportunityType() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////////////////////////////
// Will determine what teams are availible to view a specific opportunity
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
    
    response.errorCode = error.NOERROR;
    response.success = true;
    }
  catch (err)
    {
    console.log("Error Occurred: " + err.message);

    response.errorCode = error.SERVER_ERROR;
    response.oppInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getTeamsForViewable() is: ' + response.success);
  
  return response;
  }