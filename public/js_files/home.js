////////////////////////////////////////////////////////////////////////
// home.js -- frontend behaviour for the home.js view
//                  
//
// Ryan Stolys, 04/08/20
//    - File Created
//    - Intial behaviour 
//
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// 
// initialize page
//
//////////////////////////////////////////////////////////////////////// 
function init()
    {
    setupWelcomePage();

    initLogout();       //In General
    }



////////////////////////////////////////////////////////////////////////
// 
// Will collected instituion data and add to page
//
//////////////////////////////////////////////////////////////////////// 
function setupWelcomePage()
    {
    try 
        {
        setLoaderVisibility(true);
        handleAPIcall(null, "/api/getInstitutionInfo", response =>
            {
            var iInfo;
    
            if(response.success)
                {
                iInfo = response.iInfo;
                }
            else 
                {
                printUserErrorMessage(response.errorcode);
    
                //Set some default values to use
                iInfo = {
                    id: -1, 
                    name: "Could Not Load", 
                    location: "Could Not Load", 
                    numvolunteers: "Unkown",
                    totalhours: "Unkown",
                    };
                }
    
            getRef("instituionName").innerHTML = iInfo.name;
            getRef("numVolunteers").innerHTML = iInfo.numvolunteers;
            getRef("totalHours").innerHTML = iInfo.totalhours;
    
            setLoaderVisibility(false);
            });
        }
    catch (error)
        {
        console.log(error.message);
        alert("An unexpected issue occured loading the page. Please try again");
        setLoaderVisibility(false);
        }
    }



/*
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
  }
*/