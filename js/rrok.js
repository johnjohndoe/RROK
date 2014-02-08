$( document ).ready(function() {

    var map = L.map('map').setView([52.516667, 13.383333], 10);

    L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    }).addTo(map);

    var popup = L.popup();
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }
    map.on('click', onMapClick);

    nameToColor = function(name) {
        switch (name) {
            case 'S-Bahnlinie S1': return "#DD4DAE";
            case 'S-Bahnlinie S2': return "#108449";
            case 'S-Bahnlinie S25': return "#108449";
            case 'S-Bahnlinie S3': return "#166AB8";
            case 'S-Bahnlinie S41': return "#A23F30";
            case 'S-Bahnlinie S42': return "#BF8037";
            case 'S-Bahnlinie S45': return "#BF8037";
            case 'S-Bahnlinie S46': return "#BF8037";
            case 'S-Bahnlinie S47: S Hermannstraße => S Spindlersfeld': return "#BF8037";
            case 'S-Bahnlinie S5': return "#F36717";
            case 'S-Bahnlinie S7': return "#7760B0";
            case 'S-Bahnlinie S75': return "#7760B0";
            case 'S-Bahnlinie S8': return "#55B831";
            case 'S-Bahnlinie S85': return "#55B831";
            case 'S-Bahnlinie S9': return "#942440";
            default: throw "Cannot match name '" + name + "' to color."
        }
    }

    renderGeoJson = function(link) {
        var url = $(link).attr("href");
        $.getJSON(url, function(data) {
            var feature = data.features[0];
            var color = nameToColor(feature.properties.name);
            var geojson = L.geoJson(data, {
                style: {
                    type: "LineString",
                    color: color,
                    weight: 3,
                    opacity: 0.75
                }
            });
            geojson.addTo(map);
        });
    }

    renderMarker = function(link) {
        var url = $(link).attr("href");
        $.getJSON(url, function(data) {
            var feature = data.features[0];
            var name = feature.properties.name;
            L.geoJson(data, {
                style: function (feature) {
                    return { color: "#ff0000" };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.name);
                }
            }).addTo(map);
        });
    }



    var transportationLineLinks = $('link[rel="transportation-line"]');
    for (var i = 0; i < transportationLineLinks.length; i++) {
        var transportationLineLink = transportationLineLinks[i];
        renderGeoJson(transportationLineLink);
    }

    var stationLinks = $('link[rel="stations"]');
    for (var i = 0; i < stationLinks.length; i++) {
        var stationLink = stationLinks[i];
        renderMarker(stationLink);
    }

});
