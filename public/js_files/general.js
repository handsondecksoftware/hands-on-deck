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

//Time Constants
const MS_IN_MIN = 60000;
const HOUR_IN_MIN = 1/60;


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
// Will get a document reference to an object
//
//////////////////////////////////////////////////////////////////////// 
function getRef(id)
    {
    return document.getElementById(id);
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
function handleAPIcall(dataInJSON, postName, callbackFunction)
    {
    //Specify default values 
    var headerName = 'Content-Type';
    var headerValue = 'application/json';

    //Convert JSON to string
    var data;
    if(dataInJSON == null)
        {
        dataInJSON = {isMobile: false};
        }
    else 
        {
        dataInJSON["isMobile"] = false;
        }
    
    data = JSON.stringify(dataInJSON);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", postName, true);
    xhr.setRequestHeader(headerName, headerValue);
    xhr.setRequestHeader("Authorization", "Bearer " + getCookie("access_token"));
    xhr.onreadystatechange = function()
        {
        if(xhr.readyState == XMLHttpRequest.DONE) 
            {
            var response;
            try {response = JSON.parse(xhr.responseText);}
            catch (error) 
                {
                console.log(error.message);
                response = {success: false};
                }
             
            //Return response to callback function
            callbackFunction(response);
            }
        }

    xhr.send(data);

    return;
    }
    

var loaderQueue = [];
//////////////////////////////////////////////////////////////////
//
// Will hide and show the loader element 
//
//////////////////////////////////////////////////////////////////
function setLoaderVisibility(setOn) 
    {
    const loaderID = "loader";
    var loader = getRef(loaderID);

    if(setOn)
        {
        loaderQueue.push(true);
        loader.style.display = "block";
        }
    else 
        {
        loaderQueue.pop();

        //If the array is empty
        if(!Array.isArray(loaderQueue) || !loaderQueue.length)
            {
            loader.style.display = "none";
            }
        }
    
    return;
    }
    

//////////////////////////////////////////////////////////////////
//
// Get the current date in YYYY-MM-DDThh:mm:ss.sss format for current timezone
//
//////////////////////////////////////////////////////////////////
function getCurrentDateISO()
    {
    var currentDateInMs = new Date().getTime();
    var timezoneOffsetInMs = new Date().getTimezoneOffset() * MS_IN_MIN;
    return new Date(currentDateInMs - timezoneOffsetInMs).toISOString().slice(0,-1);        //Remove timezone indictor. We adjust for timezone ourselves
    }


//////////////////////////////////////////////////////////////////
//
// Convert date to postgres timestamp format
//
//////////////////////////////////////////////////////////////////
function convertDateToTimestamp(dayOfYearISO, hours, minutes)
    {
    return dayOfYearISO + " " + hours + ":" + minutes + ":00";      //Convert to format YYYY-MM-DD hh:mm:ss
    }


//////////////////////////////////////////////////////////////////
//
// Convert date to ISO format
//  Accepts all parameters except seconds and milliseconds
//
//////////////////////////////////////////////////////////////////
function convertDateToISO2(year, month, day, hours, minutes)
    {
    var timezoneOffsetInHours = new Date().getTimezoneOffset() * HOUR_IN_MIN;
    //january starts at month 0
    return new Date(year, month - 1, day, hours - timezoneOffsetInHours, minutes, 0, 0).toISOString();      //Convert to format YYYY-MM-DDThh:mm:ss.sss
    }

    
//////////////////////////////////////////////////////////////////
//
// get human readable date DOW MMM DD YYYY
//
//////////////////////////////////////////////////////////////////
function getCurrentDayOfYear()
    {
    //january starts at month 0
    return new Date().toString().slice(0, 15);      //Convert to format DOW MMM DD YYYY
    }


//////////////////////////////////////////////////////////////////
//
// get human readable date in format DOW MMM DD YYYY 
//      incoming format YYYY-MM-DD HH:MM:SS
//
//////////////////////////////////////////////////////////////////
function getUTCFormatFromTimestamp(date)
    {
    //january starts at month 0
    return date.slice(0, 10);      //Convert to format YYYY-MM-DD
    }


//////////////////////////////////////////////////////////////////
//
// get human readable date in format DOW MMM DD YYYY 
//      incoming format YYYY-MM-DD HH:MM:SS
//
//////////////////////////////////////////////////////////////////
function getDayOfYearFromTimestamp(date)
    {
    var target = new Date(date.slice(0,10));
    var machineDate = target.getTime() + (new Date().getTimezoneOffset())*MS_IN_MIN;
    return new Date(machineDate).toString().slice(0, 15);
    }


//////////////////////////////////////////////////////////////////
//
// get human readable time from postgres timestamp format
//      format YYYY-MM-DD HH:MM:SS
//
//////////////////////////////////////////////////////////////////
function getTimeFromTimestamp(date)
    {
    var hrs = Number(date.slice(11, 13));
    var min = date.slice(14, 16);
    var time = "";

    if(hrs > 12)
        time = (hrs - 12) + ":" + min + "pm";
    else if(hrs == 12)
        time = hrs + ":" + min + "pm";
    else 
        time = hrs + ":" + min + "am";
        
    return time;
    }


//////////////////////////////////////////////////////////////////
//
// get hours from postgres timestamp
//
//////////////////////////////////////////////////////////////////
function getHoursFromTimestamp(date)
    {
    return Number(date.slice(11, 13));
    }


//////////////////////////////////////////////////////////////////
//
// get minutes from ISO date
//
//////////////////////////////////////////////////////////////////
function getMinutesFromTimestamp(date)
    {
    //january starts at month 0
    return Number(date.slice(14, 16));
    }


//////////////////////////////////////////////////////////////////
//
// will get the cookie value specified in the type input value
//
//////////////////////////////////////////////////////////////////
function getCookie(type)
    {   
    var rc = "";
    var cookieContents = document.cookie;
    var searchFor = type +"=";

    //Find start index
    var start = cookieContents.indexOf(searchFor);

    //slice string so now it starts at desired location
    cookieContents = cookieContents.slice(start + searchFor.length);

    //find end of information for cookie info type
    var end = cookieContents.indexOf(";");

    if(end == -1)
        rc = cookieContents
    else 
        rc = cookieContents.slice(0, end);

    return rc;
    }


//////////////////////////////////////////////////////////////////
//
//  All functions below will generate one of the standard data
//       objects for api calls
//
//////////////////////////////////////////////////////////////////
function gen_iInfo()
    {
    return {
        id: null, 
        name: null,
        location: null,
        numVolunteers: null,
        totalHours: null,
        };
    }


function gen_vInfo()
    {
    return {
        id: null, 
        name: null,
        email: null,
        leaderboards: null,
        teamname: null,
        team_id: null,
        numhours: null,
        };
    }


function gen_vData()
    {
    return {
        id: null, 
        name: null,
        email: null,
        leaderboards: null,
        teamname: null,
        team_id: null,
        numhours: null,
        volunteeringdata: null,
        };
    }


function gen_oppInfo()
    {
    return {
        id: null, 
        sequencenum: null,
        title: null,
        type: null,
        starttime: null,
        endtime: null,
        numvolunteers: null,
        };
    }


function gen_oppData()
    {
    return {
        id: null, 
        sequencenum: null,
        title: null,
        type: null,
        starttime: null,
        endtime: null,
        location: null, 
        description: null, 
        viewableby: null, 
        volunteerlimit: null, 
        coordinatorname: null, 
        coordinatoremail: null, 
        coordinatorphone: null, 
        numvolunteers: null,
        volunteers: null,
        };
    }


function gen_tInfo()
    {
    return {
        id: null, 
        name: null,
        sex: null,
        numvolunteers: null,
        numhours: null,
        };
    }


function gen_tData()
    {
    return {
        id: null, 
        name: null,
        sex: null,
        numvolunteers: null,
        numhours: null,
        leaderboard, 
        volunteers,
        };
    }