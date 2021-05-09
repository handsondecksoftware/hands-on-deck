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
const error = require('./errorcodes');
const jwt = require('jsonwebtoken');
const database = require('./databaseSetup');
const SECRETKEY = "it'sALL____ON____";


////////////////////////////////////////////////////////////
//
// This will ensure user is authenticated before handling request.  
//
////////////////////////////////////////////////////////////
exports.authcheck = async (req, res, next) => 
    {
    try 
        {
        //util.logINFO("authcheck(): called");
        //Extract token
        const token = req.headers.authorization.split(" ")[1];      //split removes 'Bearer ' from header
        if(typeof token !== 'undefined' && (await tokenNotExpired(token)))
            {
            //Verify the jwt
            jwt.verify(token, SECRETKEY, (err, authorizedData) => 
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
        //util.logINFO("authcheck_get(): called");
        //Extract token
        const token = req.cookies.access_token;      //No need to remove Bearer since it is not in cookie
        if(typeof token !== 'undefined' && (await tokenNotExpired(token)))
            {
            //Verify the jwt
            jwt.verify(token, SECRETKEY, (err, authorizedData) => 
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

    //util.logINFO("tokenNotExpired(): seraching for: " + token);
    //Query database for token in expired table
    await database.queryDB("SELECT * FROM expire_table WHERE token='" + token + "';", (result, err) => 
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
                //util.logINFO("tokenNotExpired(): Token not found in expire_table");
                notExpired = true;
                }
            else 
                {
                //util.logINFO("tokenNotExpired(): Token found in expire_table. Is currently invalid");
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

        //Query database for token in expired table
        await database.queryDB("INSERT INTO expire_table VALUES ('" + token + "', '" + decodedToken.exp + "');", (result, err) => 
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