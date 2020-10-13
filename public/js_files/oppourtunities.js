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
//None


////////////////////////////////////////////////////////////////////////
// 
// Will initialize 
//
//////////////////////////////////////////////////////////////////////// 
function init()
    {
    //Fill the oppourtunties table
    fillOppourtunityTable();


    //Setup open and close of popup box
    document.getElementById('addOppourtunityButton').onclick = function(){toggleOppourtuntiyBoxVisibility()};
    document.getElementById('cancelOppourtunityChoice').onclick = function(){toggleOppourtuntiyBoxVisibility()};
    document.getElementById('addOppourtunityChoice').onclick = function(){addOppourtunity()};
    document.getElementById('returnToOppListButt').onclick = function(){retToOpportunityMainPage()};

    initSlider('Oppourtunties');
    initDropdowns('Oppourtunties');

    createDatePicker("addOppourtunity-date", "addOppourtunityDatePicker", 1);

    initLogout();
    }


////////////////////////////////////////////////////////////////////////
// 
// Will fill the oppourtunities table
//
////////////////////////////////////////////////////////////////////////
function fillOppourtunityTable()
    {
    var data = {oppourtunityID: -1};
    handlePostMethod(data, '/getOpportunityData', response =>
        {
        if(response.success)
            {
            //Set global variable to hold data from oppourtunity
            oppourtuntiyData_gv = response.oppData;

            //Get reference to table 
            var oppourtuntityRoundTable = document.getElementById('oppourtuntiesTable');
            var rowNum = 1;

            //Fill in table elements
            for(var oppNum = 0; oppNum < response.oppData.length; oppNum++)
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
                title.innerHTML = response.oppData[oppNum].title;
                type.innerHTML = response.oppData[oppNum].type;
                numVolunteers.innerHTML = response.oppData[oppNum].numVolunteers;
                date.innerHTML = response.oppData[oppNum].date;
                startTime.innerHTML = response.oppData[oppNum].startTime;

                view.innerHTML = "<i id=\"view_" + response.oppData[oppNum].id + "\" class=\"fas fa-eye table-view\" onclick=\"viewOpportunity(this.id)\"></i>";
                remove.innerHTML = "<i id=\"delete_" + response.oppData[oppNum].id + "\"class=\"fas fa-trash table-view\" onclick=\"deleteOpportunity(this.id)\"></i>";
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
// Will eiter display or hide the add oppourtuntiy box depending on the current state
//
////////////////////////////////////////////////////////////////////////
function toggleOppourtuntiyBoxVisibility()
    {
    //Change the oppourtuntiy popup box display
    var currentState = document.getElementById('addOppourtunityPopup').style.display; 

    if(currentState === "none")
        {
        document.getElementById('addOppourtunityPopup').style.display = "block";
        }
    else 
        {
        document.getElementById('addOppourtunityPopup').style.display = "none"; 
        }

    return;
    }


////////////////////////////////////////////////////////////////////////
// 
// Will check inputs and add oppourtuntiy if valid, or provide errors if not
//
// currently does nothing, just closes  the oppourtunity box
//
////////////////////////////////////////////////////////////////////////
function addOppourtunity()
    {
    //Collect information
    //      need to change the 
    toggleOppourtuntiyBoxVisibility();
    }


////////////////////////////////////////////////////////////////////////
// 
// Will find the various types of an oppourtunity that are availible and add them
//
////////////////////////////////////////////////////////////////////////
function fillOppourtunityTypeOptions(dropdownID)
    {
    //Get the oppourtunity Type options 
    handlePostMethod(null, '/getOppourtunityTypes', response =>
        {
        if(response.success)
            {
            //Get reference to div to add  types to it 
            var dropdownDiv = document.getElementById(dropdownID);
            
            for(var i = 0; i < response.oppourtunityTypes.length; i++)
                {
                var dropdownOption = document.createElement('a');
                dropdownOption.id = dropdownID + '_option_' + i;    //must be unique across page
                dropdownOption.classList = "dropdown-option";
                dropdownOption.innerHTML = response.oppourtunityTypes[i];
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
// Will find the various types of an oppourtunity that are availible and add them
//
////////////////////////////////////////////////////////////////////////
function fillOppourtunityViewableByOptions(dropdownID) 
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
    var oppourtunityID = elementID.slice(7);    //Will remove 'delete_'

    if(confirm("Are you sure you want to delete this entry?"))
        {
        //Delete the selected oppourtunity
        handlePostMethod({oppourtunityID: oppourtunityID}, '/deleteOppourtunity', response =>
            {
            if(response.success)
                {
                alert('Oppourtunity Successfully Deleted');
                }
            else 
                {
                console.log("Could not successfully load teams availible. Error Code: " + response.errorCode);

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
    var oppourtunityID = elementID.slice(5);      //Will remove 'view_'

    //TODO: 
    //      We should have a loader to show so that they know we are loading
    //      https://www.w3schools.com/howto/howto_css_loader.asp
    //      would need this everytime we call for a post request where the user waits for us

    //Get the oppourtunity data using getOpportunityData()
    handlePostMethod({oppourtunityID: oppourtunityID}, '/getOpportunityData', response =>
        {
        if(response.success)
            {
            //Fill in the data for the view screen -- our request will only return 1 element in the array
            document.getElementById('viewOpp_title').innerHTML = response.oppData[0].title;
            document.getElementById('viewOpp_startTime').innerHTML = response.oppData[0].startTime;
            document.getElementById('viewOpp_endTime').innerHTML = response.oppData[0].endTime;

            document.getElementById('viewOpp_type').innerHTML = response.oppData[0].type;
            document.getElementById('viewOpp_volLimit').innerHTML = response.oppData[0].volunteerLimt;
            document.getElementById('viewOpp_viewableBy').innerHTML = (response.oppData[0].viewableBy == -1) ? "All Teams" : "Fix This";
            
            document.getElementById('viewOpp_coordinatorName').innerHTML = response.oppData[0].coordinatorInfo.name;
            document.getElementById('viewOpp_coordinatorEmail').innerHTML = response.oppData[0].coordinatorInfo.email;
            document.getElementById('viewOpp_coordinatorPhone').innerHTML = response.oppData[0].coordinatorInfo.phone;

            //Get table id
            var viewOpp_VolunteerTable = document.getElementById('viewVolunteersForOppourtunityTable');
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
        
                
                //Fill in row elements
                name.innerHTML = response.oppData[0].volunteers[volNum].name;
                email.innerHTML = response.oppData[0].volunteers[volNum].email;
                team.innerHTML = response.oppData[0].volunteers[volNum].team;
                hours.innerHTML = response.oppData[0].volunteers[volNum].hours;
                }


            //Show the content to the user
            document.getElementById("opportunitiesMainPage").style.display = "none";
            document.getElementById("viewVolunteersForOpportunityHeader").style.display = "block";
            document.getElementById("viewVolunteersForOppourtunityTableDiv").style.display = "block";
            document.getElementById("returnToOppListButt").style.display = "block";
            }
        else 
            {
            console.log("Could not successfully load oppourtunity data. Error Code: " + response.errorCode);

            printUserErrorMessage(response.errorCode);
            }
        });


    return false;
}


////////////////////////////////////////////////////////////////////////
// 
// Return from viewing an opportunity
//
////////////////////////////////////////////////////////////////////////
function retToOpportunityMainPage()
    {
    //Change page state back to main page
    document.getElementById('viewVolunteersForOpportunityHeader').style.display = "none";
    document.getElementById('viewVolunteersForOppourtunityTableDiv').style.display = "none";
    document.getElementById('returnToOppListButt').style.display = "none";
    document.getElementById('opportunitiesMainPage').style.display = "block";
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