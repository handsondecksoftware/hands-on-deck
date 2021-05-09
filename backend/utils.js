////////////////////////////////////////////////////////////////////////
// utils.js -- utility functions for general functions needed such 
//      as logging and enum verification
//                  
// Ryan Stolys, 8/05/21
//    - File Created
//
////////////////////////////////////////////////////////////////////////

const error = require('../backend/errorcodes');

const PRODUCTION = true;

const LOG_SPACE = "  "; 

const INFO = "INFO: ";
const WARN = "WARN: ";
const ERROR = "ERROR:";


////////////////////////////////////////////////////////////
//
// Will check that input will not contain SQL injection attack
//
////////////////////////////////////////////////////////////
exports.verifyInput = input => 
    {
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
                this.logWARN("verifyInput(): Input was invalid, may be SQL injection attack... INPUT: " + input, error.INVALID_INPUT_ERROR);
            }
        }
    catch(err)
        {
        valid = false;
        this.logERROR("verifyInput(): Error while trying to verify the input: " + err.message, err.code);
        this.logINFO("verifyInput(): Input that caused error: " + input);
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

    try
        {
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
        }
    catch(err)
        {
        isValid = false;
        this.logERROR("isValidEmail(): Error while trying to verify email: " + err.message, err.code);
        this.logINFO("isValidEmail(): Email that caused error: " + input);
        }
    
    return isValid;
    }

/** 
 * RYAN:
 * If we can find a way to get the function caller name automatically this is ideal
 * Issue is that it is blocked in ES6 modules like were using. It's not worth it
 * to switch so if we want it we will just have to find a way to do it in this
 **/
////////////////////////////////////////////////////////////////////////
// 
// Will generate an INFO log
//
//////////////////////////////////////////////////////////////////////// 
exports.logINFO = msg =>
    {
    if(PRODUCTION)
        {
        console.log(INFO + LOG_SPACE + msg);
        }
    else 
        {
         //Get the timestamp
        var currTime = new Date().toISOString();
        console.log(currTime + LOG_SPACE + INFO + LOG_SPACE + msg);
        }
    }

////////////////////////////////////////////////////////////////////////
// 
// Will generate an INFO log
//
//////////////////////////////////////////////////////////////////////// 
exports.logWARN = (msg, errorcode) =>
    {
    if(PRODUCTION)
        {
        console.warn(WARN + LOG_SPACE + error.name[errorcode] + LOG_SPACE + msg);
        }
    else 
        {
         //Get the timestamp
        var currTime = new Date().toISOString();
        console.warn(currTime + LOG_SPACE + WARN + LOG_SPACE + error.name[errorcode] + LOG_SPACE + msg);
        }
    }

////////////////////////////////////////////////////////////////////////
// 
// Will generate an INFO log
//
//////////////////////////////////////////////////////////////////////// 
exports.logERROR = (msg, error) =>
    {
    if(PRODUCTION)
        {
        console.error(ERROR + LOG_SPACE + error + LOG_SPACE + msg);
        }
    else 
        {
         //Get the timestamp
        var currTime = new Date().toISOString();
        console.error(currTime + LOG_SPACE + ERROR + LOG_SPACE + error + LOG_SPACE + msg);
        }
    }


////////////////////////////////////////////////////////////
//
// Will generate a random 8 digit password for the user
//      not in use
//
////////////////////////////////////////////////////////////
exports.generatePassword = () => 
    {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*(){}[]?><~";
    var string_length = 8;
    var randomstring = '';

    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars[rnum];
    }

    return randomstring;
    }