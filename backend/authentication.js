////////////////////////////////////////////////////////////////////////
// authentication.js -- backend functions for authenticating users 
//                  
// Ryan Stolys, 14/09/20
//    - File Created
// Jayden Cole, 18/01/21
//    - Fixed spelling
//
//
////////////////////////////////////////////////////////////////////////
const error = require('./errorCodes');

////////////////////////////////////////////////////////////
//
// This will ensure user is authenticated before handling request.  
//
// Access Control will be expanded to include passport and auth check, for now, this will do.
// this function will be used to make sure only logged in users have access to sensitive information
//
////////////////////////////////////////////////////////////
exports.authcheck_get = (req, res, next) => 
    {
    // const header = req.headers['tokenKey'];
    const header = req.cookies.tokenKey
    if(typeof header !== 'undefined') {
        req.token = header;
        console.log(req.token)
        return next();   // if the user is logged in, proceed to the next function, as needed
        }
    else            // otherwise, redirect to sign in page and send the message below   
        res.render('pages/signIn', { message: 'Not authorized, please login' });
    }

////////////////////////////////////////////////////////////
//
// This will ensure user is authenticated before handling request.  
//
// Access Control will be expanded to include passport and auth check, for now, this will do.
// this function will be used to make sure only logged in users have access to sensitive information
//
////////////////////////////////////////////////////////////
exports.authcheck = (req, res, next) => 
    {
    // console.log(req)
    // if (req.isAuthenticated() || req.body.isMobile) 
    //     {
        return next();   // if the user is logged in, proceed to the next function, as needed
        // }
    // else            // otherwise, redirect to sign in page and send the message below   
    //     {
    //     if(req.body.isMobile)
    //         res.send({success: false, errorcode: error.NOT_AUTHENTICATED});
    //     else 
    //         res.render('pages/signIn', { message: 'Not authorized, please login' });
    //     }
    }

