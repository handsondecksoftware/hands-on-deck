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
// Will initialize 
//
//////////////////////////////////////////////////////////////////////// 
function init()
  {
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
function deleteOpportunity(e){

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

            //TODO: Delete the oppportunity from the back end
            
            return true;
        }
    }
  }
  return false;
}


////////////////////////////////////////////////////////////////////////
// 
// View an opportunity
//
////////////////////////////////////////////////////////////////////////
function viewOpportunity(e){
    document.getElementById("opportunitiesMainPage").style.display = "none";
    document.getElementById("viewVolunteersForOpportunityHeader").style.display = "block";
    document.getElementById("viewVolunteersForOppourtunityTableDiv").style.display = "block";
    document.getElementById("returnToOppListButt").style.display = "block";

    // Finds the row of the view button clicked
    e = e || event;
    var eventEl = e.srcElement || e.target, 
    parent = eventEl.parentNode,
    isRow = function(el) {
                return el.tagName.match(/tr/i);
            };

    // Move up the DOM until tr is reached
    while (parent = parent.parentNode) {
        if (isRow(parent)) {
            return true;
        }
    }
    
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