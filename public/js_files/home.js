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
  //testPostRequest();

  setupWelcomePage();
  
  initLogout();
  }


////////////////////////////////////////////////////////////////////////
// 
// testing how to send a post request from javascript
//
//////////////////////////////////////////////////////////////////////// 
function testPostRequest()
  {
  var data = {value: "This is a method test"};
  handlePostMethod(data, "/test", response =>
    {
    alert(response.message);
    });

  return;
  }


////////////////////////////////////////////////////////////////////////
// 
// Will find the required data and fill the page with it 
//
//////////////////////////////////////////////////////////////////////// 
function setupWelcomePage()
  {
  //Get data for specific instituion
  //var data = institutionStats(); -- need to know the volunteer id when we login or somehow keep track of that in the backend

  //This will be the format of the data revieced and will interface front end to handle this. 
  var institutionData = {
    institution: "Simon Fraser University", 
    activeVolunteers: 2, 
    inactiveVolunteers: 374, 
    volunteerHoursGoal: 750, 
    currentVolunteerHours: 55,
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