var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoibmVpbWljYWwiLCJhIjoiY2swN2lobmdiMDNvNTNtcXpoOGRtOWZ1diJ9.wZGXuTeMlu_qSp66FDvmRg"
}).addTo(myMap);




// Store our API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//  GET color radius call to the query URL
d3.json(queryUrl, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
    function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }
    // GeoJSON layer
  L.geoJson(data, {
    // Maken cricles
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // cirecle style
    style: styleInfo,
    // popup for each marker
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);

  // an object legend
  var legend = L.control({
    position: "bottomright"
  });

  // details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping through
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(myMap);
});

//function createMarkers(features) {
//
//  // Pull the "stations" property off of response.data
//  var mag = features.properties.mag;
//
//  // Initialize an array to hold bike markers
//  var earthquakes = [];
//
//  // Loop through the stations array
//  for (var index = 0; index < mag.length; index++) {
//    var earthquakes = mag[index];
//
//    // For each station, create a marker and bind a popup with the station's name
//    var earthquake = L.marker([mag.lat, mag.lon])
//      .bindPopup("<h3>" + properties.title);
//
//    // Add the marker to the bikeMarkers array
//    earthquakes.push(earthquake);
//  }
//
//  // Create a layer group made from the bike markers array, pass it into the createMap function
//  createMap(L.layerGroup(earthquakes));
//}


// Perform an API call to the earthquake data API to get earthquake information. Call createMarkers when complete
//d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);