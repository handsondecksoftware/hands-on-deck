////////////////////////////////////////////////////////////
// slider.js -- changes slider label text  
//                   
//  Ryan Stolys,	17/07/20
//    - File Created 
//		
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
//
//  Will initalize the sliders on each page
//		
////////////////////////////////////////////////////////////
function initSlider(pageName)
  {
  switch(pageName)
    {
    case 'Oppourtunties':
        {
        document.getElementById('oppTimeFrame').onclick = function(){changeSliderLabel(this.id)};

        break;
        } 
    default:
      //do nothing
      break;
    }
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
  var currentValue;
  var sliderOptions;

  //Based on current values of label, find new values 
  switch(sliderID)
    {
    case 'oppTimeFrame':
      currentValue = document.getElementById(sliderID).value;
      sliderOptions = ['Past', 'Present', 'Future'];
      break;
    }

  //Change slider label value
  document.getElementById(labelID).innerHTML = sliderOptions[currentValue - 1];

  return;
  }