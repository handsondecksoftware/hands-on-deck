var database = require('./databaseSetup');


////////////////////////////////////////////////////////////
//
// Will get the volunteers instituion id
//
////////////////////////////////////////////////////////////
exports.getVolunteerInstitutionID = volunteerID => 
  {
  var returnVal = -1;

  //Determine what institution the volunteer is from 
  if(typeof volunteerID === "number")
    {
    database.db.query('SELECT institution_id FROM volunteer WHERE volunteer_id = ' + volunteerID + ';', (err, res) => 
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