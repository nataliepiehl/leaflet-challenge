// Function to determine size
function size(feature) {
    return Math.sqrt(Math.abs(feature.properties.mag)) * 5;
  }
  
// Function to determine color
var colors = ["#abf7c9", "#cde39a", "#ebd47c", "#f0ba78", "#e89172", "#f5696e"]
function color(feature) {
var mag = feature.properties.mag;
    if (mag <= 1) {
        return colors[0]
    }
    else if (mag <= 2) {
        return colors[1]
    }
    else if (mag <= 3) {
        return colors[2]
    }
    else if (mag <= 4) {
        return colors[3]
    }
    else if (mag <= 5) {
        return colors[4]
    }
    else {
        return colors[5]
    }
}
  
// Specify query_url to earthquake data
var query_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(query_url, function(data) {

    // Print data to console
    console.log(data);

    // Define layer
    var earthquakes = L.geoJSON(data, {

        // Create circle markers
        pointToLayer: function (feature, latlng) {
            var geojsonMarkerOptions = {
                radius: 6,
                fillColor: "#52d444",
                radius: size(feature),
                fillColor: color(feature),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
                };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },

        // Create popups
        onEachFeature: function (feature, layer) {
            return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
        }
    });

    // Define the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        // Define variables
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var labels_color = [];
        var labels_text = [];

        // Add min & max
        limits.forEach(function(limit, index) {
            labels_color.push(`<li style="background-color: ${colors[index]};"></li>`);
            labels_text.push(`<span class="legend-label">${limits[index]}</span>`)
        });

        // Add color and text
        var labels_color_html =  "<ul>" + labels_color.join("") + "</ul>";
        var labels_text_html = `<div id="labels-text">${labels_text.join("<br>")}</div>`;

        // Add legend info
        var legend_info = "<h4>Earthquake<br>Magnitude</h4>" +
            "<div class=\"labels\">" + labels_color_html + labels_text_html
            "</div>";
        div.innerHTML = legend_info;

        return div;
    };

    // Adding legend to the map
    legend.addTo(map);
})