$( document ).ready(function() {



    var map = L.map('map').setView([52.516667, 13.383333], 10);

    var osmLayer = L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    });

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

            case 'U-Bahnlinie U1': return "#54832F";
            case 'U-Bahnlinie U2': return "#D71910";
            case 'U-Bahnlinie U3': return "#2F989A";
            case 'U-Bahnlinie U4': return "#FFE92A";
            case 'U-Bahnlinie U5': return "#5B1F10";
            case 'U-Bahnlinie U55': return "#5B1F10";
            case 'U-Bahnlinie U6': return "#7F3973";
            case 'U-Bahnlinie U7': return "#0099CC";
            case 'U-Bahnlinie U8': return "#181953";
            case 'U-Bahnlinie U9': return "#FF5A22";

            default: throw "Cannot match name '" + name + "' to color."
        }
    }

    var transportationLineLayer = new L.LayerGroup();

    renderTransportationLine = function(link) {
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
            geojson.addTo(transportationLineLayer);
        });
    }


    var stationLayer = new L.LayerGroup();


    renderMarker = function(link) {
        var url = $(link).attr("href");
        $.getJSON(url, function(data) {
            var feature = data.features[0];
            var name = feature.properties.name;
            var marker = L.geoJson(data, {
                style: function (feature) {
                    return { color: "#ff0000" };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.name);
                }
            });
            marker.addTo(stationLayer);
        });
    }



    var transportationLineLinks = $('link[rel="transportation-line"]');
    for (var i = 0; i < transportationLineLinks.length; i++) {
        var transportationLineLink = transportationLineLinks[i];
        renderTransportationLine(transportationLineLink);
    }

    var stationLinks = $('link[rel="stations"]');
    for (var i = 0; i < stationLinks.length; i++) {
        var stationLink = stationLinks[i];
        renderMarker(stationLink);
    }


    //custom size for this example, and autoresize because map style has a percentage width
    var heatmap = new L.TileLayer.WebGLHeatMap({
        size: 1000,
        autoresize: true
    });

    // dataPoints is an array of arrays: [[lat, lng, intensity]...]
    var dataPoints = [
        [52.435356, 13.541077, 177], // S Adlershof (Berlin)
        [52.570177, 13.565729, 164], // S Ahrensfelde Bhf (Berlin)
        [52.549336, 13.415138, 1000] // S+U Schönhauser Allee (Berlin)
    ];

    for (var i = 0, len = dataPoints.length; i < len; i++) {
        var point = dataPoints[i];
        heatmap.addDataPoint(
            point[0],
            point[1],
            point[2]
        );
    }
    // alternatively, you can skip the for loop and add the whole dataset with heatmap.setData(dataPoints)

    map.addLayer(osmLayer);
    map.addLayer(transportationLineLayer);
    map.addLayer(stationLayer);
    map.addLayer(heatmap);

    var baseLayers = {
     "Map": osmLayer
    };

    var overlays = {
     "U-Bahn & S-Bahn Stationen": stationLayer,
     "U-Bahn & S-Bahn Linien": transportationLineLayer,
     "Heatmap": heatmap
    };

    L.control.layers(null, overlays).addTo(map);

});
