////////////////////////////////////////////////////////////////////////
// general.js -- backend functions for general requests and for use by specific requests
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const database = require('./databaseSetup');
const error = require('./errorCodes');


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
        database.queryDB('SELECT institution_id FROM volunteer WHERE volunteer_id =' + volunteerID + ';', (res, err) =>
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
// Will generate a random 8 digit password for the user
//
////////////////////////////////////////////////////////////
exports.generatePassword = () => {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*(){}[]?><~";
    var string_length = 8;
    var randomstring = '';

    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars[rnum];
    }

    return randomstring;
}


////////////////////////////////////////////////////////////
//
// Will check that input will not contain SQL injection attack
//
////////////////////////////////////////////////////////////
exports.verifyInput = input => {
    var valid = true;

    try
        {
        //If the input is a number then it will be ok, check if it is not
        if(isNaN(input))
            {
            if(input.includes(';'))
                valid = false;
            else if(input.includes('OR'))
                valid = false;
            else if(input.includes('='))

            //Add more checks for sql injection attacks
            if(!valid)
                console.log("Input was invalid, may be SQL injection attack... INPUT: " + input);
            }
        }
    catch (error)
        {
        valid = false;
        console.log("Input that caused error: " + input);
        console.log("Error occured in verifying the input: " + error.message);
        }

    return valid;
}


////////////////////////////////////////////////////////////////////////
// 
// Will determine if email address provided is valid or empty string
//
//////////////////////////////////////////////////////////////////////// 
exports.isValidEmail = email =>
    {
    var isValid = false;

    if(email != "" && email != undefined)
        {
        if(email.includes("@") && email.includes("."))
            {
            isValid = true;
            }
        }
    else 
        {
        isValid = true;     //Empty fields will be considered valid 
        }
    

    return isValid;
    }