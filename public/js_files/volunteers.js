////////////////////////////////////////////////////////////////////////
// volunteers.js -- frontend behaviour for volunteer page
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
function init()
  {
  //Setup open and close of popup box
  // DOM element to open volunteer oppourtunity -- will have to be view buttons in table
  document.getElementById('cancelVolunteerOppourtunityChoice').onclick = function(){toggleVolOppourtuntiyBoxVisibility()};
  document.getElementById('saveVolunteerOppourtunityChoice').onclick = function(){saveVolunteerOppourtunity()};
  
  initSlider('Volunteers');

  initLogout();
  }



////////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add oppourtuntiy box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleVolOppourtuntiyBoxVisibility()
  {
  //Open the add oppourtuntiy popup box
  var currentState = document.getElementById('volunteerOppourtunityPopup').style.display; 

  if(currentState === "none")
    {
    document.getElementById('volunteerOppourtunityPopup').style.display = "block"; 
    }
  else 
    {
    document.getElementById('volunteerOppourtunityPopup').style.display = "none"; 
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
function toggleVolOppourtuntiyBoxVisibility()
  {
  toggleOppourtuntiyBoxVisibility();
  }