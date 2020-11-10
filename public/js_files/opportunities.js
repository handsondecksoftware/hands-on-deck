////////////////////////////////////////////////////////////////////////
// oppourtunities.js -- frontend behaviour for oppourtunities page
//                  
//
// Ryan Stolys, 15/07/20
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// 
// Global Varaibles
//
//////////////////////////////////////////////////////////////////////// 
var addOppourtunityType_gv = -1;
var addOppourtunityViewableBy_gv = -1;


////////////////////////////////////////////////////////////////////////
// 
// Will initialize 
//
//////////////////////////////////////////////////////////////////////// 
function init()
    {
    //Fill the oppourtunties table
    fillOpportunityTable();


    //Setup open and close of popup box
    document.getElementById('addOpportunityButton').onclick = function(){toggleOppourtuntiyBoxVisibility()};
    document.getElementById('cancelOpportunityChoice').onclick = function(){toggleOppourtuntiyBoxVisibility()};
    document.getElementById('addOpportunityChoice').onclick = function(){addOpportunity()};
    document.getElementById('returnToOppListButt').onclick = function(){retToOpportunityMainPage()};
    document.getElementById('closeVolunteerInvolvement').onclick = function(){toggleViewInvolvementBoxVisibility()};
    document.getElementById('saveVolunteerInvolvement').onclick = function(){saveVolunteerInvolvement()};

    initSlider('Oppourtunties');
    initDropdowns('Oppourtunties');

    createDatePicker("addOpportunity-date", "addOpportunityDatePicker", 1);

    initLogout();
    }


////////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add oppourtuntiy box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleOppourtuntiyBoxVisibility()
    {
    //Change the oppourtuntiy popup box display
    var currentState = document.getElementById('addOpportunityPopup').style.display; 

    if(currentState === "none")
        {
        fillOpportunityTypeOptions();
        document.getElementById('addOpportunityPopup').style.display = "block";
        }
    else 
        {
        document.getElementById('addOpportunityPopup').style.display = "none"; 
        }

    return;
    }


////////////////////////////////////////////////////////////////////////
// 
// Will eiter display or hide the add oppourtuntiy box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleViewInvolvementBoxVisibility()
    {
    //Change the oppourtuntiy popup box display
    var currentState = document.getElementById('viewVolunteerInvolvementPopup').style.display; 

    if(currentState === "none")
        {
        fillOpportunityTypeOptions();
        document.getElementById('viewVolunteerInvolvementPopup').style.display = "block";
        }
    else 
        {
        document.getElementById('viewVolunteerInvolvementPopup').style.display = "none"; 
        }

    return;
    }


