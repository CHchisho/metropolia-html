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

function updateUser(username = null, email = null, avatar = null, favouriteRestaurant = null) {
  let body = {};
  if (username) {
    body.username = username;
  }
  if (email) {
    body.email = email;
  }
  if (avatar) {
    body.avatar = avatar;
  }
  if (favouriteRestaurant) {
    body.favouriteRestaurant = favouriteRestaurant;
  }
  console.log(body);
  return fetch(`https://media1.edu.metropolia.fi/restaurant/api/v1/users`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}