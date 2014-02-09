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
        [52.549336, 13.415138, 150], // S+U Schönhauser Allee (Berlin)
        [52.676231, 13.593031, 50], // S Bernau Bhf
        [52.669177, 13.564685, 50], // S Bernau-Friedenstal
        [52.659218, 13.533143, 50], // S Zepernick
        [52.648785, 13.51345, 50], // S Röntgental
        [52.636178, 13.492097, 50], // S Buch (Berlin)
        [52.614502, 13.468946, 50], // S Karow Bhf (Berlin)
        [52.591069, 13.442972, 50], // S Blankenburg (Berlin)
        [52.5782, 13.429566, 50], // S Pankow-Heinersdorf (Berlin)
        [52.567281, 13.412279, 50], // S+U Pankow (Berlin)
        [52.555032, 13.397848, 50], // S Bornholmer Str. (Berlin)
        [52.549036, 13.388045, 50], // S+U Gesundbrunnen Bhf (Berlin)
        [52.544742, 13.378726, 50], // S Humboldthain (Berlin)
        [52.53187, 13.388123, 50], // S Nordbahnhof (Berlin)
        [52.525161, 13.393068, 50], // S Oranienburger Str. (Berlin)
        [52.520134, 13.388018, 50], // S+U Friedrichstr. Bhf (Berlin)
        [52.516514, 13.380935, 50], // S+U Brandenburger Tor (Berlin)
        [52.509164, 13.377685, 50], // S+U Potsdamer Platz Bhf (Berlin)
        [52.504499, 13.382355, 50], // S Anhalter Bahnhof (Berlin)
        [52.492341, 13.372182, 50], // S Yorckstr. S2 S25 (Berlin)
        [52.476509, 13.36489, 50], // S Südkreuz Bhf (Berlin)
        [52.459239, 13.356028, 50], // S Priesterweg (Berlin)
        [52.44717, 13.360599, 50], // S Attilastr. (Berlin)
        [52.423816, 13.375021, 50], // S Marienfelde (Berlin)
        [52.410919, 13.382689, 50], // S Buckower Chaussee (Berlin)
        [52.398383, 13.390245, 50], // S Schichauweg (Berlin)
        [52.387161, 13.396796, 50], // S Lichtenrade (Berlin)
        [52.360357, 13.408472, 50], // S Mahlow
        [52.337654, 13.416026, 50], // S Blankenfelde (TF) Bhf
        [52.535539, 13.199766, 55], // S+U Rathaus Spandau (Berlin)
        [52.532481, 13.209675, 55], // S Stresow (Berlin)
        [52.510557, 13.226748, 55], // S Pichelsberg (Berlin)
        [52.511135, 13.241111, 55], // S Olympiastadion (Berlin)
        [52.508273, 13.258514, 55], // S Heerstr. (Berlin)
        [52.498771, 13.27045, 55], // S Messe Süd (Berlin)
        [52.501152, 13.283036, 55], // S Westkreuz (Berlin)
        [52.390931, 13.067171, 125], // S Potsdam Hauptbahnhof
        [52.391372, 13.094623, 125], // S Babelsberg
        [52.393904, 13.127372, 125], // S Griebnitzsee Bhf
        [52.421001, 13.177955, 125], // S Wannsee Bhf (Berlin)
        [52.431638, 13.193618, 125], // S Nikolassee (Berlin)
        [52.440117, 13.216113, 125], // S Schlachtensee (Berlin)
        [52.437166, 13.23206, 125], // S Mexikoplatz (Berlin)
        [52.431209, 13.259227, 125], // S Zehlendorf (Berlin)
        [52.436187, 13.273501, 125], // S Sundgauer Str. (Berlin)
        [52.443539, 13.295848, 125], // S Lichterfelde West (Berlin)
        [52.447552, 13.306041, 125], // S Botanischer Garten (Berlin)
        [52.455961, 13.322473, 125], // S Rathaus Steglitz (Berlin)
        [52.463578, 13.332412, 125], // S Feuerbachstr. (Berlin)
        [52.470932, 13.341759, 125], // S Friedenau (Berlin)
        [52.479811, 13.352848, 125], // S Schöneberg (Berlin)
        [52.391735, 13.514318, 75], // S Flughafen Berlin-Schönefeld Bhf
        [52.39954, 13.543222, 75], // S Grünbergallee (Berlin)
        [52.407791, 13.559602, 75], // S Altglienicke (Berlin)
        [52.435356, 13.541077, 75], // S Adlershof (Berlin)
        [52.446064, 13.524859, 75], // S Betriebsbahnhof Schöneweide (Berlin)
        [52.455045, 13.511341, 75], // S Schöneweide (Berlin)
        [52.467581, 13.489505, 75], // S Baumschulenweg (Berlin)
        [52.47883, 13.473988, 75], // S Plänterwald (Berlin)
        [52.492868, 13.460249, 75], // S Treptower Park (Berlin)
        [52.637856, 13.205047, 90], // S Hennigsdorf Bhf
        [52.625027, 13.229062, 90], // S Heiligensee (Berlin)
        [52.613347, 13.246009, 90], // S Schulzendorf (Berlin)
        [52.588881, 13.288328, 90], // S Tegel (Berlin)
        [52.577545, 13.315583, 90], // S Eichborndamm (Berlin)
        [52.578168, 13.332921, 90], // S+U Karl-Bonhoeffer-Nervenklinik (Berlin)
        [52.577969, 13.349747, 90], // S Alt-Reinickendorf (Berlin)
        [52.571855, 13.380344, 90], // S Schönholz (Berlin)
        [52.590969, 13.908891, 55], // S Strausberg Nord
        [52.579226, 13.888522, 20], // S Strausberg Stadt
        [52.549056, 13.86626, 30], // S Hegermühle
        [52.53246, 13.83381, 40], // S Strausberg Bhf
        [52.529185, 13.790627, 50], // S Petershagen Nord
        [52.526461, 13.761324, 60], // S Fredersdorf
        [52.520821, 13.69839, 70], // S Neuenhagen
        [52.518244, 13.672964, 80], // S Hoppegarten
        [52.517079, 13.64839, 90], // S Birkenstein
        [52.511961, 13.612211, 100] // S Mahlsdorf (Berlin)
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
