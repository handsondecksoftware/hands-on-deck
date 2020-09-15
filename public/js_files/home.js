////////////////////////////////////////////////////////////////////////
// index.js -- frontend behaviour for the index.js view
//                  
//
// Ryan Stolys, 04/08/20
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
  setupWelcomePage();
  
  initLogout();
  }



////////////////////////////////////////////////////////////////////////
// 
// Will find the required data and fill the page with it 
//
//////////////////////////////////////////////////////////////////////// 
function setupWelcomePage()
  {
  //make call to get instiution stats
  handlePostMethod(null, "/getInstitutionStats", response =>
    {
    var institutionData;

    if(response.success)
      {
      institutionData = response.iStats;
      }
    else 
      {
      console.log("Error retriving instituiton stats." + response.errorCode);

      //Set some default values to use
      institutionData = 
        {
        institution: "Failed to load", 
        activeVolunteers: 0, 
        inactiveVolunteers: 1, 
        volunteerHoursGoal: 1, 
        currentVolunteerHours: 0,
        }
      }

    //Fill specific values for instituion
    document.getElementById('institutionName').innerHTML = institutionData.institution;
    document.getElementById('numActiveVolunteers').innerHTML = institutionData.activeVolunteers;
    document.getElementById('numInactiveVolunteers').innerHTML = institutionData.inactiveVolunteers;
    document.getElementById('volunteerHoursGoal').innerHTML = institutionData.volunteerHoursGoal;
    document.getElementById('volunteerHoursTotal').innerHTML = institutionData.currentVolunteerHours;


    //Create pie chart displaying results to user
    createVolunteersPieChart('#numberOfVolunteersPieChart', institutionData.activeVolunteers, institutionData.inactiveVolunteers);
    createVolunteerHoursPieChart('#volunteerHoursPieChart', institutionData.currentVolunteerHours, institutionData.volunteerHoursGoal);
    });

  return;
  }


////////////////////////////////////////////////////////////////////////
//
// Create pie chart with specified statistics in data
//
////////////////////////////////////////////////////////////////////////
function createVolunteersPieChart(elementID, dataElement1, dataElement2)
  {
  //If something exists, delete it
  if(document.getElementById(elementID.slice(1)).innerHTML !== "")
    {
    document.getElementById(elementID.slice(1)).innerHTML = "";
    }

  //Values for the size of the bar
  var viewWidth = 100;
  var viewHeight = 100;
  var pieWidth = 100; 
  var pieHeight = 100;
  var margin = 2;

  //Set Data and labels
  var data = {a:dataElement1, b:dataElement2};
  var labels = ['Active Volunteers', 'Inactive Volunteers'];

  //Statistical Values
  var totalVolunteers = Number(dataElement1) + Number(dataElement2); 

  var radius = Math.min(pieWidth, pieHeight) / 2 - margin;

  //Create progress barr
  var pieChart = d3.select(elementID)
    .append('svg')
    .attr('preserveAspectRatio', "xMinYMid meet")
    .attr('height', "100%")
    .attr('width', "100%")
    .attr('viewBox', "0 0 " + viewWidth + " " + viewHeight)
    .attr("svg-content", true);

  var svgData = pieChart.append("g").attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

  // set the color scale
  //              green      gray  
  colorScale = ["#1a6600", "#757575"];
  var color = d3.scaleOrdinal().domain(data).range(colorScale)

  // Compute the position of each group on the pie:
  var pie = d3.pie().value(function(d) {return d.value; })
  var data_ready = pie(d3.entries(data));

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svgData
    .selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc().innerRadius(0).outerRadius(radius))
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", 0.7);


  return;
  }


////////////////////////////////////////////////////////////////////////
//
// Create pie chart with specified statistics in data
//
////////////////////////////////////////////////////////////////////////
function createVolunteerHoursPieChart(elementID, dataElement1, dataElement2)
  {
  //If something exists, delete it
  if(document.getElementById(elementID.slice(1)).innerHTML !== "")
    {
    document.getElementById(elementID.slice(1)).innerHTML = "";
    }

  //Values for the size of the bar
  var viewWidth = 100;
  var viewHeight = 100;
  var pieWidth = 100; 
  var pieHeight = 100;
  var margin = 2;

  //Set Data and labels
  var data = {a:dataElement1, b:dataElement2};
  var labels = ['Goal', 'Current Progress'];

  //Statistical Values
  var totalVolunteers = Number(dataElement1) + Number(dataElement2); 

  var radius = Math.min(pieWidth, pieHeight) / 2 - margin;

  //Create progress barr
  var pieChart = d3.select(elementID)
    .append('svg')
    .attr('preserveAspectRatio', "xMinYMid meet")
    .attr('height', "100%")
    .attr('width', "100%")
    .attr('viewBox', "0 0 " + viewWidth + " " + viewHeight)
    .attr("svg-content", true);

  var svgData = pieChart.append("g").attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

  // set the color scale
  //              green      grey  -- can switch to yellow #cccc00
  colorScale = ["#1a6600", "#757575"];
  var color = d3.scaleOrdinal().domain(data).range(colorScale)

  // Compute the position of each group on the pie:
  var pie = d3.pie().value(function(d) {return d.value; })
  var data_ready = pie(d3.entries(data));

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svgData
    .selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc().innerRadius(0).outerRadius(radius))
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", 0.7);

  


  return;
  }