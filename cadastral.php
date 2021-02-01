<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.50.0/mapbox-gl.js'></script>
   <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.50.0/mapbox-gl.css' rel='stylesheet'/>
   <script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.min.js'></script>
   <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.css' type='text/css' />


   <div id="map" style="width: 100%; height: 400px;"></div>
   <script type="text/javascript">
       mapboxgl.accessToken= 'pk.eyJ1IjoiYXhlbGJhcmJlaHVzc29uIiwiYSI6ImNrNWZlNWE5cTJrMDczbXBnOGI4NTk2MTMifQ.5l3FgdaFC4KAGnfabyT6Kw';
       var map = new mapboxgl.Map({
           container: 'map', // container id
           style: 'mapbox://styles/mapbox/streets-v11', // style URL
           center: [2.358725729465928, 48.85651527246046], // starting position [lng, lat]
           zoom: 9 // starting zoom
       });
       var marker = new mapboxgl.Marker() // Initialize a new marker
           .setLngLat([2.358725729465928, 48.85651527246046]) // Marker [lng, lat] coordinates
           .addTo(map); // Add the marker to the map
       var southWest = new mapboxgl.LngLat(50.980121678110905, 2.1189049334210983);
       var northEast = new mapboxgl.LngLat(42.49939860553582, 3.053397589071203);
       var boundingBox = new mapboxgl.LngLatBounds(southWest, northEast);
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
       // After the map style has loaded on the page,
       // add a source layer and default styling for a single point
       map.on('load', function() {
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
           // Listen for the `result` event from the Geocoder
           // `result` event is triggered when a user makes a selection
           // Add a marker at the result's coordinates
           geocoder.on('result', function(ev) {
               map.getSource('single-point').setData(ev.result.geometry);
           });
       });
   </script>
