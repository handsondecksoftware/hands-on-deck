////////////////////////////////////////////////////////////////////////
// general.js -- general frontend behaviour functions for use by any page
//                  
//
// Ryan Stolys, 04/08/20
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////


//Error code constants
const NOERROR = 0;
const DATABASE_ACCESS_ERROR = 1;
const SERVER_ERROR = 2;
const PERMISSION_ERROR = 3;

const INVALID_INPUT_ERROR = 10; 

const UNKNOWN_ERROR = 99; 


////////////////////////////////////////////////////////////////////////
// 
// Will print  an error message based on the code provided
//
//////////////////////////////////////////////////////////////////////// 
function printUserErrorMessage(errorCode)
    {
    switch(errorCode)
        {
        case DATABASE_ACCESS_ERROR:
        case SERVER_ERROR:
            {
            alert("A server error occured. Please try again");
            break;
            }
        case PERMISSION_ERROR:
            {
            alert("You do not have the proper permissions");
            break;
            }
        case INVALID_INPUT_ERROR:
            {
            alert("One of your inputs was in an invalid format");
            break;
            }
        case UNKNOWN_ERROR:
        default:
            {
            alert("An Unknown Error Occurred. Please Try Again");
            }
        }

    return;
    }


////////////////////////////////////////////////////////////////////////
// 
// Will create an array from 1 to n where n is specifed in the input
//
//////////////////////////////////////////////////////////////////////// 
function newArrayFrom1toN(n)
  {
  var newArray = [];

  for(var i = 0; i <= n; i++)
    {
    newArray.push(i);
    }

  return newArray;
  }


////////////////////////////////////////////////////////////////////////
// 
// Will create and send a post request then return the data in JSON format
//
// dataInJSON --  must be in JSON format with all relevant information 
//                for function call
//
// postName -- will be the identifier that will specify which express 
//              app handler will recieved the function call
//
// callbackFunction -- will be a function which will handle the response 
//                      from the post request 
//
//////////////////////////////////////////////////////////////////////// 
function handlePostMethod(dataInJSON, postName, callbackFunction)
    {
    //Specify default values 
    var headerName = 'Content-Type';
    var headerValue = 'application/json';

    //Convert JSON to string
    var data;
    if(dataInJSON == null)
        {
        data = null;
        }
    else 
        {
        data = JSON.stringify(dataInJSON);
        }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", postName, true);
    xhr.setRequestHeader(headerName, headerValue);
    xhr.onreadystatechange = function()
        {
        if(xhr.readyState == XMLHttpRequest.DONE) 
            {
            callbackFunction(JSON.parse(xhr.responseText));
            }
        }

    xhr.send(data);

    return;
    }