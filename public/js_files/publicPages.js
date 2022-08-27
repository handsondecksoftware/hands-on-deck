////////////////////////////////////////////////////////////////////////
// publicPages.js -- scripts for public pages
//                  
//
// Ryan Stolys, 31/09/21
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////

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
// Loading Pages
//////////////////////////////////////////////////////////////////////// 
function landingLoad()
    {
    getRef("goToSignIn").onclick = function() {window.location.href="signIn"};
    getRef("contactUs").onclick = function() {showContactInfo()}
    }



////////////////////////////////////////////////////////////////////////
//
// Will show alert with contact information for user
//
//////////////////////////////////////////////////////////////////////// 
function showContactInfo()
    {
    var contactMsg = "To contact us about pricing and setting up and account. Please send an email to Ryan - ryanstolys@gmail.com";

    alert(contactMsg);
    }