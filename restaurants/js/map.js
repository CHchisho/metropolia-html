function initMap() {
  if (map) {
    map.remove();
  }

  // create container for map
  const app = document.getElementById('app');
  // initialize map (center Helsinki)
  map = L.map('map').setView([60.1699, 24.9384], 12);

  // add OpenStreetMap layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // load restaurants data
  getRestaurants();
}

// function to update markers on the map
function updateMapMarkers() {
  if (!map) return;

  // remove all existing markers, but keep the map layer
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // find the nearest restaurant if user location is available
  const nearestRestaurant = findNearestRestaurant();
  // if (nearestRestaurant && userLocation) {
  //   console.log('nearestRestaurant', nearestRestaurant, userLocation, calculateDistance(userLocation.lat, userLocation.lng, nearestRestaurant.location.coordinates[1], nearestRestaurant.location.coordinates[0]));
  // } else {
  //   console.error('no nearest restaurant', nearestRestaurant, userLocation);
  // }

  // add markers only for filtered restaurants
  filteredRestaurants.forEach(restaurant => {
    if (restaurant.location && restaurant.location.coordinates) {
      const lat = restaurant.location.coordinates[1];
      const lng = restaurant.location.coordinates[0];

      // Create custom icon for nearest restaurant (green) or default icon
      let markerIcon;
      if (nearestRestaurant && restaurant._id === nearestRestaurant._id) {
        // Green icon for nearest restaurant
        markerIcon = L.divIcon({
          className: 'custom-marker nearest-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
      } else {
        // Default red icon for other restaurants
        markerIcon = L.divIcon({
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
      }

      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${restaurant.name}-${restaurant.company}</h3>
          <p style="margin: 5px 0; color: #666;">${restaurant.address || 'Address not specified'}</p>
          <p style="margin: 5px 0; color: #666;">${restaurant.postalCode} ${restaurant.city}</p>
          <div class="popup-buttons">
            <button onclick="showRestaurantDailyMenu('${restaurant._id}')">Daily menu</button>
            <button onclick="showRestaurantWeeklyMenu('${restaurant._id}')">Weekly menu</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    }
  });

  if (userLocation) {
    const userMarker = L.marker([userLocation.lat, userLocation.lng]).addTo(map);
    userMarker.bindPopup('<div style="text-align: center;"><strong>Your current location</strong></div>');
  }

}
