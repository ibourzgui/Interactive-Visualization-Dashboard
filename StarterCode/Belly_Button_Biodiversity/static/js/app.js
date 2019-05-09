function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
 
 console.log(sample);
 
  var URL = "/metadata/" + sample;
  console.log(URL);
  d3.json(URL).then(function(data) {
  // Use d3 to select the panel with id of `#sample-metadata`
  var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
  panel.html("");
  console.log(data);


    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.


  Object.entries(data).forEach(([key, value]) => {
      console.log("Appending...");
        panel.append("h6").text(`${key}: ${value}`);
       console.log(key, value);
      });

    });
    
}

// @TODO: Build a Bubble Chart using the sample data
function buildCharts(sample) {
  var URL = "/samples/"+ sample;
    // @TODO: Use `d3.json` to fetch the sample data for the plots

    console.log(sample);

  d3.json(URL).then(function(data) {

    console.log(data);
    //divided by 50 to scale down data point values
   var newvals = data.otu_ids.map(function (i) { return i/50 });


     var trace1 = {
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode:'markers',
    marker: {
    size: newvals,
    color: data.sample_values
    }
    };
  var pdata = [trace1];

  var layout = {
    
    xaxis: { title: "OTU ID"},
    yaxis: { title: "Sample Value"},
    title: " Bacterial Types Present per Sample",
    height: 800,
    width: 1800
    
  };

  Plotly.newPlot('bubble', pdata, layout);


})

}


    // @TODO: Build a Pie Chart
function buildPieChart(sample) {
    console.log(sample)
    var URL = "/samples/"+ sample;
    d3.json(URL).then(function(data) {
    var piedata = [{
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hovertext: data.otu_labels,
      type: 'pie'
    }];
    
    var layout = {
      height: 500,
      width: 500
    };
    
    Plotly.newPlot('pie', piedata, layout);
    }

    )}


    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    //Bonus: Build a guage!!


function buildGauge(wfreq) {
  // Enter the washing frequency between 0 and 180
  var level = parseFloat(wfreq) * 20;

  // Trig to calc meter point
  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = "M -.0 -0.05 L .0 0.05 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 12, color: "850000" },
      showlegend: false,
      name: "Freq",
      text: level,
      hoverinfo: "text+name"
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];

  var layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };

  var GAUGE = document.getElementById("gauge");
  Plotly.newPlot(GAUGE, data, layout);
}



function init() {
  // Grab a reference to the dropdown select element
  //var sampleNames;
  var selector = d3.select("#selDataset");
  console.log("His");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

   // console.log(sampleNames)
       // Use the first sample from the list to build the initial plots
       const firstSample = sampleNames[0];
       console.log(firstSample);
       buildMetadata(firstSample);
       buildCharts(firstSample);
       buildPieChart(firstSample);
       buildGauge(firstSample);


  });
  

 

    //buildCharts(firstSample);
  
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  //buildCharts(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
  buildPieChart(newSample);
  buildGauge(newSample);
  

}

// Initialize the dashboard
init();
