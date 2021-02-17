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
var opportunityViewableBy_gv = [];
var viewableByOptions_gv;

var currentViewedOpportunity_gv;


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
    document.getElementById('editOpportunity').onclick = function(){editOpportunity()};

    document.getElementById('addOpportunity-viewableBy').onclick = function(){toggleViewableByBoxVisibility()}
    document.getElementById('cancelViewableBy').onclick = function(){toggleViewableByBoxVisibility()};
    document.getElementById('SelectViewableBy').onclick = function(){setViewableBy()};


    initSlider('Opportunties');
    initDropdowns('Opportunties');

    createDatePicker("addOpportunity-startDate", "addOpportunityStartDatePicker", 1);
    createDatePicker("addOpportunity-endDate", "addOpportunityEndDatePicker", 2);

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
        fillOpportunityTypeOptions('addOpportunityTypeOptions');
        fillOpportunityViewableByOptions();
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
// Will eiter display or hide the viewableBy selection box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleViewableByBoxVisibility()
    {
    //Change the oppourtuntiy popup box display
    var currentState = document.getElementById('viewableByPopup').style.display; 

    if(currentState === "none")
        {
        fillOpportunityViewableByOptions();
        document.getElementById('viewableByPopup').style.display = "block";
        }
    else 
        {
        document.getElementById('viewableByPopup').style.display = "none";
        }

    }


////////////////////////////////////////////////////////////////////////
// 
// Connect the dropdown elements to a fucntion to change its value
//
////////////////////////////////////////////////////////////////////////
function addTimeDropdownOptions(addOrView, startORend)
    {
    for(var i = 1; i <= 12; i++) 
        {
        var elementId = addOrView + "Opportunity" + startORend + "TimeHrsOptions_option_" + i;
        document.getElementById(elementId).onclick = function(){selectDropdownOption(this.id);}
        }

    for(var i = 1; i <= 4; i++) 
        {
        var elementId = addOrView + "Opportunity" + startORend + "TimeMinOptions_option_" + i;
        document.getElementById(elementId).onclick = function(){selectDropdownOption(this.id);}
        }
    
    document.getElementById(addOrView + "Opportunity" + startORend + "TimeAmPmOptions_option_1").onclick = function(){selectDropdownOption(this.id);}
    document.getElementById(addOrView + "Opportunity" + startORend + "TimeAmPmOptions_option_2").onclick = function(){selectDropdownOption(this.id);}
        
    }


////////////////////////////////////////////////////////////////////////
// 
// Will set the global variable for the viewable by options
//
////////////////////////////////////////////////////////////////////////
function setViewableBy() 
    {
    var numSelected = 0; 
    opportunityViewableBy_gv = [];

    //Check if all teams are selected
    if(document.getElementById('viewableTeam_0').checked)
        {
        opportunityViewableBy_gv.push(0);

        //Set label to show all teams
        document.getElementById('viewOpportunity-viewableByLabel').innerHTML = "All Teams"; 
        document.getElementById('addOpportunity-viewableByLabel').innerHTML = "All Teams"; 
        }
    else 
        {
        //Add volunteers to the table
        for(var option = 0; option < viewableByOptions_gv.length; option++)
            {
            //Check if the CheckBox is checked
            if(document.getElementById('viewableTeam_' + viewableByOptions_gv[option].id).checked)
                {
                opportunityViewableBy_gv.push(viewableByOptions_gv[option].id);

                //Set label to show
                document.getElementById('viewOpportunity-viewableByLabel').innerHTML = viewableByOptions_gv[option].name; 
                document.getElementById('addOpportunity-viewableByLabel').innerHTML = viewableByOptions_gv[option].name;

                numSelected++;
                }
            }

        if(numSelected > 1) 
            {
            document.getElementById('viewOpportunity-viewableByLabel').innerHTML = "Multiple"; 
            document.getElementById('addOpportunity-viewableByLabel').innerHTML = "Multiple";  
            }
        }

    toggleViewableByBoxVisibility();
    }


////////////////////////////////////////////////////////////////////////
// 
// Will check if the team can view the opportunity
//
////////////////////////////////////////////////////////////////////////
function teamCanView(teamID) 
    {
    var rv = false;

    for(var i = 0; i < opportunityViewableBy_gv.length; i++) 
        {
        if(opportunityViewableBy_gv[i] == teamID) 
            {
            rv = true;
            break;
            }
        }

    return rv;
    }


