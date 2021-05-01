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
            type: "Meetings",
            starttime: "2021-04-07T19:30:00Z",
            endtime: "2021-04-07T20:30:00Z",
            numvolunteers: 2,
            };

        response.oppInfo.push(oppElement);
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        response.errorcode = error.NOERROR;
        response.success = true;
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
// Will get the opportunity info
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

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        var oppElement = 
            {
            id: oppID,
            sequencenum: 1,
            title: "Your Opportunity",
            type: "Meetings",
            starttime: "2021-04-07T19:30:00Z",
            endtime: "2021-04-07T20:30:00Z",
            numvolunteers: 2,
            };

        response.oppInfo.push(oppElement);
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        response.errorcode = error.NOERROR;
        response.success = true;
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

    try 
        {
        console.log('getOpportunityData() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
        //Set some default values to use for now
        var oppElement = 
            {
            id: 1,
            sequenceNum: 1,
            title: "SAAC Meeting", 
            type: "Meetings", 
            starttime: "2021-04-07 19:30:00",
            endtime: "2021-04-07 20:30:00",
            location: "Zoom",
            description: "This is a test event that is the next SAAC meeting which we will use to test post method", 
            viewableBy: [{name: 'All Teams', id: 0}],  
            volunteerLimt: 40,
            cordinatorname: "Ryan Stolys",
            cordinatoremail: "rstolys@sfu.ca",
            cordinatorphone: "123-456-7890",
            numvolunteers: 1,
            volunteers: [{name: "Jayden Cole", email: "jcole@sfu.ca", team: "M - Swim", hours: 2.5, volDataID: 1}],
            };

        response.oppData.push(oppElement);
        ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////

        response.errorcode = error.NOERROR;
        response.success = true;
        }
    catch (err)
        {
        console.log("Error Occurred: " + err.message);

        response.errorcode = error.SERVER_ERROR;
        response.oppData = null;
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

    try 
        {
        console.log('addOpportunity() called by: ' + user.volunteer_id);

        var errorOccurred = false;

        /* TODO: Needs to be fixed
        if(!errorOccurred) 
            {
            await database.queryDB("INSERT INTO opportunity (opp_id, title, date, starttime, endtime, type, description, location) VALUES ('" + (Math.floor(Math.random() * 100) + 10) + "', '" + oppData.title + "', '" + oppData.date + "', '" + oppData.startTime + "','" + oppData.endTime + "', '" + oppData.type + "', '" + oppData.description + "', '" + oppData.location + "')", 
                (res, e) => {
                if(e) 
                    {
                    console.log("error occured")
                    response.errorcode = error.DATABASE_ACCESS_ERROR;
                    response.success = false;
                    }
                else 
                    {
                    //Send the user an email with their account info 
                    response.errorcode = error.NOERROR;
                    response.success = true;
                    }
            });
            }
        */
        //Temp values until above is fixed to be real query into database
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
    console.log('Result of addOpportunity() is: ' + response.success);

    return response;
    }


////////////////////////////////////////////////////////////////////////////////////
// Will edit opportunity to database
//
// @param[in]  user                     user information
// @param[in]  oppData                  JSON of opportunity JSON for event being editted
//
// @param[out] {success, errorcode}     Values indicating success of add  
//
////////////////////////////////////////////////////////////////////////////////////
exports.editOpportunity = async (user, oppData) => 
    {
    var response = {success: false, errorcode: -1};

    try 
        {
        console.log('editOpportunity() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
        console.log(oppData);
        ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////

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

    try 
        {
        console.log('deleteOpportunity() called by: ' + user.volunteer_id);

        ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
        //Need to check that this user has permission to delete opportunity as well
        ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////

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

        ////////////////////////ADD SQL QUERY TO EDIT DATA HERE////////////////////////////////////
        //Set default values for now
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