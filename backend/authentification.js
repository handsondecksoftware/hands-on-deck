////////////////////////////////////////////////////////////////////////
// authentification.js -- backend functions for authentificating users 
//                  
// Ryan Stolys, 14/09/20
//    - File Created
//
////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
//
// This will ensure user is authtificated before handling request.  
//
// Access Control will be exapanded to include passport and auth check, for now, this will do.
// this function will be used to make sure only logged in users have access to sensitive information
//
////////////////////////////////////////////////////////////
exports.authcheck = (req, res, next) => {
  // if (req.isAuthenticated()) {
  if (req.isAuthenticated()) {
      // if the user is logged in, proceed to the next function, as needed
      return next();
  }
  // otherwise, redirect to sign in page and send the message below
  else {
      res.render('pages/signIn', { message: 'Not authorized, please login' });
  }
}




