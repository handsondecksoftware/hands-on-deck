////////////////////////////////////////////////////////////////////////
// teams.js -- frontend behaviour for teams page
//                  
//
// Ryan Stolys, 18/07/20
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// Global Variables
//////////////////////////////////////////////////////////////////////// 
currentTeam_gv = -1;

////////////////////////////////////////////////////////////////////////
// 
// Will initialize 
//
//////////////////////////////////////////////////////////////////////// 
function init()
    {
    loadTeams();

    //Setup search
    initSearch('searchTeams', 'teamsTable', 2);

    //Setup open and close of add team popup box
    getRef('addTeamButton').onclick = function(){toggleTeamBoxVisibility()};
    getRef('cancelTeamChoice').onclick = function(){toggleTeamBoxVisibility()};
    getRef('addTeamChoice').onclick = function(){addTeam()};

    getRef('returnToAllTeams').onclick = function(){showAllTeams()};
    getRef('editTeam').onclick = function(){editTeam()};

    initSlider('Teams');
    initDropdowns('Teams');

    initLogout();
    }


///////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add team box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function loadTeams()
    {
    try 
        {
        setLoaderVisibility(true);

        handleAPIcall({teamID: -1}, "/api/getTeamInfo", response => 
            {
            if(response.success)
                {
                //Get reference to table 
                var teamTable = getRef('teamsTable');
                var rowNum = 1;

                //Empty the opportunity table first in case there are elements in it 
                for(var i = teamTable.rows.length - 1; i >= 1; i--) { teamTable.deleteRow(i); }
    
                //Fill in table elements
                for(var teamNum = 0; teamNum < response.teamInfo.length; teamNum++)
                    {
                    //Create new row
                    var row = teamTable.insertRow(rowNum++);
    
                    //Create row elements 
                    var teamName = row.insertCell(0);
                    var sex = row.insertCell(1);
                    var numVolunteers = row.insertCell(2);
                    var volunteerHrs = row.insertCell(3);
                    var view = row.insertCell(4);
                    var remove = row.insertCell(5);
                    
                    //Fill in row elements
                    teamName.innerHTML = response.teamInfo[teamNum].name;
                    sex.innerHTML = response.teamInfo[teamNum].sex;
                    numVolunteers.innerHTML = response.teamInfo[teamNum].numvolunteers ?? 0;
                    volunteerHrs.innerHTML = response.teamInfo[teamNum].numhours ?? 0;
    
                    view.innerHTML = "<i id=\"view_" + response.teamInfo[teamNum].id + "\" class=\"fas fa-eye table-view\" onclick=\"viewTeam(this.id)\"></i>";
                    remove.innerHTML = "<i id=\"delete_" + response.teamInfo[teamNum].id + "\"class=\"fas fa-trash table-view\" onclick=\"deleteTeam(this.id)\"></i>";
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


///////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add team box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleTeamBoxVisibility()
    {
    //Open the add oppourtuntiy popup box
    var currentState = getRef('addTeamPopup').style.display; 

    if(currentState === "none")
        {
        getRef('addTeamPopup').style.display = "block"; 
        }
    else 
        {
        getRef('addTeamPopup').style.display = "none"; 
        }
    }


////////////////////////////////////////////////////////////////////////
// 
// Will check inputs and add oppourtuntiy if valid, or provide errors if not
//
// currently does nothing, just closes  the oppourtunity box
//
////////////////////////////////////////////////////////////////////////
function addTeam()
  {
    //Collect Form Values
    var teamData = {
        name: getRef('addTeam-name').value,
        leaderboard: getRef('includeLeaderboards').value == 0,
        sex: getRef('teamSex').value == 0 ? "M" : "W",
    };

    handleAPIcall({teamData: teamData}, "/api/addTeam", response => 
        {
        if(response.success)
            {
            alert("You successfully added the team");
            toggleTeamBoxVisibility();
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
// This function will take a user from viewing a specific team to all teams
// from the institution
//
////////////////////////////////////////////////////////////////////////
function showAllTeams()
    {
    getRef("teamMainPage").style.display = "block";
    getRef("viewTeamPage").style.display = "none";

    loadTeams();

    currentTeam_gv = -1;
    }


///////////////////////////////////////////////////////////////////////
// 
// Deletes the team row from the html, as well as all the volunteers in
// the team in the database
//
////////////////////////////////////////////////////////////////////////
function deleteTeam(buttonID)
    {
    if(confirm("Are you sure you want to delete this team?"))
        {
        var teamID = buttonID.slice(7);      //Remove "delete_"

        handleAPIcall({teamID: teamID}, "/api/deleteTeam", response => 
            {
            if(response.success)
                {
                alert("You successfully deleted the team");
                location.reload();
                }
            else 
                {
                printUserErrorMessage(response.errorCode);
                }
            })
        .catch(error)
            {
            alert("Something unexpected happened. Please try again");
            };
        }
    }


///////////////////////////////////////////////////////////////////////
// 
// View a specific team
//
////////////////////////////////////////////////////////////////////////
function viewTeam(buttonID)
    {
    //Get the volunteer ID
    var teamID = buttonID.slice(5);      //Remove "view_"
    currentTeam_gv = teamID;

    try
        {
        setLoaderVisibility(true);
        handleAPIcall({teamID: teamID}, "/api/getTeamData", response => 
            {
            if(response.success)
                {
                getRef("viewTeamPage").style.display = "block";
                getRef("teamMainPage").style.display = "none";
                getRef('editTeam').innerHTML == "Edit"

                //Load team specific data 
                getRef("viewTeam-name").value = response.teamData.name;
                getRef("dropdown-title-viewTeamSex").innerHTML = response.teamData.sex;
                getRef("dropdown-title-viewTeamLeaderboards").innerHTML = response.teamData.leaderboard ? "Yes" : "No";

                //Stop team data from being modified
                getRef('viewTeam-name').readOnly = false;
                getRef('viewTeamSex').onclick = function(){return};
                getRef('viewTeamLeaderboards').onclick = function(){return};
                    
                //Get reference to table 
                var teamMemTable = getRef('teamMembersTable');
                var rowNum = 1;
                var teamMemberData = response.teamData.volunteers;

                //Clear the team members table to ensure it is not full
                var rowCount = teamMemTable.rows.length;
                for (var i = rowCount - 1; i >= 1; i--) 
                    {
                    teamMemTable.deleteRow(i);
                    }

                //Load the team members
                for(var teamMem = 0; teamMem < response.teamData.volunteers.length; teamMem++)
                    {
                    //Create new row
                    var row = teamMemTable.insertRow(rowNum++);
    
                    //Create row elements 
                    var name = row.insertCell(0);
                    var email = row.insertCell(1);
                    var teams = row.insertCell(2);
                    var volunteerhours = row.insertCell(3);
                    
                    //Fill in row elements
                    name.innerHTML = teamMemberData[teamMem].name;
                    email.innerHTML = teamMemberData[teamMem].email;
                    teams.innerHTML = teamMemberData[teamMem].teamname;
                    volunteerhours.innerHTML = teamMemberData[teamMem].numhours;                    
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
        alert("Oops, looks like something went wrong while loading the team information. Try again");
        setLoaderVisibility(false);
        }
    }


////////////////////////////////////////////////////////////////////////
//
// Will allow for the team information to be modified
//
////////////////////////////////////////////////////////////////////////
function editTeam()
    {
    if(getRef('editTeam').innerHTML == "Save")
        {
        //Show we are doing something, call function to save opportunity
        getRef('editTeam').innerHTML = "Saving...";
        saveEditTeam();
        }
    else 
        {
        //Change button display
        getRef('editTeam').innerHTML = "Save"; 

        //Allow all the fields to be updated
        getRef('viewTeam-name').readOnly = false;

        //Activite dropdown menus
        getRef('viewTeamSex').onclick = function(){toggleDropdownMenu(this.id)};
        getRef('viewTeamLeaderboards').onclick = function(){toggleDropdownMenu(this.id)};
        }
    }


////////////////////////////////////////////////////////////////////////
//
// Will allow for the editted team to be saved and their settings updated
//
////////////////////////////////////////////////////////////////////////
function saveEditTeam()
    {
    var teamData = {
        id: currentTeam_gv, 
        name: getRef("viewTeam-name").value,
        sex: getRef("dropdown-title-viewTeamSex").innerHTML, 
        numvolunteers: null,
        numhours: null,
        leaderboard: (getRef("dropdown-title-viewTeamLeaderboards").innerHTML == "Yes"),
        volunteers: null,
    }

    try 
        {
        setLoaderVisibility(true);

        //Send post request and handle the response
        handleAPIcall({teamData: teamData}, "/api/editTeam", response => 
            {
            if(response.success)
                {
                alert("You successfully updated the team");
                }
            else 
                {
                printUserErrorMessage(response.errorCode);
                }

            //Set the inputs to view only
            getRef('viewTeam-name').readOnly = true;
    
            //Activite dropdown menus
            getRef('viewTeamSex').onclick = function(){return};
            getRef('viewTeamLeaderboards').onclick = function(){return};

            //Change button display
            getRef('editTeam').innerHTML = "Edit"; 

            //Stay on the current page to allow user to do what they want next
            setLoaderVisibility(false);
            });
        }
    catch (error)
        {
        console.log(error.message);
        alert("Error saving team. Please try again");
        setLoaderVisibility(false);
        }
    }