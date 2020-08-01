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

  createDatePicker("addOppourtunityDate", "addOppourtunityDatePicker", 1);

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