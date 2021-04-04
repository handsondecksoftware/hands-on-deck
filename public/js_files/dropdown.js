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
            getRef('addOpportunityStartTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
            getRef('addOpportunityStartTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
            getRef('addOpportunityStartTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
            addTimeDropdownOptions("add", "Start");

            getRef('addOpportunityEndTimeHrs').onclick = function(){toggleDropdownMenu(this.id)};
            getRef('addOpportunityEndTimeMin').onclick = function(){toggleDropdownMenu(this.id)};
            getRef('addOpportunityEndTimeAmPm').onclick = function(){toggleDropdownMenu(this.id)};
            addTimeDropdownOptions("add", "End");

            getRef('addOpportunityType').onclick = function(){toggleDropdownMenu(this.id)};
            fillOpportunityTypeOptions('addOpportunityTypeOptions');

            //getRef('addOpportunityViewableBy').onclick = function(){toggleDropdownMenu(this.id)};
            //fillOpportunityViewableByOptions('addOpportunityViewableByOptions');
            break;
            } 
        case 'Teams':
            {
            getRef('viewTeamSex').onclick = function(){toggleDropdownMenu(this.id)};
            getRef('viewTeamSexOptions_option_1').onclick = function(){selectDropdownOption(this.id)};
            getRef('viewTeamSexOptions_option_2').onclick = function(){selectDropdownOption(this.id)};

            getRef('viewTeamLeaderboards').onclick = function(){toggleDropdownMenu(this.id)};
            getRef('viewTeamLeaderboardsOptions_option_1').onclick = function(){selectDropdownOption(this.id)};
            getRef('viewTeamLeaderboardsOptions_option_2').onclick = function(){selectDropdownOption(this.id)};
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
  var currentState = getRef(contentID).style.display;

  if(currentState == "none" || currentState == "")
    {
    getRef(contentID).style.display = "block";
    getRef('dropdown-arrow-' + dropdownID).classList.add('rotate-90');
    }
  else 
    {
    getRef(contentID).style.display = "none";
    getRef('dropdown-arrow-' + dropdownID).classList.remove('rotate-90');
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
  var selection = getRef(itemID).innerHTML; 

  //Get the id of the dropdown option
  var dropdownID = itemID.split("_")[0].slice(0, -7);   
    // will get the item id, split it at each '-', 
    //give the first element then remove the last 7 characters 'option'
    // the result will be the dropdown button id

  
  //Add the selection to the button innerHTML for display and close the dropdown menu 
  getRef("dropdown-title-" + dropdownID).innerHTML = selection; 
  toggleDropdownMenu(dropdownID);
  
  return;
  }
