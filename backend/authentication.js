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
const jwt = require('jsonwebtoken');
const SECRETKEY = "secretkey";      //Should probably revise this


////////////////////////////////////////////////////////////
//
// This will ensure user is authenticated before handling request.  
//
////////////////////////////////////////////////////////////
exports.authcheck = (req, res, next) => 
    {
    //Extract token -- will this work for app or do we need to check somewhere else
    const token = req.cookies.tokenKey
    if(typeof token !== 'undefined')
        {
        //Verify the jwt
        jwt.verify(token, SECRETKEY, (err, authorizedData) => 
            {
            //console.log(authorizedData)
            if(err) 
                {
                console.log(err.message);

                if(req.body.isMobile)
                    res.send({success: false, errorcode: error.NOT_AUTHENTICATED});
                else 
                    res.render('pages/signIn', { message: 'Not authorized, please login' });
                } 
            else 
                { 
                req["user"] = authorizedData.payloadData;   //Set the user information for the api to use
                return next();                              // if the user is logged in, proceed to the next function, as needed
                }
            });
        }
    else 
        {
        if(req.body.isMobile)
            res.send({success: false, errorcode: error.NOT_AUTHENTICATED});
        else 
            res.render('pages/signIn', { message: 'Not authorized, please login' });
        }
    }

