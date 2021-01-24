mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11', // stylesheet location
  center: camp.geometry.coordinates, // camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
.setLngLat(camp.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
          .setHTML(`<h3>${camp.title}</h3><p>${camp.location}</p>`))
.addTo(map);
