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
  //Open the add oppourtuntiy popup box
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