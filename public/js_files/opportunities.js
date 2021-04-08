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
    getRef('addOpportunityButton').onclick = function(){toggleOppourtuntiyBoxVisibility()};
    getRef('cancelOpportunityChoice').onclick = function(){toggleOppourtuntiyBoxVisibility()};
    getRef('addOpportunityChoice').onclick = function(){addOpportunity()};
    getRef('returnToOppListButt').onclick = function(){retToOpportunityMainPage()};
    getRef('closeVolunteerInvolvement').onclick = function(){toggleViewInvolvementBoxVisibility()};
    getRef('saveVolunteerInvolvement').onclick = function(){saveVolunteerInvolvement()};
    getRef('editOpportunity').onclick = function(){editOpportunity()};

    getRef('addOpportunity-viewableBy').onclick = function(){toggleViewableByBoxVisibility()}
    getRef('cancelViewableBy').onclick = function(){toggleViewableByBoxVisibility()};
    getRef('SelectViewableBy').onclick = function(){setViewableBy()};


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
    var currentState = getRef('addOpportunityPopup').style.display; 

    if(currentState === "none")
        {
        fillOpportunityTypeOptions('addOpportunityTypeOptions');
        fillOpportunityViewableByOptions();
        getRef('addOpportunityPopup').style.display = "block";
        }
    else 
        {
        getRef('addOpportunityPopup').style.display = "none"; 
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
    var currentState = getRef('viewVolunteerInvolvementPopup').style.display; 

    if(currentState === "none")
        {
        getRef('viewVolunteerInvolvementPopup').style.display = "block";
        }
    else 
        {
        getRef('viewVolunteerInvolvementPopup').style.display = "none"; 
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
    var currentState = getRef('viewableByPopup').style.display; 

    if(currentState === "none")
        {
        fillOpportunityViewableByOptions();
        getRef('viewableByPopup').style.display = "block";
        }
    else 
        {
        getRef('viewableByPopup').style.display = "none";
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
        getRef(elementId).onclick = function(){selectDropdownOption(this.id);}
        }

    for(var i = 1; i <= 4; i++) 
        {
        var elementId = addOrView + "Opportunity" + startORend + "TimeMinOptions_option_" + i;
        getRef(elementId).onclick = function(){selectDropdownOption(this.id);}
        }
    
    getRef(addOrView + "Opportunity" + startORend + "TimeAmPmOptions_option_1").onclick = function(){selectDropdownOption(this.id);}
    getRef(addOrView + "Opportunity" + startORend + "TimeAmPmOptions_option_2").onclick = function(){selectDropdownOption(this.id);}
        
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
    if(getRef('viewableTeam_0').checked)
        {
        opportunityViewableBy_gv.push(0);

        //Set label to show all teams
        getRef('viewOpportunity-viewableByLabel').innerHTML = "All Teams"; 
        getRef('addOpportunity-viewableByLabel').innerHTML = "All Teams"; 
        }
    else 
        {
        //Add volunteers to the table
        for(var option = 0; option < viewableByOptions_gv.length; option++)
            {
            //Check if the CheckBox is checked
            if(getRef('viewableTeam_' + viewableByOptions_gv[option].id).checked)
                {
                opportunityViewableBy_gv.push(viewableByOptions_gv[option].id);

                //Set label to show
                getRef('viewOpportunity-viewableByLabel').innerHTML = viewableByOptions_gv[option].name; 
                getRef('addOpportunity-viewableByLabel').innerHTML = viewableByOptions_gv[option].name;

                numSelected++;
                }
            }

        if(numSelected > 1) 
            {
            getRef('viewOpportunity-viewableByLabel').innerHTML = "Multiple"; 
            getRef('addOpportunity-viewableByLabel').innerHTML = "Multiple";  
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
    handleAPIcall({OpportunityID: -1}, '/api/getAllOpportunityInfo', response =>
        {
        if(response.success)
            {
            //Get reference to table 
            var oppourtuntityRoundTable = getRef('oppourtuntiesTable');
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
                numVolunteers.innerHTML = response.oppInfo[oppNum].numvolunteers;
                date.innerHTML = getDayOfYearFromTimestamp(response.oppInfo[oppNum].starttime);
                startTime.innerHTML = getTimeFromTimestamp(response.oppInfo[oppNum].starttime);

                view.innerHTML = "<i id=\"view_" + response.oppInfo[oppNum].id + "\" class=\"fas fa-eye table-view\" onclick=\"viewOpportunity(this.id)\"></i>";
                remove.innerHTML = "<i id=\"delete_" + response.oppInfo[oppNum].id + "\"class=\"fas fa-trash table-view\" onclick=\"deleteOpportunity(this.id)\"></i>";
                }
            }
        else 
            {
            console.log("Error in retriving oppourtuntiy table data. ErrorCode: " + response.errorCode);

            //Add element to table to indicate we could not load the data
            var oppourtuntityRoundTable = getRef('oppourtuntiesTable');

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
    try 
        {
        //Collect start and end date values 
        var startDate = getRef('addOpportunity-startDate').value;
        var startAm_Pm = getRef('dropdown-title-addOpportunityStartTimeAmPm').innerHTML;
        var startHour = parseInt(getRef('dropdown-title-addOpportunityStartTimeHrs').innerHTML) + ((startAm_Pm == "pm") ? 12 : 0);
        var startMin = parseInt(getRef('dropdown-title-addOpportunityStartTimeMin').innerHTML);

        var endDate = getRef('addOpportunity-endDate').value;
        var endAm_Pm = getRef('dropdown-title-addOpportunityEndTimeAmPm').innerHTML;
        var endHour = parseInt(getRef('dropdown-title-addOpportunityEndTimeHrs').innerHTML) + ((endAm_Pm == "pm") ? 12 : 0);
        var endMin = parseInt(getRef('dropdown-title-addOpportunityEndTimeMin').innerHTML);


        //Collect Form Values
        var oppData = {
            title: getRef('addOpportunity-title').value, 
            startDatetime: convertDateToTimestamp(startDate, startHour, startMin),
            endDatetime: convertDateToTimestamp(endDate, endHour, endMin),
            location: getRef('addOpportunity-location').value, 
            id: null,                                   //Assigned by the backend
            occurred: false,                            //Likely false since we just created the event -- needs to be checked
            type: addOppourtunityType_gv,               //This needs to be set when the option is selected
            viewableBy: opportunityViewableBy_gv,       //This needs to be set when the option is selected -- currently only can handle all teams
            description: getRef('addOpportunity-description').value, 
            sequenceNum: 1, 
            coordinatorname: getRef('addOpportunity-coordinatorName'),
            coordinatoremail: getRef('addOpportunity-coordinatorEmail'),
            coordinatorphone: getRef('addOpportunity-coordinatorPhone'),
            volunteerLimit: getRef('addOpportunityVolunteerLimit').value,
            volunteers: null,                           //They have not been set yet
        };

        handleAPIcall({oppData: oppData}, "/api/addOpportunity", response => 
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
            });
        }
    catch(error)
        {
        console.log(error.message);
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
    if(getRef('editOpportunity').innerHTML == "Save")
        {
        //Show we are doing something, call function to save opportunity
        getRef('editOpportunity').innerHTML = "Saving...";
        saveEditOpportunity();
        }
    else 
        {
        //Change button display
        getRef('editOpportunity').innerHTML = "Save"; 

        //Allow all the fields to be updated
        getRef('viewOpportunity-title').readOnly = false;

        //Initalize datepickers for input fields
        createDatePicker('viewOpportunity-startDate', 'viewOpportunityStartDatePicker', 3);
        createDatePicker('viewOpportunity-endDate', 'viewOpportunityEndDatePicker', 4);

        //Activite dropdown menus
        getRef('viewOpportunityStartTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
        getRef('viewOpportunityStartTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
        getRef('viewOpportunityStartTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
        addTimeDropdownOptions("view", "Start");

        getRef('viewOpportunityEndTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
        getRef('viewOpportunityEndTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
        getRef('viewOpportunityEndTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
        addTimeDropdownOptions("view", "End");

        getRef('viewOpportunityType').onclick = function(){toggleDropdownMenu(this.id)};
        fillOpportunityTypeOptions('viewOpportunityTypeOptions');

        getRef('viewOpportunity-viewableBy').onclick = function(){toggleViewableByBoxVisibility()};
        getRef('viewOpportunity-viewableBy').disabled = false;
        fillOpportunityViewableByOptions();

        changeSliderLabel('viewOpportunityVolunteerLimit');       //Call function to update label to match
        getRef('viewOpportunityVolunteerLimit').onchange = function(){changeSliderLabel(this.id)};

        getRef('viewOpportunity-location').readOnly = false;
        getRef('viewOpportunity-description').readOnly = false;

        getRef('viewOpportunity-coordinatorName').readOnly = false;
        getRef('viewOpportunity-coordinatorEmail').readOnly = false;
        getRef('viewOpportunity-coordinatorPhone').readOnly = false;
        }
    }


////////////////////////////////////////////////////////////////////////
// 
// Will collect all the information and save the opportunity
//
////////////////////////////////////////////////////////////////////////
function saveEditOpportunity() 
    {

    try 
        {
        //Collect start and end date values 
        var startDate = getRef('viewOpportunity-startDate').value;
        var startAm_Pm = getRef('dropdown-title-viewOpportunityStartTimeAmPm').innerHTML;
        var startHour = parseInt(getRef('dropdown-title-viewOpportunityStartTimeHrs').innerHTML) + ((startAm_Pm == "pm") ? 12 : 0);
        var startMin = parseInt(getRef('dropdown-title-viewOpportunityStartTimeMin').innerHTML);

        var endDate = getRef('viewOpportunity-endDate').value;
        var endAm_Pm = getRef('dropdown-title-viewOpportunityEndTimeAmPm').innerHTML;
        var endHour = parseInt(getRef('dropdown-title-viewOpportunityEndTimeHrs').innerHTML) + ((endAm_Pm == "pm") ? 12 : 0);
        var endMin = parseInt(getRef('dropdown-title-viewOpportunityEndTimeMin').innerHTML);


        //Collect Form Values
        var oppData = {
            title: getRef('viewOpportunity-title').value, 
            startDatetime: convertDateToTimestamp(startDate, startHour, startMin),
            endDatetime: convertDateToTimestamp(endDate, endHour, endMin),
            location: getRef('viewOpportunity-location').value, 
            id: currentViewedOpportunity_gv.id,                 
            occurred: currentViewedOpportunity_gv.occurred,
            type: addOppourtunityType_gv,               //This needs to be set when the option is selected
            viewableBy: opportunityViewableBy_gv,       //This needs to be set when the option is selected
            description: getRef('viewOpportunity-description').value, 
            sequenceNum: currentViewedOpportunity_gv.sequenceNum, 
            coordinatorname: getRef('viewOpportunity-coordinatorName').value,
            coordinatoremail: getRef('viewOpportunity-coordinatorEmail').value,
            coordinatorphone: getRef('viewOpportunity-coordinatorPhone').value,
            volunteerLimit: getRef('viewOpportunityVolunteerLimit').value,
            volunteers: null,                           //Can allow these to be updated
        };

        //Send post request and handle the response
        handleAPIcall({oppData: oppData}, "/api/editOpportunity", response => 
            {
            if(response.success)
                {
                alert("You successfully updated the opportunity");

                //Allow all the fields to be updated
                getRef('viewOpportunity-title').readOnly = true;

                //Initalize datepickers for input fields
                deleteDatePicker('viewOpportunity-startDate', 'viewOpportunityStartDatePicker', 3);
                deleteDatePicker('viewOpportunity-endDate', 'viewOpportunityEndDatePicker', 4);

                //Activite dropdown menus
                getRef('viewOpportunityStartTimeHrs').onclick = function(){return};
                getRef('viewOpportunityStartTimeMin').onclick = function(){return};
                getRef('viewOpportunityStartTimeAmPm').onclick = function(){return};
                addTimeDropdownOptions("view", "Start");

                getRef('viewOpportunityEndTimeHrs').onclick = function(){return};
                getRef('viewOpportunityEndTimeMin').onclick = function(){return};
                getRef('viewOpportunityEndTimeAmPm').onclick = function(){return};
                addTimeDropdownOptions("view", "End");

                getRef('viewOpportunityType').onclick = function(){return};
                getRef('viewOpportunityTypeOptions').innerHTML = "";

                getRef('viewOpportunity-viewableBy').onclick = function(){return};

                getRef('viewOpportunityVolunteerLimit').onchange = function(){return};

                getRef('viewOpportunity-location').readOnly = true;
                getRef('viewOpportunity-description').readOnly = true;

                getRef('viewOpportunity-coordinatorName').readOnly = true;
                getRef('viewOpportunity-coordinatorEmail').readOnly = true;
                getRef('viewOpportunity-coordinatorPhone').readOnly = true;

                //Change button display
                getRef('editOpportunity').innerHTML = "Edit"; 

                //Stay on the current page to allow user to do what they want next
                }
            else 
                {
                printUserErrorMessage(response.errorCode);
                }
            });
        }
    catch(error)
        {
        console.log(error.message);
        alert("Something unexpected happened. Please try saving the opportunity again");
        }
    
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
    handleAPIcall(null, '/api/getOpportunityTypes', response =>
        {
        if(response.success)
            { 
            //Get reference to div to add  types to it 
            var dropdownDiv = getRef(dropdownID);
            
            for(var i = 0; i < response.oppTypes.length; i++)
                {
                var dropdownOption = document.createElement('a');
                dropdownOption.id = dropdownID + '_option_' + i;    //must be unique across page
                dropdownOption.classList = "dropdown-option";
                dropdownOption.innerHTML = response.oppTypes[i];
                dropdownDiv.appendChild(dropdownOption);

                //create dom function call 
                getRef(dropdownID + '_option_' + i).onclick = function(){selectDropdownOption(this.id)};
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
    handleAPIcall(null, '/api/getTeamsForViewable', response =>
        {
        if(response.success)
            {
            //Get table id
            var viewableByTable = getRef("viewableByTable");

            //Remove the current elements if any 
            for(var i = viewableByTable.rows.length - 1 ; i > 1; i--)
                {
                viewableByTable.deleteRow(i);
                }

            //set the current row number 
            var rowNum = 2;

            //Add volunteers to the table
            for(var option = 0; option < response.teamInfo.length; option++)
                {
                //Create new row
                var row = viewableByTable.insertRow(rowNum++);

                //Create row elements 
                var selectBox = row.insertCell(0);
                var teamName = row.insertCell(1);
        
                //Fill in row elements
                if(opportunityViewableBy_gv.length > 0)
                    {
                    selectBox.innerHTML =  "<input type=\"checkbox\" id=\"viewableTeam_" + response.teamInfo[option].id +"\"" + (teamCanView(response.teamInfo[option].id) ? "checked" : "") + ">";
                    }
                else 
                    {
                    selectBox.innerHTML =  "<input type=\"checkbox\" id=\"viewableTeam_" + response.teamInfo[option].id +"\">";
                    }
                
                teamName.innerHTML = (response.teamInfo[option].sex == 'Men' ? 'M - ' : 'W - ') + response.teamInfo[option].name;
                }

            //Set the global varaible of the values 
            viewableByOptions_gv = response.teamInfo;
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
        handleAPIcall({OpportunityID: OpportunityID}, '/api/deleteOpportunity', response =>
            {
            if(response.success)
                {
                alert('Opportunity Successfully Deleted');
                location.reload();  //Reload the page
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
function viewOpportunity(elementID)
    {

    //Get the elementID
    var OpportunityID = elementID.slice(5);      //Will remove 'view_'

    try 
        {
        setLoaderVisibility(true);
        //Get the Opportunity data using getOpportunityData() -- pass oppourtunity ID to get the data we need
        handleAPIcall({OpportunityID: OpportunityID}, '/api/getOpportunityData', response =>
            {
            if(response.success)
                {
                currentViewedOpportunity_gv = response.oppData[0];      //Set the current Opportunity

                //Fill in the data for the view screen -- our request will only return 1 element in the array
                getRef('viewOpportunity-title').value = response.oppData[0].title;

                getRef('viewOpportunity-startDate').value = getUTCFormatFromTimestamp(response.oppData[0].starttime);
                getRef('viewOpportunity-endDate').value = getUTCFormatFromTimestamp(response.oppData[0].endtime);

                var startTimeHrs = getHoursFromTimestamp(response.oppData[0].starttime);
                var startTimeMin = getMinutesFromTimestamp(response.oppData[0].starttime);
                getRef('dropdown-title-viewOpportunityStartTimeHrs').innerHTML = (startTimeHrs > 12) ? startTimeHrs - 12 : startTimeHrs;
                getRef('dropdown-title-viewOpportunityStartTimeMin').innerHTML = startTimeMin;
                getRef('dropdown-title-viewOpportunityStartTimeAmPm').innerHTML = (startTimeHrs > 12) ? "pm" : ((startTimeHrs == 12 && startTimeMin > 0) ? "pm" : "am");

                var endTimeHrs = getHoursFromTimestamp(response.oppData[0].endtime);
                var endTimeMin = getMinutesFromTimestamp(response.oppData[0].endtime);
                getRef('dropdown-title-viewOpportunityEndTimeHrs').innerHTML = (endTimeHrs > 12) ? endTimeHrs - 12 : endTimeHrs;
                getRef('dropdown-title-viewOpportunityEndTimeMin').innerHTML = endTimeMin;
                getRef('dropdown-title-viewOpportunityEndTimeAmPm').innerHTML = (endTimeHrs > 12) ? "pm" : (endTimeHrs == 12 && endTimeMin > 0) ? "pm" : "am";

                getRef('dropdown-title-viewOpportunityType').innerHTML = response.oppData[0].type;
                getRef('viewOpportunityVolunteerLimit').value = response.oppData[0].volunteerLimt;
                changeSliderLabel('viewOpportunityVolunteerLimit');
                getRef('viewOpportunity-viewableByLabel').innerHTML = (response.oppData[0].viewableBy.length <= 1) ? response.oppData[0].viewableBy[0].name : "Multiple";
                opportunityViewableBy_gv = response.oppData[0].viewableBy;

                getRef('viewOpportunity-location').value = response.oppData[0].location;
                getRef('viewOpportunity-description').value = response.oppData[0].description;

                getRef('viewOpportunity-coordinatorName').value = response.oppData[0].cordinatorname;
                getRef('viewOpportunity-coordinatorEmail').value = response.oppData[0].cordinatoremail;
                getRef('viewOpportunity-coordinatorPhone').value = response.oppData[0].cordinatorphone;

                //Get table id
                var viewOpp_VolunteerTable = getRef('viewVolunteersForOpportunityTable');
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
                getRef("opportunitiesMainPage").style.display = "none";
                getRef("viewOpportunityPage").style.display = "block";
                }
            else 
                {
                console.log("Could not successfully load Opportunity data. Error Code: " + response.errorCode);

                printUserErrorMessage(response.errorCode);
                }
            
            setLoaderVisibility(false);
            });   
        }
    catch(error)
        {
        alert("Oops, looks like something went wrong while loading the opportunity information. Try again");
        setLoaderVisibility(false);
        }
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
    getRef("viewOpportunityPage").style.display = "none";
    getRef("opportunitiesMainPage").style.display = "block";
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