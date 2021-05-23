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
const util = require('./utils');
const database = require('./databaseSetup');


////////////////////////////////////////////////////////////
//
// This will ensure user is authenticated before handling request.  
//
////////////////////////////////////////////////////////////
exports.authcheck = async (req, res, next) => 
    {
    try 
        {
        //Extract token -- split removes 'Bearer ' from header
        const token = req.headers.authorization.split(" ")[1];

        if(typeof token !== 'undefined' && (await tokenNotExpired(token)))
            {
            //Verify the jwt
            jwt.verify(token, process.env.SECRETKEY, (err, authorizedData) => 
                {
                if(err) 
                    {
                    util.logERROR("authcheck(): " + err.message, err.code);

                    if(req.body.isMobile)
                        res.send({success: false, errorcode: error.NOT_AUTHENTICATED});
                    else 
                        res.render('pages/signIn', { message: 'Not authorized, please login' });
                    } 
                else 
                    { 
                    req["user"] = authorizedData.user;      //Set the user information for the api to use
                    return next();                          // if the user is logged in, proceed to the next function, as needed
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
    catch (error)
        {
        util.logERROR("authcheck(): " + err.message, err.code);
        res.send({success: false, errorcode: error.NOT_AUTHENTICATED});
        }
    }



////////////////////////////////////////////////////////////
//
// This will ensure user is authenticated before handling request.  
//
////////////////////////////////////////////////////////////
exports.authcheck_get = async (req, res, next) => 
    {
    try
        {
        //Extract token -- No need to remove Bearer since it is not in cookie
        const token = req.cookies.access_token;      //
        if(typeof token !== 'undefined' && (await tokenNotExpired(token)))
            {
            //Verify the jwt
            jwt.verify(token, process.env.SECRETKEY, (err, authorizedData) => 
                {
                if(err) 
                    {
                    util.logERROR("authcheck_get(): " + err.message, err.code);

                    if(req.body.isMobile)
                        res.send({success: false, errorcode: error.NOT_AUTHENTICATED});
                    else 
                        res.render('pages/signIn', { message: 'Not authorized, please login' });
                    } 
                else 
                    { 
                    req["user"] = authorizedData.user;      //Set the user information for the api to use
                    return next();                          // if the user is logged in, proceed to the next function, as needed
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
    catch (error)
        {
        util.logERROR("authcheck_get(): " + err.message, err.code);
        res.send({success: false, errorcode: error.NOT_AUTHENTICATED});
        }
    }


////////////////////////////////////////////////////////////
//
// Checks the expire_table to see if token has expired
//      expired tokens are listed there
//
////////////////////////////////////////////////////////////
async function tokenNotExpired(token)
    {
    var notExpired = false;

    await database.queryDB("SELECT * FROM expire_table WHERE token= $1;", [token], (result, err) => 
        {
        if (err) 
            {
            util.logERROR("tokenNotExpired(): " + err.message, err.code);
            util.logINFO("tokenNotExpired(): Database error - Assuming invalid token");
            notExpired = false;
            }
        else 
            {
            //If there is no token matching the one we are looking for
            if(result.rows[0] == null) 
                {
                notExpired = true;
                }
            else 
                {
                notExpired = false;
                }
            }
        });

    return notExpired;
    }


////////////////////////////////////////////////////////////
//
// Checks the expire_table to see if token has expired
//      expired tokens are listed there
//
// Using method from: https://stackoverflow.com/questions/26046816/is-there-a-way-to-set-an-expiry-time-after-which-a-data-entry-is-automaticall  
//
////////////////////////////////////////////////////////////
exports.makeTokenInvalid = async (req, res, next) =>
    {
    try 
        {
        //get token to make invalid
        const token = req.headers.authorization.split(" ")[1];

        //Get the token info
        var decodedToken = jwt.decode(token);

        await database.queryDB("INSERT INTO expire_table VALUES ($1, $2);", [token, decodedToken.exp], (result, err) => 
            {
            if (err) 
                {
                util.logERROR("makeTokenInvalid(): " + err.message, err.code);
                util.logINFO("makeTokenInvalid(): Database error - Token remains valid. Decoded Token: " + decodedToken);
                }
            else 
                {
                util.logINFO("makeTokenInvalid(): Token successfully added to epire_table");
                }
            });
        }
    catch (error)
        {
        util.logERROR("makeTokenInvalid(): " + err.message, err.code);
        util.logINFO("makeTokenInvalid(): Taking no action. Decoded token: " + decodedToken);
        }

    return next();
    }