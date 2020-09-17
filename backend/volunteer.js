////////////////////////////////////////////////////////////////////////
// volunteer.js -- backend functions for volunteer related requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

var database = require('./databaseSetup');
var general = require('./general');


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
exports.loadVolunteerInfo = (requesterID, volunteerID) => 
  {
  var returnVal = [];
  
  if(volunteerID === -1)
    {
    //Determine what institution the requester is from 
    var institutionID = general.getVolunteerInstitutionID(requesterID);
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
