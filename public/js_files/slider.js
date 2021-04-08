////////////////////////////////////////////////////////////
// slider.js -- changes slider label text  
//                   
//  Ryan Stolys,	17/07/20
//    - File Created 
//		
////////////////////////////////////////////////////////////


//////////////USE INSTRUCTIONS///////////////////////////////////
//
//  - Add the below html code 
//  - Set the min to 0 and the max to the number of slider options minus 1
//  - Add a case to initalize the slider for that page it was added 
//      All sliders on one page are initalized in a sigle case block
//  - Add a case for the slider label where the options for the label are provided 
//  - Written code will do the rest
//
//  NOTE: 
//  - *** The labelID MUST be the same as the input id with 'Label' appended to it. ***
//  - Ensure  the initial value provided matches the first value shown on screen
//
//
//  <div class="sliderLabel" id="<inputID> + 'Label'">Yes</div>
//  <div class="sliderContainer sliderWidth">
//    <input type="range" min="0" max="1" value="0" class="slider" id="<inputID>">
//   </div>
//
/////////////////////////////////////////////////////////////////

              


////////////////////////////////////////////////////////////
//
//  Will initalize the sliders on each page
//		
////////////////////////////////////////////////////////////
function initSlider(pageName)
    {
    switch(pageName)
        {
        case 'Opportunties':
            {
            getRef('oppTimeFrame').onchange = function(){changeSliderLabel(this.id)};
            getRef('addOpportunityVolunteerLimit').onchange = function(){changeSliderLabel(this.id)};

            break;
            } 
        case 'Teams':
            {
            getRef('teamSex').onchange = function(){changeSliderLabel(this.id)};
            getRef('includeLeaderboards').onchange = function(){changeSliderLabel(this.id)};

            break;
            } 
        case 'Volunteers':
            {
            getRef('oppValidated').onchange = function(){changeSliderLabel(this.id)};
            getRef('oppOccurred').onchange = function(){changeSliderLabel(this.id)};

            break;
            } 
        case 'Settings':
            {
            getRef('settingLeaderboards').onchange = function(){changeSliderLabel(this.id)};
            break;
            }
        default:
            {
            //do nothing
            break;
            }
        }

    return;
    }


////////////////////////////////////////////////////////////
//
//  Will initalize the sliders on each page
//		
////////////////////////////////////////////////////////////
function changeSliderLabel(sliderID)
    {
    //Get label ID
    var labelID = sliderID + "Label";
    var currentValue = getRef(sliderID).value;

    var sliderOptions;

    //Get slider options
    switch(sliderID)
        {
        case 'oppTimeFrame':
            {
            sliderOptions = ['Past', 'Present', 'Future'];
            break;
            }
        case 'addOpportunityVolunteerLimit':
        case 'viewOpportunityVolunteerLimit':
            {
            sliderOptions = newArrayFrom1toN(14); 
            sliderOptions.push('No Limit');
            break;
            }
        case 'teamSex':
        case 'teamInfoSex':
            {
            sliderOptions = ['Male', 'Female'];
            break;
            }
        case 'includeLeaderboards':
        case 'teamInfoIncludeLeaderboards':
        case 'oppValidated':
        case 'oppOccurred':
            {
            sliderOptions = ['Yes', 'No'];
            break;
            }
        case 'viewInvolvement-validated':
            {
            sliderOptions = ['No', 'Yes'];
            break; 
            }
        case 'settingLeaderboards':
            {
            sliderOptions = ['Don\'t Include', 'Include'];
            break; 
            }
        default:
            //Do nothing
            break;
        }

    //Change slider label value
    getRef(labelID).innerHTML = sliderOptions[currentValue];

    return;
    }