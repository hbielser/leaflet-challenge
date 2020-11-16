// Create a map using Leaflet that plots all the earthquakes from you data set based on long/lat
// Your data markers should reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. Earthquakes with higher 
// magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
// HINT the depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when a marker is clicked.
// Create a legend that will provide context for your map data.

// Creating map object
// leafletjs.com for initial view settings
var myMap = L.map('map').setView([37.8, -96], 4);
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

// Load in geojson data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab the data with d3
d3.json(url, function(response) {

    // // confirm response
    // console.log(response)

    // navigate to data
    var features = response["features"];
  
    // Loop through data
    for (var i = 0; i < features.length; i++) {
      var lat = features[i]["geometry"]["coordinates"][1];
      var long = features[i]["geometry"]["coordinates"][0];
      var depth = features[i]["geometry"]["coordinates"][2];
      var mag = features[i]["properties"]["mag"];
      var title = features[i]["properties"]["title"]

    //   console.log(mag)

      // set color scale (module 17.1, activity 7)
      var color = ""; 
        if (depth > 90) {
            color = "Red";
        }
        else if (depth > 70) {
            color = "OrangeRed";
        }
        else if (depth > 50) {
            color = "Orange";
        }
        else if (depth > 30) {
            color = "Yellow";
        }
        else if (depth > 10) {
            color = "GreenYellow";
        }
        else {
            color = "Green";
        }

      L.circle([lat, long], {
          color: color,
          fillOpacity: 0.75,
          radius: mag * 5000,
      }).bindPopup("<h1> Description: " + title + "</h1>" + "<hr>" + "<h2> Depth: " + depth + "<h2/>")
        .addTo(myMap);

        // Set up the legend - Module 17.2, activity 4
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var limits = geojson.options.limits;
            var colors = geojson.options.colors;
            var labels = [];

            // Add min & max
            var legendInfo = "<h1>Earthquake Depth Scale</h1>" +
            "<div class=\"labels\">" +
                "<div class=\"min\">" + limits[0] + "</div>" +
                "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

            div.innerHTML = legendInfo;

            limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
            });

            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
        };

        // Adding legend to the map
        legend.addTo(myMap);

    };

  });
