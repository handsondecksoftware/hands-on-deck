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
    //getRef('cancelAddVolunteer').onclick = function(){toggleAddVolunteerBoxVisibility()};
    //getRef('saveAddVolunteer').onclick = function(){addVolunteer()};
    getRef('addVolunteerButton').onclick = function(){toggleAddVolunteerBoxVisibility()};
    getRef('returnToVolList').onclick = function(){toggleViewVolunteerVisibility()};
    getRef('cancelOppourtunityView').onclick = function(){toggleViewOppDetails()};  
    getRef('saveOppourtunityView').onclick = function(){saveOppDetails()};

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
                var volunteerTable = getRef('volunteersTable');
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
                    volunteerHrs.innerHTML = response.volunteerInfo[volNum].numhours ?? 0;
    
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
    var currentState = getRef('addVolunteerPopup').style.display; 

    if(currentState === "none")
        {
        getRef('addVolunteerPopup').style.display = "block"; 
        }
    else 
        {
        getRef('addVolunteerPopup').style.display = "none"; 
        }
    }


////////////////////////////////////////////////////////////////////////
//
// Will display or hide a specific volunteers volunteering history
//
////////////////////////////////////////////////////////////////////////
function toggleViewVolunteerVisibility()
    {
    // Turn on/off a specific volunteers' hours page
    var currentState = getRef('viewVolunteerPage').style.display;
    
    if(currentState === "none")
        {
        getRef('volunteerMainPage').style.display = "none";
        getRef('viewVolunteerPage').style.display = "block";
        }
    else
        {
        getRef('viewVolunteerPage').style.display = "none";
        getRef('volunteerMainPage').style.display = "block";
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
        firstName: getRef('volunteerInfo-firstName').value,
        lastName: getRef('volunteerInfo-lastName').value,
        teamName: getRef('volunteerInfo-teamName').value,
        email: getRef('volunteerInfo-email').value,
        type: getRef('volunteerInfo-type').value,
        id: null, 
        teamName: null, 
        teamID: null, 
        volHours:null, 
        volunteeringData: null,
    };

    alert("Volunteers can only be created through the app interface...");
    return;

    handleAPIcall({volunteerData: volunteerData}, "/api/addVolunteer", response => 
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
    try
        {
        var vol_ID = buttonID.slice(5);      //Remove "view_"

        // Show the new page while the user waits for the content to load
        toggleViewVolunteerVisibility();

        setLoaderVisibility(true);
        handleAPIcall({vol_ID: vol_ID}, "/api/getVolunteerData", response => 
            {
            if(response.success)
                {
                getRef("volName").innerHTML = response.volunteerData.name;
                getRef("volTeam").innerHTML = response.volunteerData.teamname;

                //Get reference to table 
                var volunteerHistoryTable = getRef('volunteerHistoryTable');
                var rowNum = 1;
    
                var volunteeringData = response.volunteerData.volunteeringdata;

                //Fill in table elements
                if(volunteeringData != null)
                    {
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
                        var validate = row.insertCell(5);
                        var remove = row.insertCell(6);
                        
                        //Fill in row elements
                        title.innerHTML = volunteeringData[vData].title;
                        type.innerHTML = volunteeringData[vData].type;
                        duration.innerHTML = "TBD"; //volunteeringData.name;
                        date.innerHTML = "TBD"; //volunteeringData.name;
                        time.innerHTML = "TBD"; //volunteeringData.name;
                        
                        var validateSymbol = volunteeringData[vData].validated ? "fas fa-check" : "fas fa-times"
                        validate.innerHTML = "<i id=\"validate_" + volunteeringData.id + "\"class=\"" + validateSymbol + "\" onclick=\"validateInstance(this.id)\"></i>";
                        remove.innerHTML = "<i id=\"delete_" + volunteeringData.id + "\"class=\"fas fa-trash table-view\" onclick=\"deleteInstance(this.id, " + volunteeringData[vData].title + ", " + response.volunteerData.id + ")\"></i>";
                        }
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
// Deletes the volunteer instance
//
////////////////////////////////////////////////////////////////////////
function deleteInstance(buttonID, instanceName, vol_ID)
    {
    try 
        {
        if(confirm("Are you sure you want to delete the volunteer instance at the opportunity: " + instanceName + " ?"))
            {
            var vol_ID = buttonID.slice(7);       //Remove "delete_"

            setLoaderVisibility(true);

            handleAPIcall({vol_ID: vol_ID}, "/api/getVolunteerData", response => 
                {
                if(response.success)
                    {
                    alert("Deletion was successful!");
                    
                    //Reload the volunteer table
                    viewVolunteer("view_" + vol_ID);
                    }
                else 
                    {
                    printUserErrorMessage(response.errorcode);
                    }

                setLoaderVisibility(false);
                });
            }
        }
    catch (error)
        {
        alert("Oops, something unexpected happened. Please try again");
        setLoaderVisibility(false);
        console.log(error.message);
        }
    }


////////////////////////////////////////////////////////////////////////
//
// Validates the volunteer instance
//
////////////////////////////////////////////////////////////////////////
function validateInstance(buttonID)
    {
    try 
        {
        var vdata_ID = buttonID.slice(9);       //Remove "validate_"

        setLoaderVisibility(true);

        handleAPIcall({vdata_ID: vdata_ID}, "/api/validateVolunteeringData", response => 
            {
            if(response.success)
                {
                //Reload the volunteer table
                viewVolunteer("view_" + vol_ID);
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
        alert("Oops, something unexpected happened. Please try again");
        setLoaderVisibility(false);
        console.log(error.message);
        }
    }
