////////////////////////////////////////////////////////////////////////
// general.js -- backend functions for general requests and for use by specific requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');


////////////////////////////////////////////////////////////////////////
// GLOABL CONSTANTS AND VARIABLES
////////////////////////////////////////////////////////////////////////
const NOERROR = 0; 
const DATABASE_ACCESS_ERROR = 1; 
const UNKNOWN_ERROR = 99; 
////////////////////////////////////////////////////////////////////////
// END OF GLOABL CONSTANTS AND VARIABLES
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
//
// Will get the volunteers instituion id
//
////////////////////////////////////////////////////////////
exports.getVolunteerInstitutionID = async volunteerID => 
  {
  var returnVal = -1;

  //Determine what institution the volunteer is from 
  if(typeof volunteerID === "number")
    {
    database.queryDB('SELECT institution_id FROM volunteer WHERE volunteer_id =' + volunteerID + ';', (err, res) =>
      {
      if (err)
        {
        returnVal = -1; //Indicate an error, don't want to crash the system
        console.log("Error fetching the institution_id of volunteer: " + volunteerID + "\nError: " + err);
        }
      else 
        {
        returnVal = res.rows[0].institution_id;
        console.log("getVolunteerInstitutionID set return value to: " + returnVal);    
        }
      
      return returnVal; 
      });
    }
  else 
    {
    return returnVal; 
    }
  }


////////////////////////////////////////////////////////////
//
// Will get the volunteers instituion id
//
////////////////////////////////////////////////////////////
exports.getInstitutionStats = volunteerID => 
  {
  var response = {success: false, errorCode: -1, iStats: null};

  try 
    {
    console.log('getInstitutionStats() called by: ' + volunteerID);

    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    //Set some default values to use for now
    response.iStats = 
      {
      institution: "Simon Fraser University", 
      activeVolunteers: 45, 
      inactiveVolunteers: 354, 
      volunteerHoursGoal: 750, 
      currentVolunteerHours: 79,
      }
    ////////////////////////ADD SQL QUERY FOR DATA HERE////////////////////////////////////
    
    response.errorCode = NOERROR;
    response.success = true;
    }
  catch (error)
    {
    console.log("Error Occurred: " + error.message);

    response.errorCode = error.code;
    response.iStats = null;
    response.success = false;
    }

  //Log completion of function
  console.log('Result of getInstitutionStats() is: ' + response.success);
  
  return response;
  }