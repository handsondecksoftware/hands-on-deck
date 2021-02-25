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
// Will initialize page buttons and load volunteers
//
//////////////////////////////////////////////////////////////////////// 
function init()
    {
    //Setup open and close of popup box
    //document.getElementById('cancelAddVolunteer').onclick = function(){toggleAddVolunteerBoxVisibility()};
    //document.getElementById('saveAddVolunteer').onclick = function(){addVolunteer()};
    document.getElementById('addVolunteerButton').onclick = function(){toggleAddVolunteerBoxVisibility()};
    document.getElementById('returnToVolList').onclick = function(){toggleViewVolunteerVisibility()};
    document.getElementById('cancelOppourtunityView').onclick = function(){toggleViewOppDetails()};  
    document.getElementById('saveOppourtunityView').onclick = function(){saveOppDetails()};

    initSlider('Volunteers');

    initLogout();

    loadVolunteers();
    }


////////////////////////////////////////////////////////////////////////
// 
// Will initialize 
//
//////////////////////////////////////////////////////////////////////// 
function loadVolunteers()
    {
    try 
        {
        setLoaderVisibility(true);

        handleAPIcall({vol_ID: -1}, "/api/getVolunteerInfo", response => 
            {
            if(response.success)
                {
                //Get reference to table 
                var volunteerTable = document.getElementById('volunteersTable');
                var rowNum = 1;
    
                //Fill in table elements
                for(var volNum = 0; volNum < response.volunteerInfo.length; volNum++)
                    {
                    //Create new row
                    var row = volunteerTable.insertRow(rowNum++);
    
                    //Create row elements 
                    var name = row.insertCell(0);
                    var email = row.insertCell(1);
                    var team = row.insertCell(2);
                    var volunteerHrs = row.insertCell(3);
                    var view = row.insertCell(4);
                    var remove = row.insertCell(5);
                    
                    //Fill in row elements
                    name.innerHTML = response.volunteerInfo[volNum].name;
                    email.innerHTML = response.volunteerInfo[volNum].email;
                    team.innerHTML = response.volunteerInfo[volNum].teamname;
                    volunteerHrs.innerHTML = response.volunteerInfo[volNum].numhours;
    
                    view.innerHTML = "<i id=\"view_" + response.volunteerInfo[volNum].id + "\" class=\"fas fa-eye table-view\" onclick=\"viewVolunteer(this.id)\"></i>";
                    remove.innerHTML = "<i id=\"delete_" + response.volunteerInfo[volNum].id + "\"class=\"fas fa-trash table-view\" onclick=\"deleteVolunteer(this.id)\"></i>";
                    }
                }
            else 
                {
                printUserErrorMessage(response.errorcode);
                }

            setLoaderVisibility(false);
            });
        }
    catch (error)
        {
        alert("Oops. We ran into an issue loading the page. Please try again");
        setLoaderVisibility(false);
        };
    }

////////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add oppourtuntiy box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleAddVolunteerBoxVisibility()
    {
    alert("Volunteers can only be created through the app interface for now.");
    return;
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
function toggleViewVolunteerVisibility()
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

    handleAPIcall({volunteerData: volunteerData}, "/addVolunteer", response => 
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
function viewVolunteer(buttonID)
    {
    //Get the volunteer ID
    var vol_ID = buttonID.slice(5);      //Remove "view_"

    //alert("vol_ID is: " + vol_ID);

    try
        {
        // Show the new page while the user waits for the content to load
        toggleViewVolunteerVisibility();

        setLoaderVisibility(true);
        handleAPIcall({vol_ID: vol_ID}, "/api/getVolunteerData", response => 
            {
            if(response.success)
                {
                document.getElementById("volName").innerHTML = response.volunteerData.name;
                document.getElementById("volTeam").innerHTML = response.volunteerData.teamname;

                //Get reference to table 
                var volunteerHistoryTable = document.getElementById('volunteerHistoryTable');
                var rowNum = 1;
    
                var volunteeringData = response.volunteerData.volunteeringdata;

                //Fill in table elements
                for(var vData = 0; vData < volunteeringData.length; vData++)
                    {
                    //Create new row
                    var row = volunteerHistoryTable.insertRow(rowNum++);
    
                    //Create row elements 
                    var title = row.insertCell(0);
                    var type = row.insertCell(1);
                    var duration = row.insertCell(2);
                    var date = row.insertCell(3);
                    var time = row.insertCell(4);
                    var view = row.insertCell(5);
                    
                    //Fill in row elements
                    title.innerHTML = volunteeringData.title;
                    type.innerHTML = volunteeringData.type;
                    duration.innerHTML = "TBD"; //volunteeringData.name;
                    date.innerHTML = "TBD"; //volunteeringData.name;
                    time.innerHTML = "TBD"; //volunteeringData.name;
                    
                    view.innerHTML = "<i id=\"view_" + volunteeringData.id + "\"class=\"fas fa-trash table-view\" onclick=\"deleteVolunteer(this.id)\"></i>";
                    }
                }
            else 
                {
                printUserErrorMessage(response.errorcode);
                }
    
            setLoaderVisibility(false);
            });
        }
    catch(error)
        {
        alert("Oops, looks like something went wrong while loading the volunteer information. Try again");
        setLoaderVisibility(false);
        }
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
function saveOppDetails() 
    {
    // TODO: Save opportunity details to database
    
    // Now toggle visibility of pop up box
    toggleViewOppDetails();
    return;
    }


/*
Could be useful code for the search functionality
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

*/