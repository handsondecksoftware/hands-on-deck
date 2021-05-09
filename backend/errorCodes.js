////////////////////////////////////////////////////////////////////////
// errorCodes.js -- exported module containing error codes across server
//                  
// Ryan Stolys, 07/10/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////


module.exports =  
{
    NOT_SUPPORTED:             -1,
    NOERROR:                    0,
    DATABASE_ACCESS_ERROR:      1,
    SERVER_ERROR:               2,
    PERMISSION_ERROR:           3,


    INVALID_INPUT_ERROR:        10, 

    NOT_AUTHENTICATED:          50, 


    UNKNOWN_ERROR:              99, 

    name: {
       "-1": "NOT_SUPPORTED",
        "0": "NOERROR",
        "1": "DATABASE_ACCESS_ERROR",
        "2": "SERVER_ERROR",
        "3": "PERMISSION_ERROR",


        "10": "INVALID_INPUT_ERROR",

        "50": "NOT_AUTHENTICATED",


        "99": "UNKNOWN_ERROR",
    }
} 
