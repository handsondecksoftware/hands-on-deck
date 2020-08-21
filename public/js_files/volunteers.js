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
  document.getElementById('cancelVolunteerOppourtunityChoice').onclick = function(){toggleVolOppourtunityBoxVisibility()};
  document.getElementById('saveVolunteerOppourtunityChoice').onclick = function(){saveVolunteerOppourtunity()};
  document.getElementById('addVolunteerButton').onclick = function(){toggleVolOppourtunityBoxVisibility()};
  document.getElementById('viewVolunteerButton').onclick = function(){toggleViewVolVisibility()};
  document.getElementById('returnToVolList').onclick = function(){toggleViewVolVisibility()};

  initSlider('Volunteers');

  initLogout();
  }



////////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add oppourtuntiy box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleVolOppourtunityBoxVisibility()
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


function toggleViewVolVisibility()
{
    // Turn on/off a specific volunteers' hours page
    var currentState = document.getElementById('viewVolunteerPage').style.display;
    
    if(currentState === "none")
    {
        document.getElementById('volunteerMainPage').style.display = "none";
        document.getElementById('viewVolunteerPage').style.display = "block";
    }
    else
    {
        document.getElementById('viewVolunteerPage').style.display = "none";
        document.getElementById('volunteerMainPage').style.display = "block";
    }

    return;
}