////////////////////////////////////////////////////////////////////////
// 
// Will fill the oppourtunities table
//
////////////////////////////////////////////////////////////////////////
function fillOpportunityTable()
    {
    //Call method to load oppourtunities -- value of -1 will get all oppourtunities for my instituition
    handlePostMethod({OpportunityID: -1}, '/getOpportunityInfo', response =>
        {
        if(response.success)
            {
            //Get reference to table 
            var oppourtuntityRoundTable = document.getElementById('oppourtuntiesTable');
            var rowNum = 1;

            //Fill in table elements
            for(var oppNum = 0; oppNum < response.oppInfo.length; oppNum++)
                {
                //Create new row
                var row = oppourtuntityRoundTable.insertRow(rowNum++);

                //Create row elements 
                var title = row.insertCell(0);
                var type = row.insertCell(1);
                var numVolunteers = row.insertCell(2);
                var date = row.insertCell(3);
                var startTime = row.insertCell(4);
                var view = row.insertCell(5);
                var remove = row.insertCell(6);
                
                //Fill in row elements
                title.innerHTML = response.oppInfo[oppNum].title;
                type.innerHTML = response.oppInfo[oppNum].type;
                numVolunteers.innerHTML = response.oppInfo[oppNum].numVolunteers;
                date.innerHTML = response.oppInfo[oppNum].date;
                startTime.innerHTML = response.oppInfo[oppNum].startTime;

                view.innerHTML = "<i id=\"view_" + response.oppInfo[oppNum].id + "\" class=\"fas fa-eye table-view\" onclick=\"viewOpportunity(this.id)\"></i>";
                remove.innerHTML = "<i id=\"delete_" + response.oppInfo[oppNum].id + "\"class=\"fas fa-trash table-view\" onclick=\"deleteOpportunity(this.id)\"></i>";
                }
            }
        else 
            {
            console.log("Error in retriving oppourtuntiy table data. ErrorCode: " + response.errorCode);

            //Add element to table to indicate we could not load the data
            var oppourtuntityRoundTable = document.getElementById('oppourtuntiesTable');

            //Create new row
            var row = oppourtuntityRoundTable.insertRow(1);

            //Create row elements 
            var title = row.insertCell(0);
            var type = row.insertCell(1);
            var numVolunteers = row.insertCell(2);
            var date = row.insertCell(3);
            var startTime = row.insertCell(4);
            var view = row.insertCell(5);
            var remove = row.insertCell(6);
            
            //Fill in row elements
            title.innerHTML = "Failed";
            type.innerHTML = "to";
            numVolunteers.innerHTML = "load";
            date.innerHTML = "data";
            startTime.innerHTML = "";

            view.innerHTML = "";
            remove.innerHTML = "";
            }
        });
    }


