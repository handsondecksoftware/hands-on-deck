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
  document.getElementById('cancelAddVolunteer').onclick = function(){toggleAddVolunteerBoxVisibility()};
  document.getElementById('saveAddVolunteer').onclick = function(){addVolunteer()};
  document.getElementById('addVolunteerButton').onclick = function(){toggleAddVolunteerBoxVisibility()};
  document.getElementById('returnToVolList').onclick = function(){toggleViewVolVisibility()};
  document.getElementById('cancelOppourtunityView').onclick = function(){toggleViewOppDetails()};  
  document.getElementById('saveOppourtunityView').onclick = function(){saveOppDetails()};

  initSlider('Volunteers');

  initLogout();
  }



////////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add oppourtuntiy box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleAddVolunteerBoxVisibility()
{
    //Open the add oppourtuntiy popup box
    var currentState = document.getElementById('addVolunteerPopup').style.display; 

    if(currentState === "none")
    {
        document.getElementById('addVolunteerPopup').style.display = "block"; 
    }
    else 
    {
        document.getElementById('addVolunteerPopup').style.display = "none"; 
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
// Will submit and handle the response to the post request
//
////////////////////////////////////////////////////////////////////////
function addVolunteer()
    {
    //Collect Form Values
    var volunteerData = {
        firstName: document.getElementById('volunteerInfo-firstName').value,
        lastName: document.getElementById('volunteerInfo-lastName').value,
        teamName: document.getElementById('volunteerInfo-teamName').value,
        email: document.getElementById('volunteerInfo-email').value,
        type: document.getElementById('volunteerInfo-type').value,
        id: null, 
        teamName: null, 
        teamID: null, 
        volHours:null, 
        volunteeringData: null,
    };

    handlePostMethod({volunteerData: volunteerData}, "/addVolunteer", response => 
        {
        if(response.success)
            {
            alert("You successfully added the volunteer");
            toggleAddVolunteerBoxVisibility();
            }
        else 
            {
            printUserErrorMessage(response.errorCode);
            }
        })
    .catch(error)
        {
        alert("Error submitting request. Please try again");
        };

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


////////////////////////////////////////////////////////////////////////
//
// Deletes the volunteer
//
////////////////////////////////////////////////////////////////////////
function deleteVolunteer(e){

    if(confirm("Are you sure you want to delete this entry?")){
        // Finds the row of the delete button clicked
        e = e || event;
        var eventEl = e.srcElement || e.target, 
        parent = eventEl.parentNode,
        isRow = function(el) {
                    return el.tagName.match(/tr/i);
                };

        // Move up the DOM until tr is reached
        while (parent = parent.parentNode) {
            if (isRow(parent)) {
                // Delete the row visually
                parent.remove()

                //TODO: Delete the volunteer from the back end

                return true;
            }
        }
    }
    return false;
}


////////////////////////////////////////////////////////////////////////
//
// Populates a specific opportunity's details from a Volunteer's list of 
// attended opportunities
//
////////////////////////////////////////////////////////////////////////
function showOpportunityDetails(e){
    e = e || event;
    var eventEl = e.srcElement || e.target, 
    parent = eventEl.parentNode,
    isRow = function(el) {
                return el.tagName.match(/tr/i);
            };

    // Move up the DOM until tr is reached
    while (parent = parent.parentNode) {
        if (isRow(parent)) {
            //TODO: Get the below data from the database
            // Get Name, Team, and Role of Volunteer from the clicked row
            var oppTitle = parent.cells.item(0).innerHTML;

            document.getElementById("opportunityTitle").innerHTML = oppTitle;
            
            // View the popup with these details
            toggleViewOppDetails();

           return true;
        }
    }
    return false;
}


////////////////////////////////////////////////////////////////////////
//
// Will display or hide opportunity details that a volunteer attended
//
////////////////////////////////////////////////////////////////////////
function toggleViewOppDetails(){
    // Switch visibility on viewing opportunity details
    var currentState = document.getElementById('viewOppourtunityDetailsPopup').style.display; 

    if(currentState == "none")
    {
        document.getElementById('viewOppourtunityDetailsPopup').style.display = "block"; 
    }
    else 
    {
        document.getElementById('viewOppourtunityDetailsPopup').style.display = "none"; 
    }

    return;
}


////////////////////////////////////////////////////////////////////////
//
// Will save the opportunity details that a volunteer attended
//
////////////////////////////////////////////////////////////////////////
function saveOppDetails(){
    // TODO: Save opportunity details to database
    
    // Now toggle visibility of pop up box
    toggleViewOppDetails();
    return;
}