// Function to get user's current location
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('User location obtained:', userLocation);

          resolve(userLocation);
        },
        (error) => {
          console.log('Error getting location:', error);
          userLocation = null;
          reject(error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser');
      userLocation = null;
      reject(new Error('Geolocation not supported'));
    }
  });
}


// Function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const kmPerDegree = 111;
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const distance = Math.sqrt(dLat * dLat + dLon * dLon) * kmPerDegree;
  return distance;
}


// Function to find the nearest restaurant
function findNearestRestaurant() {
  if (!userLocation || !filteredRestaurants || filteredRestaurants.length === 0) {
    return null;
  }

  let nearestRestaurant = null;
  let minDistance = Infinity;

  filteredRestaurants.forEach(restaurant => {
    if (restaurant.location && restaurant.location.coordinates) {
      const lat = restaurant.location.coordinates[1];
      const lng = restaurant.location.coordinates[0];
      const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);

      if (distance < minDistance) {
        minDistance = distance;
        nearestRestaurant = restaurant;
      }
    }
  });

  return nearestRestaurant;
}
