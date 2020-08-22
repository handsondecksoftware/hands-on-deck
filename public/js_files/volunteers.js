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


////////////////////////////////////////////////////////////////////////
//
// Will display or hide a specific volunteers volunteering history
//
////////////////////////////////////////////////////////////////////////
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


////////////////////////////////////////////////////////////////////////
//
// Populates a specific volunteer's name and team from the full Volunteers
// list to the individual's volunteering page
//
////////////////////////////////////////////////////////////////////////
function showVolunteer(e){
    e = e || event;
    var eventEl = e.srcElement || e.target, 
    parent = eventEl.parentNode,
    isRow = function(el) {
                return el.tagName.match(/tr/i);
            };

    // Move up the DOM until tr is reached
    while (parent = parent.parentNode) {
        if (isRow(parent)) {
            // Get Name, Team, and Role of Volunteer from the clicked row
            var volName = parent.cells.item(0).innerHTML;
            var volTeam = parent.cells.item(2).innerHTML;

            document.getElementById("volName").innerHTML = volName;
            document.getElementById("volTeam").innerHTML = volTeam;

            //TODO: Get volunteer "role" and populate table with instances where this individual volunteered

            // Flip page visibility
            toggleViewVolVisibility()

           return true;
        }
    }
    return false;
}