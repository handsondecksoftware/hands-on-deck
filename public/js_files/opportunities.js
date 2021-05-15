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

const NO_VOL_LIMIT = 1000;


////////////////////////////////////////////////////////////////////////
// 
// Will initialize 
//
//////////////////////////////////////////////////////////////////////// 
function init()
    {
    //Fill the oppourtunties table
    fillOpportunityTable();

    //Setup search
    initSearch('searchOpportunities', 'oppourtuntiesTable', 2);


    //Setup open and close of popup box
    getRef('addOpportunityButton').onclick = function(){toggleOppourtuntiyBoxVisibility()};
    getRef('cancelOpportunityChoice').onclick = function(){toggleOppourtuntiyBoxVisibility()};
    getRef('addOpportunityChoice').onclick = function(){addOpportunity()};
    getRef('returnToOppListButt').onclick = function(){retToOpportunityMainPage()};
    getRef('editOpportunity').onclick = function(){editOpportunity()};

    initSlider('Opportunties');
    initDropdowns('Opportunties');

    createDatePicker("addOpportunity-startDate", "addOpportunityStartDatePicker", 1);
    createDatePicker("addOpportunity-endDate", "addOpportunityEndDatePicker", 2);

    createDatePicker("editInstance-startDate", "editInstanceStartDatePicker", 3);
    createDatePicker("editInstance-endDate", "editInstanceEndDatePicker", 4);

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
// Connect the dropdown elements to a fucntion to change its value
//
////////////////////////////////////////////////////////////////////////
function addTimeDropdownOptions(type, startORend)
    {
    for(var i = 1; i <= 12; i++) 
        {
        var elementId = type + startORend + "TimeHrsOptions_option_" + i;
        getRef(elementId).onclick = function(){selectDropdownOption(this.id);}
        }

    for(var i = 1; i <= 4; i++) 
        {
        var elementId = type + startORend + "TimeMinOptions_option_" + i;
        getRef(elementId).onclick = function(){selectDropdownOption(this.id);}
        }
    
    getRef(type + startORend + "TimeAmPmOptions_option_1").onclick = function(){selectDropdownOption(this.id);}
    getRef(type + startORend + "TimeAmPmOptions_option_2").onclick = function(){selectDropdownOption(this.id);}   
    }


////////////////////////////////////////////////////////////////////////
// 
// Will fill the oppourtunities table
//
////////////////////////////////////////////////////////////////////////
function fillOpportunityTable()
    {
    //Call method to load oppourtunities -- value of -1 will get all oppourtunities for my instituition
    handleAPIcall({oppID: -1}, '/api/getAllOpportunityInfo', response =>
        {
        if(response.success)
            {
            //Get reference to table 
            var oppourtuntityRoundTable = getRef('oppourtuntiesTable');
            var rowNum = 1;

            //Empty the opportunity table first in case there are elements in it 
            for(var i = oppourtuntityRoundTable.rows.length - 1; i >= 1; i--) { oppourtuntityRoundTable.deleteRow(i); }

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
                numVolunteers.innerHTML = response.oppInfo[oppNum].numvolunteers ?? 0;
                date.innerHTML = getDayOfYearFromTimestamp(response.oppInfo[oppNum].starttime);
                startTime.innerHTML = getTimeFromTimestamp(response.oppInfo[oppNum].starttime);

                view.innerHTML = "<i id=\"view_" + response.oppInfo[oppNum].id + "\" class=\"fas fa-eye table-view\" onclick=\"viewOpportunity(this.id)\"></i>";
                remove.innerHTML = "<i id=\"delete_" + response.oppInfo[oppNum].id + "\"class=\"fas fa-trash table-view\" onclick=\"deleteOpportunity(this.id, '" + response.oppInfo[oppNum].title + "')\"></i>";
                }
            }
        else 
            {
            console.log("Error in retriving oppourtuntiy table data. ErrorCode: " + response.errorcode);

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
        //Collect start and end date + time values 
        var startDate = getRef('addOpportunity-startDate').value;
        var startAm_Pm = getRef('dropdown-title-addOpportunityStartTimeAmPm').innerHTML;
        var startHour = parseInt(getRef('dropdown-title-addOpportunityStartTimeHrs').innerHTML) + ((startAm_Pm == "pm") ? 12 : 0);
        var startMin = parseInt(getRef('dropdown-title-addOpportunityStartTimeMin').innerHTML);

        var endDate = getRef('addOpportunity-endDate').value;
        var endAm_Pm = getRef('dropdown-title-addOpportunityEndTimeAmPm').innerHTML;
        var endHour = parseInt(getRef('dropdown-title-addOpportunityEndTimeHrs').innerHTML) + ((endAm_Pm == "pm") ? 12 : 0);
        var endMin = parseInt(getRef('dropdown-title-addOpportunityEndTimeMin').innerHTML);


        //Collect Form Values
        var oppData = gen_oppData();

        //Set data we collected
        oppData.title = getRef('addOpportunity-title').value;
        oppData.type = getRef('dropdown-title-addOpportunityType').innerHTML;
        oppData.starttime = convertDateToTimestamp(startDate, startHour, startMin);
        oppData.endtime = convertDateToTimestamp(endDate, endHour, endMin);
        oppData.location = getRef('addOpportunity-location').value;
        oppData.description = getRef('addOpportunity-description').value;
        oppData.coordinatorname = getRef('addOpportunity-coordinatorName').value;
        oppData.coordinatoremail = getRef('addOpportunity-coordinatorEmail').value;
        oppData.coordinatorphone = getRef('addOpportunity-coordinatorPhone').value;
        oppData.volunteerLimit = getRef('addOpportunityVolunteerLimit').value;

        setLoaderVisibility(true);

        handleAPIcall({oppData: oppData}, "/api/addOpportunity", response => 
            {
            if(response.success)
                {
                alert("You successfully added the opportunity");

                //Reload the opportunity list
                fillOpportunityTable();
                
                //Close the Oppourtunity Box
                toggleOppourtuntiyBoxVisibility();
                }
            else 
                {
                printUserErrorMessage(response.errorCode);
                }

            setLoaderVisibility(false);
            });
        }
    catch(error)
        {
        setLoaderVisibility(false);
        console.log(error.message);
        alert("Error adding opportunity. Please try again");
        };
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
        addTimeDropdownOptions("viewOpportunity", "Start");

        getRef('viewOpportunityEndTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
        getRef('viewOpportunityEndTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
        getRef('viewOpportunityEndTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
        addTimeDropdownOptions("viewOpportunity", "End");

        getRef('viewOpportunityType').onclick = function(){toggleDropdownMenu(this.id)};
        fillOpportunityTypeOptions('viewOpportunityTypeOptions');

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
        var oppData = gen_oppData();
        oppData.id = getRef('viewOpportunity-id').value
        oppData.sequenceNum = getRef('viewOpportunity-seqnum').value
        oppData.title = getRef('viewOpportunity-title').value; 
        oppData.starttime = convertDateToTimestamp(startDate, startHour, startMin);
        oppData.endtime = convertDateToTimestamp(endDate, endHour, endMin);
        oppData.location = getRef('viewOpportunity-location').value;      
        oppData.type = getRef('dropdown-title-viewOpportunityType').innerHTML;
        oppData.description = getRef('viewOpportunity-description').value; 
        
        oppData.coordinatorname = getRef('viewOpportunity-coordinatorName').value;
        oppData.coordinatoremail = getRef('viewOpportunity-coordinatorEmail').value;
        oppData.coordinatorphone = getRef('viewOpportunity-coordinatorPhone').value;
        oppData.volunteerLimit = getRef('viewOpportunityVolunteerLimit').value;
        oppData.volunteers = null;

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
                addTimeDropdownOptions("viewOpportunity", "Start");

                getRef('viewOpportunityEndTimeHrs').onclick = function(){return};
                getRef('viewOpportunityEndTimeMin').onclick = function(){return};
                getRef('viewOpportunityEndTimeAmPm').onclick = function(){return};
                addTimeDropdownOptions("viewOpportunity", "End");

                getRef('viewOpportunityType').onclick = function(){return};
                getRef('viewOpportunityTypeOptions').innerHTML = "";

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
// Deletes an opportunity
//
////////////////////////////////////////////////////////////////////////
function deleteOpportunity(elementID, oppTitle)
    {
    //Get the elementID
    var OpportunityID = Number(elementID.slice(7));    //Will remove 'delete_'

    if(confirm("Are you sure you want to delete opportunity: \n" + oppTitle + "?"))
        {
        //Delete the selected Opportunity
        handleAPIcall({oppID: OpportunityID}, '/api/deleteOpportunity', response =>
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
        handleAPIcall({oppID: OpportunityID}, '/api/getOpportunityData', response =>
            {
            if(response.success)
                {
                getRef('viewOpportunity-id').value = response.oppData.id;
                getRef('viewOpportunity-seqnum').value = response.oppData.sequenceNum;

                //Fill in the data for the view screen -- our request will only return 1 element in the array
                getRef('viewOpportunity-title').value = response.oppData.title;

                getRef('viewOpportunity-startDate').value = getUTCFormatFromTimestamp(response.oppData.starttime);
                getRef('viewOpportunity-endDate').value = getUTCFormatFromTimestamp(response.oppData.endtime);

                var startTimeHrs = getHoursFromTimestamp(response.oppData.starttime);
                var startTimeMin = getMinutesFromTimestamp(response.oppData.starttime);
                getRef('dropdown-title-viewOpportunityStartTimeHrs').innerHTML = (startTimeHrs > 12) ? startTimeHrs - 12 : startTimeHrs;
                getRef('dropdown-title-viewOpportunityStartTimeMin').innerHTML = startTimeMin;
                getRef('dropdown-title-viewOpportunityStartTimeAmPm').innerHTML = (startTimeHrs > 12) ? "pm" : ((startTimeHrs == 12 && startTimeMin > 0) ? "pm" : "am");

                var endTimeHrs = getHoursFromTimestamp(response.oppData.endtime);
                var endTimeMin = getMinutesFromTimestamp(response.oppData.endtime);
                getRef('dropdown-title-viewOpportunityEndTimeHrs').innerHTML = (endTimeHrs > 12) ? endTimeHrs - 12 : endTimeHrs;
                getRef('dropdown-title-viewOpportunityEndTimeMin').innerHTML = endTimeMin;
                getRef('dropdown-title-viewOpportunityEndTimeAmPm').innerHTML = (endTimeHrs > 12) ? "pm" : (endTimeHrs == 12 && endTimeMin > 0) ? "pm" : "am";

                getRef('dropdown-title-viewOpportunityType').innerHTML = response.oppData.type;
                getRef('viewOpportunityVolunteerLimit').value = (response.oppData.volunteerlimit == NO_VOL_LIMIT) ? 15 : response.oppData.volunteerlimit;
                changeSliderLabel('viewOpportunityVolunteerLimit');
                //getRef('viewOpportunity-viewableByLabel').innerHTML = (response.oppData.viewableBy.length <= 1) ? response.oppData.viewableBy.name : "Multiple";
                //opportunityViewableBy_gv = response.oppData.viewableBy;

                getRef('viewOpportunity-location').value = response.oppData.location;
                getRef('viewOpportunity-description').value = response.oppData.description;

                getRef('viewOpportunity-coordinatorName').value = response.oppData.coordinatorname;
                getRef('viewOpportunity-coordinatorEmail').value = response.oppData.coordinatoremail;
                getRef('viewOpportunity-coordinatorPhone').value = response.oppData.coordinatorphone;

                //Get table id
                var viewOpp_VolunteerTable = getRef('viewVolunteersForOpportunityTable');
                var rowNum = 1;

                //Remove existing rows is there are any 
                for(var i = viewOpp_VolunteerTable.rows.length - 1; i >= 1; i--) { viewOpp_VolunteerTable.deleteRow(i); }

                var volunteerData = response.oppData.volunteers;

                //Add volunteers to the table
                for(var volNum = 0; volNum < volunteerData.length; volNum++)
                    {
                    //Create new row
                    var row = viewOpp_VolunteerTable.insertRow(rowNum++);

                    //Create row elements 
                    var name = row.insertCell(0);
                    var stime = row.insertCell(1);
                    var etime = row.insertCell(2);
                    var hours = row.insertCell(3);
                    var validated = row.insertCell(4);
                    var edit = row.insertCell(5);
                    var remove = row.insertCell(6);
            
                    //Fill in row elements
                    name.innerHTML = volunteerData[volNum].name;
                    stime.innerHTML = getTimeFromTimestamp(volunteerData[volNum].starttime);
                    etime.innerHTML = getTimeFromTimestamp(volunteerData[volNum].endtime);
                    hours.innerHTML = volunteerData[volNum].num_hours;

                    var validateSymbol = volunteerData[volNum].validated ? "fas fa-check table-view" : "fas fa-times table-view";
                    validated.innerHTML = "<i id=\"validate_" + volunteerData[volNum].id + "\"class=\"" + validateSymbol + "\" onclick=\"validateInstance(this.id)\"></i>";
                    edit.innerHTML = "<i id=\"edit_" + volunteerData[volNum].id + "\" class=\"fas fa-pencil-alt table-view\" onclick=\"editInstance(this.id, true, '" + volunteerData[volNum].name + "')\"></i>";
                    remove.innerHTML = "<i id=\"delete_" + volunteerData[volNum].id + "\" class=\"fas fa-trash table-view\" onclick=\"deleteInstance(this.id, '" + volunteerData[volNum].name + "', " + response.oppData.id + ")\"></i>";
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
// Will validate the volunteering instance
//
////////////////////////////////////////////////////////////////////////
function validateInstance(buttonID)
    {
    try 
        {
        var vdata_ID = buttonID.slice(9);       //Remove "validate_"

        //Determine the current state and flip it
        var nextState = false;
        if(getRef(buttonID).classList.value.includes("check"))
            {
            nextState = false;
            getRef(buttonID).classList = "fas fa-times table-view";
            }
        else 
            {
            nextState = true;
            getRef(buttonID).classList = "fas fa-check table-view";
            }

        setLoaderVisibility(true);

        handleAPIcall({vdata_ID: vdata_ID, validated: nextState}, "/api/validateVolunteeringData", response => 
            {
            if(response.success)
                {
                //Do nothing, the check mark is already in the correct orientation 
                }
            else 
                {
                //Flip the validate symbol back to its orginal state
                if(nextState) { getRef(buttonID).classList = "fas fa-times table-view"; }
                else { getRef(buttonID).classList = "fas fa-check table-view"; }
                
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


////////////////////////////////////////////////////////////////////////
// 
// Will show the volunteering data information and allow it to be editted
//      If it gets editted this function will also save that editted instance
//
////////////////////////////////////////////////////////////////////////
function editInstance(buttonID, fromTable, volName)
    {
    if(fromTable)
        {
        try
            {
            var vdata_ID = Number(buttonID.slice(5));       //Remove "edit_"

            //Show popup menu
            getRef("editInstancePopup").style.display = 'block';

            setLoaderVisibility(true);

            handleAPIcall({vdata_ID: vdata_ID}, "/api/getVolunteeringDataInstance", response => 
                {
                if(response.success)
                    {
                    //Fill data in the popup
                    getRef("editInstance-name").innerHTML = volName;
                    getRef("instanceID").value = vdata_ID;
                    getRef("oppID").value = response.volunteeringData.opp_id;
                    getRef("volID").value = response.volunteeringData.vol_id;
                    getRef("isValidated").value = response.volunteeringData.validated;
                    

                    getRef('editInstance-startDate').value = getUTCFormatFromTimestamp(response.volunteeringData.starttime);
                    getRef('editInstance-endDate').value = getUTCFormatFromTimestamp(response.volunteeringData.endtime);

                    var startTimeHrs = getHoursFromTimestamp(response.volunteeringData.starttime);
                    var startTimeMin = getMinutesFromTimestamp(response.volunteeringData.starttime);
                    getRef('dropdown-title-editInstanceStartTimeHrs').innerHTML = (startTimeHrs > 12) ? startTimeHrs - 12 : startTimeHrs;
                    getRef('dropdown-title-editInstanceStartTimeMin').innerHTML = startTimeMin;
                    getRef('dropdown-title-editInstanceStartTimeAmPm').innerHTML = (startTimeHrs > 12) ? "pm" : ((startTimeHrs == 12 && startTimeMin > 0) ? "pm" : "am");

                    var endTimeHrs = getHoursFromTimestamp(response.volunteeringData.endtime);
                    var endTimeMin = getMinutesFromTimestamp(response.volunteeringData.endtime);
                    getRef('dropdown-title-editInstanceEndTimeHrs').innerHTML = (endTimeHrs > 12) ? endTimeHrs - 12 : endTimeHrs;
                    getRef('dropdown-title-editInstanceEndTimeMin').innerHTML = endTimeMin;
                    getRef('dropdown-title-editInstanceEndTimeAmPm').innerHTML = (endTimeHrs > 12) ? "pm" : (endTimeHrs == 12 && endTimeMin > 0) ? "pm" : "am";

                    //Activite dropdown menus
                    getRef('editInstanceStartTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
                    getRef('editInstanceStartTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
                    getRef('editInstanceStartTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
                    addTimeDropdownOptions("editInstance", "Start");

                    getRef('editInstanceEndTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
                    getRef('editInstanceEndTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
                    getRef('editInstanceEndTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
                    addTimeDropdownOptions("editInstance", "End");

                    
                    //Setup button clicks on popup
                    getRef("closeEditInstance").onclick = function(){editInstance(this.id, false, null)};
                    getRef("saveEditInstance").onclick = function(){editInstance(this.id, false, null)};
                    }
                else 
                    {
                    printUserErrorMessage(response.errorcode);

                    //Close the popup menu
                    getRef("editInstancePopup").style.display = 'none';
                    }

                setLoaderVisibility(false);
                });
            }
        catch(error)
            {
            setLoaderVisibility(false);

            alert("Something unexpected happened. Try again");
            console.log(error.message);

            //Close the popup
            getRef("editInstancePopup").style.display = 'none';
            }
        }
    else    //This was called from the volunteer 
        {
        if(buttonID.includes("close"))
            {
            getRef("editInstancePopup").style.display = 'none';       //Close the popup, do nothing
            }
        else 
            {
            try 
                {
                //Collect the volunteering data information
                var vData = gen_vingData();

                vData.id = getRef("instanceID").value;
                vData.opp_id = getRef("oppID").value;
                vData.vol_id = getRef("volID").value;
                vData.validated = getRef("isValidated").value;

                //Get time info 
                var startDate = getRef('editInstance-startDate').value;
                var startAm_Pm = getRef('dropdown-title-editInstanceStartTimeAmPm').innerHTML;
                var startHour = parseInt(getRef('dropdown-title-editInstanceStartTimeHrs').innerHTML) + ((startAm_Pm == "pm") ? 12 : 0);
                var startMin = parseInt(getRef('dropdown-title-editInstanceStartTimeMin').innerHTML);

                var endDate = getRef('editInstance-endDate').value;
                var endAm_Pm = getRef('dropdown-title-editInstanceEndTimeAmPm').innerHTML;
                var endHour = parseInt(getRef('dropdown-title-editInstanceEndTimeHrs').innerHTML) + ((endAm_Pm == "pm") ? 12 : 0);
                var endMin = parseInt(getRef('dropdown-title-editInstanceEndTimeMin').innerHTML);

                vData.starttime = convertDateToTimestamp(startDate, startHour, startMin);
                vData.endtime = convertDateToTimestamp(endDate, endHour, endMin);

                setLoaderVisibility(true);

                handleAPIcall({volunteeringData: vData}, '/api/editVolunteeringData', response =>
                    {
                    if(response.success)
                        {
                        //Close the popup and reload the view opportunity page
                        getRef("editInstancePopup").style.display = "none";

                        viewOpportunity("view_" + vData.opp_id);
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
                
                }
            }
        }
    }


////////////////////////////////////////////////////////////////////////
//
// Deletes the volunteer instance
//
////////////////////////////////////////////////////////////////////////
function deleteInstance(buttonID, volName, oppID)
    {
    try 
        {
        if(confirm("Are you sure you want to delete the volunteer instance for: " + volName + " ?"))
            {
            var vdata_ID = Number(buttonID.slice(7));       //Remove "delete_"

            setLoaderVisibility(true);

            handleAPIcall({vdata_ID: vdata_ID}, "/api/deleteVolunteeringData", response => 
                {
                if(response.success)
                    {
                    alert("Deletion was successful!");
                    
                    //Reload the volunteer table
                    viewOpportunity("view_" + oppID);
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
// Return from viewing an opportunity
//
////////////////////////////////////////////////////////////////////////
function retToOpportunityMainPage()
    {
    //Update the opportunity table
    fillOpportunityTable();

    //Change page state back to main page
    getRef("viewOpportunityPage").style.display = "none";
    getRef("opportunitiesMainPage").style.display = "block";
    }




