function getRestaurants() {
  fetch('https://media1.edu.metropolia.fi/restaurant/api/v1/restaurants')
    .then((res) => res.json())
    .then(async (data) => {
      restaurants = data;
      filteredRestaurants = [...restaurants];
      initializeFilters();

      // Get user location after loading restaurants
      try {
        await getUserLocation();
        // console.log('getUserLocation', userLocation);
      } catch (error) {
        console.log('Error getting user location:', error);
      }

      updateMapMarkers();
      createRestaurantsList();
    })
}

function getRestaurantDailyMenu(id) {
  return fetch(`https://media1.edu.metropolia.fi/restaurant/api/v1/restaurants/daily/${id}/en`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}

function getRestaurantWeeklyMenu(id) {
  return fetch(`https://media1.edu.metropolia.fi/restaurant/api/v1/restaurants/weekly/${id}/en`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      return data;
    });
}