////////////////////////////////////////////////////////////////////////
// 
// Will check inputs and add oppourtuntiy if valid, or provide errors if not
//
// currently does nothing, just closes  the Opportunity box
//
////////////////////////////////////////////////////////////////////////
function addOpportunity()
    {
    //Set the coordinator info 
    var cordInfo = {name: document.getElementById('addOpportunity-coordinatorName'), 
                    email: document.getElementById('addOpportunity-coordinatorEmail'), 
                    phone: document.getElementById('addOpportunity-coordinatorPhoneNumber')};


    //Collect Form Values
    var oppData = {
        title: document.getElementById('addOpportunity-title').value, 
        date: document.getElementById('addOpportunity-title').value,
        startTime: document.getElementById('addOpportunity-startTime').value, 
        endTime: document.getElementById('addOpportunity-endTime').value, 
        location: document.getElementById('addOpportunity-location').value, 
        id: null,                                   //Assigned by the backend
        occurred: false,                            //Likely false since we just created the event -- needs to be checked
        type: addOppourtunityType_gv,               //This needs to be set when the option is selected
        viewableBy: addOppourtunityViewableBy_gv,   //This needs to be set when the option is selected
        description: document.getElementById('addOpportunity-description').value, 
        sequenceNum: 1, 
        coordinatorInfo: cordInfo,
        volunteerLimit: document.getElementById('addOpportunityVolunteerLimit').value,
        volunteers: null,                           //They have not been set yet
    };
    

    handlePostMethod({oppData: oppData}, "/addVolunteer", response => 
        {
        if(response.success)
            {
            alert("You successfully added the volunteer");
            
            //Close the Oppourtunity Box
            toggleOppourtuntiyBoxVisibility();
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

    return;
    }


////////////////////////////////////////////////////////////////////////
// 
// Will find the various types of an Opportunity that are availible and add them
//
////////////////////////////////////////////////////////////////////////
function fillOpportunityTypeOptions(dropdownID)
    {
    //Get the Opportunity Type options 
    handlePostMethod(null, '/getOpportunityTypes', response =>
        {
        if(response.success)
            {
            //Get reference to div to add  types to it 
            var dropdownDiv = document.getElementById(dropdownID);
            
            for(var i = 0; i < response.OpportunityTypes.length; i++)
                {
                var dropdownOption = document.createElement('a');
                dropdownOption.id = dropdownID + '_option_' + i;    //must be unique across page
                dropdownOption.classList = "dropdown-option";
                dropdownOption.innerHTML = response.OpportunityTypes[i];
                dropdownDiv.appendChild(dropdownOption);

                //create dom function call 
                document.getElementById(dropdownID + '_option_' + i).onclick = function(){selectDropdownOption(this.id)};
                }
            }
        else 
            {
            console.log("Could not successfully load types availible. Error Code: " + response.errorCode);
            }
        });

    return;
    }


////////////////////////////////////////////////////////////////////////
// 
// Will find the various types of an Opportunity that are availible and add them
//
////////////////////////////////////////////////////////////////////////
function fillOpportunityViewableByOptions(dropdownID) 
    {
    //Get the teams Type options 
    handlePostMethod(null, '/getTeamsForViewable', response =>
        {
        if(response.success)
            {
            //Get reference to div to add  types to it 
            var dropdownDiv = document.getElementById(dropdownID);
            
            for(var i = 0; i < response.teams.length; i++)
                {
                var dropdownOption = document.createElement('a');
                dropdownOption.id = dropdownID + '_option_' + i;    //must be unique across page
                dropdownOption.classList = "dropdown-option";
                dropdownOption.innerHTML = response.teams[i];
                dropdownDiv.appendChild(dropdownOption);

                //create dom function call 
                document.getElementById(dropdownID + '_option_' + i).onclick = function(){selectDropdownOption(this.id)};
                }
            }
        else 
            {
            console.log("Could not successfully load teams availible. Error Code: " + response.errorCode);
            }
        });

    return;
    }


////////////////////////////////////////////////////////////////////////
// 
// Deletes an opportunity
//
////////////////////////////////////////////////////////////////////////
function deleteOpportunity(elementID)
    {
    //Get the elementID
    var OpportunityID = elementID.slice(7);    //Will remove 'delete_'

    if(confirm("Are you sure you want to delete this entry?"))
        {
        //Delete the selected Opportunity
        handlePostMethod({OpportunityID: OpportunityID}, '/deleteOpportunity', response =>
            {
            if(response.success)
                {
                alert('Opportunity Successfully Deleted');
                }
            else 
                {
                console.log("Could not successfully delete the oppourtunity. Error Code: " + response.errorCode);

                printUserErrorMessage(response.errorCode);
                }
            });
        }
    //else -- user does not want to delete this entry

    return;
    }


////////////////////////////////////////////////////////////////////////
// 
// View an opportunity
//
////////////////////////////////////////////////////////////////////////
function viewOpportunity(elementID){

    //Get the elementID
    var OpportunityID = elementID.slice(5);      //Will remove 'view_'

    //TODO: 
    //      We should have a loader to show so that they know we are loading
    //      https://www.w3schools.com/howto/howto_css_loader.asp
    //      would need this everytime we call for a post request where the user waits for us

    //Get the Opportunity data using getOpportunityData() -- pass oppourtunity ID to get the data we need
    handlePostMethod({OpportunityID: OpportunityID}, '/getOpportunityData', response =>
        {
        if(response.success)
            {
            //Fill in the data for the view screen -- our request will only return 1 element in the array
            document.getElementById('viewOpportunity-title').value = response.oppData[0].title;
            document.getElementById('viewOpportunity-startTime').value = response.oppData[0].date + " - " + response.oppData[0].startTime;
            document.getElementById('viewOpportunity-endTime').value = response.oppData[0].date + " - " + response.oppData[0].endTime;

            document.getElementById('dropdown-title-viewOpportunityType').innerHTML = response.oppData[0].type;
            document.getElementById('dropdown-title-viewOpportunityVolLimit').innerHTML = response.oppData[0].volunteerLimt;
            document.getElementById('dropdown-title-viewOpportunityViewableBy').innerHTML = (response.oppData[0].viewableBy == -1) ? "All Teams" : "Fix This";

            document.getElementById('viewOpportunity-location').value = response.oppData[0].location;
            document.getElementById('viewOpportunity-description').value = response.oppData[0].description;

            document.getElementById('viewOpportunity-coordinatorName').value = response.oppData[0].coordinatorInfo.name;
            document.getElementById('viewOpportunity-coordinatorEmail').value = response.oppData[0].coordinatorInfo.email;
            document.getElementById('viewOpportunity-coordinatorPhone').value = response.oppData[0].coordinatorInfo.phone;

            //Get table id
            var viewOpp_VolunteerTable = document.getElementById('viewVolunteersForOpportunityTable');
            var rowNum = 1;

            //Add volunteers to the table
            for(var volNum = 0; volNum < response.oppData[0].volunteers.length; volNum++)
                {
                //Create new row
                var row = viewOpp_VolunteerTable.insertRow(rowNum++);

                //Create row elements 
                var name = row.insertCell(0);
                var email = row.insertCell(1);
                var team = row.insertCell(2);
                var hours = row.insertCell(3);
                var view = row.insertCell(4);
        
                
                //Fill in row elements
                name.innerHTML = response.oppData[0].volunteers[volNum].name;
                email.innerHTML = response.oppData[0].volunteers[volNum].email;
                team.innerHTML = response.oppData[0].volunteers[volNum].team;
                hours.innerHTML = response.oppData[0].volunteers[volNum].hours;
                view.innerHTML = "<i id=\"view_" + response.oppData[0].volunteers[volNum].volDataID + "\" class=\"fas fa-eye table-view\" onclick=\"viewVolunteerForOpportunity(this.id)\"></i>";
                }


            //Show the content to the user
            document.getElementById("opportunitiesMainPage").style.display = "none";
            document.getElementById("viewOpportunityPage").style.display = "block";
            }
        else 
            {
            console.log("Could not successfully load Opportunity data. Error Code: " + response.errorCode);

            printUserErrorMessage(response.errorCode);
            }
        });


    return false;
}


////////////////////////////////////////////////////////////////////////
// 
// Will show the popup menu displaying volunteer data information for the specific oppourtunity 
//
////////////////////////////////////////////////////////////////////////
function viewVolunteerForOpportunity(elementID)
    {
    var VolunteerDataID = elementID.slice(5);       //will remove 'view_'

    //Show the popup window
    toggleViewInvolvementBoxVisibility();

    //Get the volunteer data ID -- passed as an array of 1 element
    /*
    handlePostMethod({dataID: [VolunteerDataID]}, '/getVolunteeringData', response => 
        {
        if(response.success)
            {
            
            }
        else 
            {
            //Notify user of error
            }
            
        });
    */

    }


////////////////////////////////////////////////////////////////////////
// 
// Will save the volunteer information that was updated by the user
//
////////////////////////////////////////////////////////////////////////
function saveVolunteerInvolvement()
    {
    //Get the involvement ID

    //Collect the volunteer involvement ID

    //Make post request and communicate the result
    }


////////////////////////////////////////////////////////////////////////
// 
// Return from viewing an opportunity
//
////////////////////////////////////////////////////////////////////////
function retToOpportunityMainPage()
    {
    //Change page state back to main page
    document.getElementById("viewOpportunityPage").style.display = "none";
    document.getElementById("opportunitiesMainPage").style.display = "block";
    }


/* Nice code that finds element, we don't need it
// Finds the row of the delete button clicked
        e = e || event;
        var eventEl = e.srcElement || e.target, 
        parent = eventEl.parentNode,
        isRow = function(el) 
            {
            return el.tagName.match(/tr/i);
            };

        // Move up the DOM until tr is reached
        while (parent = parent.parentNode) 
            {
            if (isRow(parent)) 
                {
                // Delete the row visually
                parent.remove()

                //TODO: Delete the oppportunity from the back end
                
                return true;
                }
            }
*/