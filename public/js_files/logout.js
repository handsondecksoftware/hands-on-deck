////////////////////////////////////////////////////////////////////////
// logout.js -- frontend behaviour when user tries to logout
//                  
//
// Ryan Stolys, 18/07/20
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// 
// Will initialize 
//
//////////////////////////////////////////////////////////////////////// 
function initLogout()
  {
  //Setup open and close of popup box
  document.getElementById('logoutButton').onclick = function(){toggleLogoutUserBox()};
  document.getElementById('cancelLogoutChoice').onclick = function(){toggleLogoutUserBox()};
  document.getElementById('yesLogoutChoice').onclick = function(){logoutUser()};

  }



////////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add oppourtuntiy box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleLogoutUserBox()
  {
  //Open the add oppourtuntiy popup box
  var currentState = document.getElementById('logoutPopup').style.display; 

  if(currentState === "none")
    {
    document.getElementById('logoutPopup').style.display = "block"; 
    }
  else 
    {
    document.getElementById('logoutPopup').style.display = "none"; 
    }

  return;
  }


////////////////////////////////////////////////////////////////////////
// 
// Will check inputs and add oppourtuntiy if valid, or provide errors if not
//
// currently does nothing, just closes  the oppourtunity box
//
////////////////////////////////////////////////////////////////////////
function logoutUser()
  {
  toggleLogoutUserBox();

  //Do stuff here to logout user officially

  //Move to signin page
  window.location.href = '/logout';
  }