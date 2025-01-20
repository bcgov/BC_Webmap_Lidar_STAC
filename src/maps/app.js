//import stacLayer from 'stac-layer';


const map = L.map('map').setView([53.72666830,-127.64762050], 5); 



L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

/*drawing feature*/

// Initialize the FeatureGroup to store editable layers
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialize the draw control and pass it the FeatureGroup of editable layers
const drawControl = new L.Control.Draw({
  edit: {
      featureGroup: drawnItems
  },
  draw: {
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
      // Optionally, disable other shapes, keeping only 'polygon'
  }
});
map.addControl(drawControl);

// Handle the creation of shapes
map.on(L.Draw.Event.CREATED, function (event) {
  const layer = event.layer;

  // Add the drawn layer to the feature group
  drawnItems.addLayer(layer);
});


/* file uploading feature */
//add event listener to the input
document.getElementById('file-input').addEventListener('change', function(event) {
  const files = event.target.files;
  //loop through each file
  Array.from(files).forEach(processFile);
});


function processFile(file) {
  if (file.name.endsWith('.json')) {
      // Process GeoJSON
      const reader = new FileReader();
      reader.onload = function(e) {
          const geojson = JSON.parse(e.target.result);
          const geojsonLayer=L.geoJSON(geojson).addTo(map);
          map.fitBounds(geojsonLayer.getBounds(), { padding: [50, 50], maxZoom: 15 });
      };
      reader.readAsText(file);
  } else if (file.name.endsWith('.zip')) {
      // Process Shapefile
      const reader = new FileReader();
      reader.onload = function(e) {
          shp(e.target.result).then(function(geojson) {
              const geojsonLayer=L.geoJSON(geojson).addTo(map);
              map.fitBounds(geojsonLayer.getBounds(), { padding: [50, 50], maxZoom: 15 });
          });
      };
      reader.readAsArrayBuffer(file);
  }
}

/*stac stuff that I couldn't figure out*/

//const options = {
//  resolution: 128, 
//  map
//};

//const data=fetch ('link to json')

//const stacLayer = stacLayerr(data,options);
//Layer.addTo(map);
