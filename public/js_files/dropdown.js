////////////////////////////////////////////////////////////////////////
// dropdown.js -- dropdown menu behaviour
//                  
//
// Ryan Stolys, 04/08/20
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
//
//  Will initalize the sliders on each page
//		
////////////////////////////////////////////////////////////
function initDropdowns(pageID)
  {
  switch(pageID)
    {
    case 'Opportunties':
        {
        document.getElementById('addOpportunityStartTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
        document.getElementById('addOpportunityStartTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
        document.getElementById('addOpportunityStartTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
        addTimeDropdownOptions("add", "Start");

        document.getElementById('addOpportunityEndTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
        document.getElementById('addOpportunityEndTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
        document.getElementById('addOpportunityEndTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
        addTimeDropdownOptions("add", "End");

        document.getElementById('addOpportunityType').onclick = function(){toggleDropdownMenu(this.id)};
        fillOpportunityTypeOptions('addOpportunityTypeOptions');

        //document.getElementById('addOpportunityViewableBy').onclick = function(){toggleDropdownMenu(this.id)};
        //fillOpportunityViewableByOptions('addOpportunityViewableByOptions');
        break;
        } 
    case 'Teams':
      {
        
      break;
      } 
    case 'Volunteers':
      {
      
      break;
      } 
    default:
      //do nothing
      break;
    }
  }


////////////////////////////////////////////////////////////
//
//  Will show and hide dropdown menu where needed
//		
////////////////////////////////////////////////////////////
function toggleDropdownMenu(dropdownID)
  {
  var contentID = dropdownID + 'Options';
  var currentState = document.getElementById(contentID).style.display;

  if(currentState == "none" || currentState == "")
    {
    document.getElementById(contentID).style.display = "block";
    document.getElementById('dropdown-arrow-' + dropdownID).classList.add('rotate-90');
    }
  else 
    {
    document.getElementById(contentID).style.display = "none";
    document.getElementById('dropdown-arrow-' + dropdownID).classList.remove('rotate-90');
    }
  
  return;
  }


////////////////////////////////////////////////////////////
//
//  Will direct data to correct location on click of dropdown item
//		
////////////////////////////////////////////////////////////
function selectDropdownOption(itemID)
  {
  //Get the content of that option 
  var selection = document.getElementById(itemID).innerHTML; 

  //Get the id of the dropdown option
  var dropdownID = itemID.split("_")[0].slice(0, -7);   
    // will get the item id, split it at each '-', 
    //give the first element then remove the last 7 characters 'option'
    // the result will be the dropdown button id

  
  //Add the selection to the button innerHTML for display and close the dropdown menu 
  document.getElementById("dropdown-title-" + dropdownID).innerHTML = selection; 
  toggleDropdownMenu(dropdownID);
  
  return;
  }
