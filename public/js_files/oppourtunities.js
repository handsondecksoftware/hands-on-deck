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
var oppourtuntiyData_gv;    //Elements of this array will be in form:
    //{title, date, startTime, endTime, location, id, occurred, type, description, sequenceNum, numVolunteers}


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
  //getOppourtunityTypes() -- need to specify that these are from SFU
  var types = ['Special Olympics', 'Pub Nights', 'Game Day']; 

  //Get reference to div to add  types to it 
  var dropdownDiv = document.getElementById(dropdownID);
  
  for(var i = 0; i < types.length; i++)
    {
    var dropdownOption = document.createElement('a');
    dropdownOption.id = dropdownID + '_option_' + i;    //must be unique across page
    dropdownOption.classList = "dropdown-option";
    dropdownOption.innerHTML = types[i];
    dropdownDiv.appendChild(dropdownOption);

    //create dom function call 
    document.getElementById(dropdownID + '_option_' + i).onclick = function(){selectDropdownOption(this.id)};
    }

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
  //getTeamsForViewable() -- need to specify that these are from SFU
  var types = ['M - Golf', 'F - Golf', 'M - Swim']; 

  //Get reference to div to add  types to it 
  var dropdownDiv = document.getElementById(dropdownID);
  
  for(var i = 0; i < types.length; i++)
    {
    var dropdownOption = document.createElement('a');
    dropdownOption.id = dropdownID + '_option_' + i;    //must be unique across page
    dropdownOption.classList = "dropdown-option";
    dropdownOption.innerHTML = types[i];
    dropdownDiv.appendChild(dropdownOption);

    //create dom function call 
    document.getElementById(dropdownID + '_option_' + i).onclick = function(){selectDropdownOption(this.id)};
    }

  return;
  }


////////////////////////////////////////////////////////////////////////
// 
// Deletes an opportunity
//
////////////////////////////////////////////////////////////////////////
function deleteOpportunity(elementID){

  //Get the elementID
  var oppourtunityID = elementID.slice(7);    //Will remove 'delete_'

  if(confirm("Are you sure you want to delete this entry?")){
    // Delete entry from backend and reload table
  }
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

    document.getElementById("opportunitiesMainPage").style.display = "none";
    document.getElementById("viewVolunteersForOpportunityHeader").style.display = "block";
    document.getElementById("viewVolunteersForOppourtunityTableDiv").style.display = "block";
    document.getElementById("returnToOppListButt").style.display = "block";

    //call to get data and fill opp data page 


    return false;
}


////////////////////////////////////////////////////////////////////////
// 
// Return from viewing an opportunity
//
////////////////////////////////////////////////////////////////////////
function retToOpportunityMainPage(){
    document.getElementById('viewVolunteersForOpportunityHeader').style.display = "none";
    document.getElementById('viewVolunteersForOppourtunityTableDiv').style.display = "none";
    document.getElementById('returnToOppListButt').style.display = "none";
    document.getElementById('opportunitiesMainPage').style.display = "block";
}