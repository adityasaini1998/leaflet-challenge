console.log("Initializing map setup");

let mainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
});

let earthquakeMap = L.map('map', {
  center: [40.7, -94.5],
  zoom: 3
});

mainLayer.addTo(earthquakeMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (earthquakeData) {
  function earthquakeStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: depthColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: magnitudeRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function depthColor(depth) {
    switch (true) {
      case depth > 90: return "#ea2c2c";
      case depth > 70: return "#ea822c";
      case depth > 50: return "#ee9c00";
      case depth > 30: return "#eecc00";
      case depth > 10: return "#d4ee00";
      default: return "#98ee00";
    }
  }

  function magnitudeRadius(magnitude) {
    return magnitude === 0 ? 1 : magnitude * 4;
  }

  L.geoJson(earthquakeData, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng),
    style: earthquakeStyle,
    onEachFeature: (feature, layer) => {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
    }
  }).addTo(earthquakeMap);

  let mapLegend = L.control({ position: "bottomright" });
  mapLegend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    const depthLevels = [-10, 10, 30, 50, 70, 90];
    const colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    for (let i = 0; i < depthLevels.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + depthLevels[i] + (depthLevels[i + 1] ? "&ndash;" + depthLevels[i + 1] + "<br>" : "+");
    }
    return div;
  };
  mapLegend.addTo(earthquakeMap);
});



