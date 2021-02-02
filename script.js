mapboxgl.accessToken = 'k.eyJ1IjoiYXhlbGJhcmJlaHVzc29uIiwiYSI6ImNrNWZlNWE5cTJrMDczbXBnOGI4NTk2MTMifQ.5l3FgdaFC4KAGnfabyT6Kw';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/danswick/cilnegnzr00439gkf7urxz0xk', // style URL
  center: [2.358725729465928, 48.85651527246046], // starting position [lng, lat]
  zoom: 9 // starting zoom
});
var marker = new mapboxgl.Marker() // Initialize a new marker
    .setLngLat([2.358725729465928, 48.85651527246046]) // Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map

var geocoder = new MapboxGeocoder({ // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false, // Do not use the default marker style
    placeholder: 'Votre adresse', // Placeholder text for the search bar
    bbox: [ -4.79556, 2.5328, 48.96722, 51.0891], // Boundary for Berkeley
    proximity: {
        longitude: 2.358725729465928,
        latitude: 48.85651527246046
    } // Coordinates of UC Berkeley
});
map.addControl(geocoder);
  map.on('load', function () {
    map.addSource('single-point', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
        });
        map.addLayer({
            id: 'point',
            source: 'single-point',
            type: 'circle',
            paint: {
                'circle-radius': 10,
                'circle-color': '#448ee4'
            }
        });
        geocoder.on('result', function(ev) {
            map.getSource('single-point').setData(ev.result.geometry);
        });
  var switchy = document.getElementById('remover');
    switchy.addEventListener("click", function(){
        switchy = document.getElementById('remover');
        if (switchy.className === 'on') {
            switchy.setAttribute('class', 'off');
            map.setLayoutProperty('mapbox-mapbox-satellite', 'visibility', 'none');
            switchy.innerHTML = 'satellite';
        } else {
            switchy.setAttribute('class', 'on');
            map.setLayoutProperty('mapbox-mapbox-satellite', 'visibility', 'visible');
            switchy.innerHTML = 'Plan';
        }
    });

    map.getCanvas().style.cursor = 'default';
    map.getCanvas().style.cursor = 'default';
    var layers = ['Zone naturelle', 'Zone agricole', 'Zone à urbaniser - ouverte','Zone à urbaniser - bloquée', 'Zone urbaine'];
    var colors = ['#56AA02', '#FFFF00', '#FECCBE', '#FF6565', '#e60000'];
    for (i=0; i<layers.length; i++) {
        var layer = layers[i] ;
        var color = colors[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;
        var value = document.createElement('span');
        value.innerHTML = layer;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    }




    //CADASTRE

map.addSource('Cadastre', {
        type: 'vector',
        url: 'mapbox://mastersigat.9yc1xho2'
    });

map.addLayer({
        'id': 'Cadastre',
        'type': 'line',
        'source': 'Cadastre',
        'source-layer': 'Cadastre-cz7x03',
        'layout': {'visibility': 'none',
        'line-join': 'round','line-cap': 'round'},
       "paint": {"line-color": "#FFFFFF", "line-width": {'base': 1,'stops': [[12,0.1], [22, 1]]}}
});


   // CONTOURS RM

 map.addSource('RM', {
   type: 'vector',
   url: 'mapbox://ninanoun.3nmwp9pz'});

  map.addLayer({
        "id": "Contours",
        "type": "line",
        "source": "RM",
        "layout": {'visibility': 'visible'},
        "source-layer": "RM-7zoiyr",
        "paint": {"line-color": "#000000", "line-width": 1}
    });




    //BATIMENTS

map.addSource('Batiments', {
        type: 'vector',
        url: 'mapbox://ninanoun.dv8c33g9'
    });

  map.addLayer({
    'id': 'Batiments',
    'type': 'fill-extrusion',
    'source': 'Batiments',
    'source-layer': 'BatiPLU-d5t2q3',
    'layout': {'visibility': 'visible'},
 'paint':
   {'fill-extrusion-color': ['match',['get', 'typezone'],
                'N', '#56AA02',
                'Nh', '#56AA02',
                'AUc', '#FECCBE',
                'A', '#FFFF00',
                'AUs', '#FF6565',
       'U', '#e60000', '#ccc'
       ],
    'fill-extrusion-height':{'type': 'identity','property': 'HAUTEUR'},
    'fill-extrusion-opacity': 0.90,
          'fill-extrusion-base': 0}
    });



 //COnfiguration changement des couches


        switchlayer = function (lname) {
            if (document.getElementById(lname + "CB").checked) {
                map.setLayoutProperty(lname, 'visibility', 'visible');
            } else {
                map.setLayoutProperty(lname, 'visibility', 'none');
           }
        }

    });


    // Configuration fenêtre d'informations
    map.on('mousemove', function (e) {
        var states = map.queryRenderedFeatures(e.point, {
            layers: ['Batiments']
        });

        if (states.length > 0) {
            document.getElementById('pd').innerHTML = "<h4>Hauteur : </strong><p><strong><em>"+ states[0].properties.HAUTEUR + "</strong> mètres </p>"
                          + "Superficie : </strong><p><strong><em>"+ states[0].properties.Shape_Area + "</strong> m2 </p>"
                          + "Zonage : </strong><p><strong><em>"+ states[0].properties.typezone + "</strong></p>"
                          + "Libellé du zonage : </strong><p><strong><em>"+ states[0].properties.libelle + "</strong></p>"
                          + "ID Zone</strong><p><strong><em>"+ states[0].properties.idzone + "</strong></p></h4>";
        } else {document.getElementById('pd').innerHTML = '<p>Données : IGN et Rennes Metropole / OSM</p>';}
    });

map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 120,
    unit: 'metric'}));



var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');



// Config affichage boutons

document.getElementById('3D').addEventListener('click', function ()
{ map.flyTo({
 pitch: 50,
 bearing: -30 });
  map.setLayoutProperty('extrude', 'visibility', 'visible');
});

document.getElementById('2D').addEventListener('click', function ()
{ map.flyTo({pitch: 0, bearing: 0});
  map.setLayoutProperty('classique', 'visibility', 'visible');
    map.setLayoutProperty('extrude', 'visibility', 'none');

});
document.getElementById('Satellite').addEventListener('click', function ()
{ map.flyTo({pitch: 0, bearing: 0});
  map.setLayoutProperty('classique', 'visibility', 'visible');
    map.setLayoutProperty('extrude', 'visibility', 'none');

});