////////////////////////////////////////////////////////////////////////
// 
// Will fill the oppourtunities table
//
////////////////////////////////////////////////////////////////////////
function fillOpportunityTable()
    {
    //Call method to load oppourtunities -- value of -1 will get all oppourtunities for my instituition
    handleAPIcall({OpportunityID: -1}, '/getOpportunityInfo', response =>
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
                date.innerHTML = getDayOfYearFromISOString(response.oppInfo[oppNum].startDatetime);
                startTime.innerHTML = getTimeFromISOString(response.oppInfo[oppNum].startDatetime);

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

    //Collect start and end date values 
    var startDate = document.getElementById('addOpportunity-startDate').value;
    var startAm_Pm = document.getElementById('dropdown-title-addOpportunityStartTimeAmPm').innerHTML;
    var startHour = parseInt(document.getElementById('dropdown-title-addOpportunityStartTimeHrs').innerHTML) + ((startAm_Pm == "pm") ? 12 : 0);
    var startMin = parseInt(document.getElementById('dropdown-title-addOpportunityStartTimeMin').innerHTML);

    var endDate = document.getElementById('addOpportunity-endDate').value;
    var endAm_Pm = document.getElementById('dropdown-title-addOpportunityEndTimeAmPm').innerHTML;
    var endHour = parseInt(document.getElementById('dropdown-title-addOpportunityEndTimeHrs').innerHTML) + ((endAm_Pm == "pm") ? 12 : 0);
    var endMin = parseInt(document.getElementById('dropdown-title-addOpportunityEndTimeMin').innerHTML);


    //Collect Form Values
    var oppData = {
        title: document.getElementById('addOpportunity-title').value, 
        startDatetime: convertDateToISO(startDate, startHour, startMin),
        endDatetime: convertDateToISO(endDate, endHour, endMin),
        location: document.getElementById('addOpportunity-location').value, 
        id: null,                                   //Assigned by the backend
        occurred: false,                            //Likely false since we just created the event -- needs to be checked
        type: addOppourtunityType_gv,               //This needs to be set when the option is selected
        viewableBy: opportunityViewableBy_gv,   //This needs to be set when the option is selected
        description: document.getElementById('addOpportunity-description').value, 
        sequenceNum: 1, 
        coordinatorInfo: cordInfo,
        volunteerLimit: document.getElementById('addOpportunityVolunteerLimit').value,
        volunteers: null,                           //They have not been set yet
    };

    handleAPIcall({oppData: oppData}, "/addOpportunity", response => 
        {
        if(response.success)
            {
            alert("You successfully added the opportunity");
            
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
        alert("Error adding opportunity. Please try again");
        };

    return;
    }


////////////////////////////////////////////////////////////////////////
// 
// Will setup an opportunity to be editted by the user and call a function to save it when ready
//
////////////////////////////////////////////////////////////////////////
function editOpportunity() 
    {
    if(document.getElementById('editOpportunity').innerHTML == "Save")
        {
        //Show we are doing something, call function to save opportunity
        document.getElementById('editOpportunity').innerHTML = "Saving...";
        saveEditOpportunity();
        }
    else 
        {
        //Change button display
        document.getElementById('editOpportunity').innerHTML = "Save"; 

        //Allow all the fields to be updated
        document.getElementById('viewOpportunity-title').readOnly = false;

        //Initalize datepickers for input fields
        createDatePicker('viewOpportunity-startDate', 'viewOpportunityStartDatePicker', 3);
        createDatePicker('viewOpportunity-endDate', 'viewOpportunityEndDatePicker', 4);

        //Activite dropdown menus
        document.getElementById('viewOpportunityStartTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
        document.getElementById('viewOpportunityStartTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
        document.getElementById('viewOpportunityStartTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
        addTimeDropdownOptions("view", "Start");

        document.getElementById('viewOpportunityEndTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
        document.getElementById('viewOpportunityEndTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
        document.getElementById('viewOpportunityEndTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
        addTimeDropdownOptions("view", "End");

        document.getElementById('viewOpportunityType').onclick = function(){toggleDropdownMenu(this.id)};
        fillOpportunityTypeOptions('viewOpportunityTypeOptions');

        document.getElementById('viewOpportunity-viewableBy').onclick = function(){toggleViewableByBoxVisibility()};
        document.getElementById('viewOpportunity-viewableBy').disabled = false;
        fillOpportunityViewableByOptions();

        changeSliderLabel('viewOpportunityVolunteerLimit');       //Call function to update label to match
        document.getElementById('viewOpportunityVolunteerLimit').onchange = function(){changeSliderLabel(this.id)};

        document.getElementById('viewOpportunity-location').readOnly = false;
        document.getElementById('viewOpportunity-description').readOnly = false;

        document.getElementById('viewOpportunity-coordinatorName').readOnly = false;
        document.getElementById('viewOpportunity-coordinatorEmail').readOnly = false;
        document.getElementById('viewOpportunity-coordinatorPhone').readOnly = false;
        }
    }


////////////////////////////////////////////////////////////////////////
// 
// Will collect all the information and save the opportunity
//
////////////////////////////////////////////////////////////////////////
function saveEditOpportunity() 
    {
    //Collect info

    //Set the coordinator info 
    var cordInfo = {name: document.getElementById('viewOpportunity-coordinatorName'), 
                    email: document.getElementById('viewOpportunity-coordinatorEmail'), 
                    phone: document.getElementById('viewOpportunity-coordinatorPhoneNumber')};

    //Collect start and end date values 
    var startDate = document.getElementById('viewOpportunity-startDate').value;
    var startAm_Pm = document.getElementById('dropdown-title-viewOpportunityStartTimeAmPm').innerHTML;
    var startHour = parseInt(document.getElementById('dropdown-title-viewOpportunityStartTimeHrs').innerHTML) + ((startAm_Pm == "pm") ? 12 : 0);
    var startMin = parseInt(document.getElementById('dropdown-title-viewOpportunityStartTimeMin').innerHTML);

    var endDate = document.getElementById('viewOpportunity-endDate').value;
    var endAm_Pm = document.getElementById('dropdown-title-viewOpportunityEndTimeAmPm').innerHTML;
    var endHour = parseInt(document.getElementById('dropdown-title-viewOpportunityEndTimeHrs').innerHTML) + ((endAm_Pm == "pm") ? 12 : 0);
    var endMin = parseInt(document.getElementById('dropdown-title-viewOpportunityEndTimeMin').innerHTML);


    //Collect Form Values
    var oppData = {
        title: document.getElementById('viewOpportunity-title').value, 
        startDatetime: convertDateToISO(startDate, startHour, startMin),
        endDatetime: convertDateToISO(endDate, endHour, endMin),
        location: document.getElementById('viewOpportunity-location').value, 
        id: currentViewedOpportunity_gv.id,                 
        occurred: currentViewedOpportunity_gv.occurred,                            //Likely false since we just created the event -- needs to be checked
        type: addOppourtunityType_gv,               //This needs to be set when the option is selected
        viewableBy: opportunityViewableBy_gv,   //This needs to be set when the option is selected
        description: document.getElementById('viewOpportunity-description').value, 
        sequenceNum: currentViewedOpportunity_gv.sequenceNum, 
        coordinatorInfo: cordInfo,
        volunteerLimit: document.getElementById('viewOpportunityVolunteerLimit').value,
        volunteers: null,                           //Can allow these to be updated
    };

    //Send post request and handle the response
    handleAPIcall({oppData: oppData}, "/editOpportunity", response => 
        {
        if(response.success)
            {
            alert("You successfully updated the opportunity");

            //Allow all the fields to be updated
            document.getElementById('viewOpportunity-title').readOnly = true;

            //Initalize datepickers for input fields
            deleteDatePicker('viewOpportunity-startDate', 'viewOpportunityStartDatePicker', 3);
            deleteDatePicker('viewOpportunity-endDate', 'viewOpportunityEndDatePicker', 4);

            //Activite dropdown menus
            document.getElementById('viewOpportunityStartTimeHrs').onclick = function(){return};
            document.getElementById('viewOpportunityStartTimeMin').onclick = function(){return};
            document.getElementById('viewOpportunityStartTimeAmPm').onclick = function(){return};
            addTimeDropdownOptions("view", "Start");

            document.getElementById('viewOpportunityEndTimeHrs').onclick = function(){return};
            document.getElementById('viewOpportunityEndTimeMin').onclick = function(){return};
            document.getElementById('viewOpportunityEndTimeAmPm').onclick = function(){return};
            addTimeDropdownOptions("view", "End");

            document.getElementById('viewOpportunityType').onclick = function(){return};
            document.getElementById('viewOpportunityTypeOptions').innerHTML = "";

            document.getElementById('viewOpportunity-viewableBy').onclick = function(){return};

            document.getElementById('viewOpportunityVolunteerLimit').onchange = function(){return};

            document.getElementById('viewOpportunity-location').readOnly = true;
            document.getElementById('viewOpportunity-description').readOnly = true;

            document.getElementById('viewOpportunity-coordinatorName').readOnly = true;
            document.getElementById('viewOpportunity-coordinatorEmail').readOnly = true;
            document.getElementById('viewOpportunity-coordinatorPhone').readOnly = true;

            //Change button display
            document.getElementById('editOpportunity').innerHTML = "Edit"; 

            //Stay on the current page to allow user to do what they want next
            }
        else 
            {
            printUserErrorMessage(response.errorCode);
            }
        })
    .catch(error)
        {
        console.log(error.message);
        alert("Error saving opportunity. Please try again");
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
    handleAPIcall(null, '/getOpportunityTypes', response =>
        {
        if(response.success)
            { 
            //Get reference to div to add  types to it 
            var dropdownDiv = document.getElementById(dropdownID);
            
            for(var i = 0; i < response.opportunityTypes.length; i++)
                {
                var dropdownOption = document.createElement('a');
                dropdownOption.id = dropdownID + '_option_' + i;    //must be unique across page
                dropdownOption.classList = "dropdown-option";
                dropdownOption.innerHTML = response.opportunityTypes[i];
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
function fillOpportunityViewableByOptions() 
    {
    //Get the teams Type options 
    handleAPIcall(null, '/getTeamsForViewable', response =>
        {
        if(response.success)
            {
            //Get table id
            var viewableByTable = document.getElementById("viewableByTable");

            //Remove the current elements if any 
            for(var i = viewableByTable.rows.length - 1 ; i > 1; i--)
                {
                viewableByTable.deleteRow(i);
                }

            //set the current row number 
            var rowNum = 2;

            //Add volunteers to the table
            for(var option = 0; option < response.teams.length; option++)
                {
                //Create new row
                var row = viewableByTable.insertRow(rowNum++);

                //Create row elements 
                var selectBox = row.insertCell(0);
                var teamName = row.insertCell(1);
        
                //Fill in row elements
                if(opportunityViewableBy_gv.length > 0)
                    {
                    selectBox.innerHTML =  "<input type=\"checkbox\" id=\"viewableTeam_" + response.teams[option].id +"\"" + (teamCanView(response.teams[option].id) ? "checked" : "") + ">";
                    }
                else 
                    {
                    selectBox.innerHTML =  "<input type=\"checkbox\" id=\"viewableTeam_" + response.teams[option].id +"\">";
                    }
                
                teamName.innerHTML = response.teams[option].name;
                }

            //Set the global varaible of the values 
            viewableByOptions_gv = response.teams;
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
        handleAPIcall({OpportunityID: OpportunityID}, '/deleteOpportunity', response =>
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
    handleAPIcall({OpportunityID: OpportunityID}, '/getOpportunityData', response =>
        {
        if(response.success)
            {
            currentViewedOpportunity_gv = response.oppData[0];      //Set the current Opportunity

            //Fill in the data for the view screen -- our request will only return 1 element in the array
            document.getElementById('viewOpportunity-title').value = response.oppData[0].title;

            document.getElementById('viewOpportunity-startDate').value = getUTCFormatFromISOString(response.oppData[0].startDatetime);
            document.getElementById('viewOpportunity-endDate').value = getUTCFormatFromISOString(response.oppData[0].endDatetime);

            var startTimeHrs = getHoursFromISOString(response.oppData[0].startDatetime);
            var startTimeMin = getMinutesFromISOString(response.oppData[0].startDatetime);
            document.getElementById('dropdown-title-viewOpportunityStartTimeHrs').innerHTML = (startTimeHrs > 12) ? startTimeHrs - 12 : startTimeHrs;
            document.getElementById('dropdown-title-viewOpportunityStartTimeMin').innerHTML = startTimeMin;
            document.getElementById('dropdown-title-viewOpportunityStartTimeAmPm').innerHTML = (startTimeHrs > 12) ? "pm" : ((startTimeHrs == 12 && startTimeMin > 0) ? "pm" : "am");

            var endTimeHrs = getHoursFromISOString(response.oppData[0].endDatetime);
            var endTimeMin = getMinutesFromISOString(response.oppData[0].endDatetime);
            document.getElementById('dropdown-title-viewOpportunityEndTimeHrs').innerHTML = (endTimeHrs > 12) ? endTimeHrs - 12 : endTimeHrs;
            document.getElementById('dropdown-title-viewOpportunityEndTimeMin').innerHTML = endTimeMin;
            document.getElementById('dropdown-title-viewOpportunityEndTimeAmPm').innerHTML = (endTimeHrs > 12) ? "pm" : (endTimeHrs == 12 && endTimeMin > 0) ? "pm" : "am";

            document.getElementById('dropdown-title-viewOpportunityType').innerHTML = response.oppData[0].type;
            document.getElementById('viewOpportunityVolunteerLimit').value = response.oppData[0].volunteerLimt;
            changeSliderLabel('viewOpportunityVolunteerLimit');
            document.getElementById('viewOpportunity-viewableByLabel').innerHTML = (response.oppData[0].viewableBy.length <= 1) ? response.oppData[0].viewableBy[0].name : "Multiple";
            opportunityViewableBy_gv = response.oppData[0].viewableBy;

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
    handleAPIcall({dataID: [VolunteerDataID]}, '/getVolunteeringData', response => 
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