////////////////////////////////////////////////////////////////////////
// volunteer.js -- backend functions for volunteer related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const general = require('./general');



////////////////////////////////////////////////////////////
// Will get the volunteer data
//
// @param[in]  clientID         volunteerID of client making function call
// @param[in]  volunteerID      ID of volunteer client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerData    Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteerData = (clientID, volunteerID) => 
  {
  var response = {success: false, errorCode: -1, volunteerData: []};

  try 
    {
    console.log('getVolunteerData() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    //Set some default values to use for now
    var volunteerElement = 
        {
        firstName: "Ryan",
        lastName: "Stolys",
        email: "rstolys@sfu.ca", 
        type: 1,
        id: 1, 
        teamName: "M - Golf", 
        teamID: 1, 
        volHours: 23, 
        volunteeringData: null
        };
        
    
    response.volunteerData.push(volunteerElement);
    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.volunteerData = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getVolunteerData() is: ' + response.success);
  
  return response;
  }


////////////////////////////////////////////////////////////
// Will get the volunteer info
//
// @param[in]  clientID         volunteerID of client making function call
// @param[in]  volunteerID      ID of volunteer client is looking for detail on
//                                  value of -1 means all values are of interest
//
// @param[out] volunteerInfo          Array of data JSONs for client  
//
////////////////////////////////////////////////////////////
exports.getVolunteerInfo = (clientID, volunteerID) => 
  {
  var response = {success: false, errorCode: -1, volunteerInfo: []};

  try 
    {
    console.log('getVolunteerInfo() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    //Set some default values to use for now
    var volunteerElement = 
        {
        firstName: "Ryan",
        lastName: "Stolys",
        email: "rstolys@sfu.ca", 
        teamName: "M - Golf", 
        volHours: 23, 
        id: 1 
        };
            
    
    response.volunteerInfo.push(volunteerElement);
    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.volunteerInfo = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getVolunteerInfo() is: ' + response.success);
  
  return response;
  }


/* THIS WAS ALREADY HERE AND CAN BE USED AS REFERENCE FOR NOW BUT ISN'T USED ANYMORE
        WILL BE DELETED ONCE WE HAVE SOME FUNCTIONAL CALLS THAT CAN BE USED AS REFERENCES
////////////////////////////////////////////////////////////////////////////////////////
//
// Will get the volunteer info from the database
//
// Current issues: 
//    - will need to hold the function until the intitution id is found
//      or include the institution id of the requester in the query (currently hard-coded to 1)
//    - will need to determine the team name which is accessed from the team_id of the volunteer...
//                
//
////////////////////////////////////////////////////////////////////////////////////////
exports.loadVolunteerInfo = async (requesterID, volunteerID) => 
  {
  var returnVal = [];
  
  if(volunteerID === -1)
    {
    //Determine what institution the requester is from 
    var institutionID = await general.getVolunteerInstitutionID(requesterID);
    console.log("test" + institutionID);

    database.db.query('SELECT firstname, lastname, email, team_id, volunteer_id FROM volunteer WHERE institution_id = 1;', (err, res) => 
      {
      if(err)
        {
        returnVal.push(-1); //Indicate an error, don't want to crash the system
        console.log("Error fetching all the volunteer data from volunteer table. \nError: " + err);
        }
      else 
        {
        for(var i = 0; i < res.rows.length; i++)
          {
          returnVal.push(res.rows[i]);
          }
        }
      
      database.db.end();
      console.log(returnVal);
      });
    }
  else 
    {
    for(var i = 0; i < volunteerID.length; i++)
      {
      //Don't need to filter institution id since volunteer list is provided
      database.db.query('SELECT firstname, lastname, email, teamname, volunteer_id FROM volunteer WHERE volunteer_id =' + volunteerID[i] + ';', (err, res) => 
        {
        if(err)
          {
          returnVal.push(-1); //Indicate an error, don't want to crash the system
          console.log("Error fetching the volunteer data from volunteer table. \nError: " + err);
          }
        else 
          {
          returnVal.push(res.rows[i]);
          }
        
        database.db.end();
        });
      }
    }
  
  return returnVal;
  }
*/