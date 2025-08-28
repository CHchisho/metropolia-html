var restaurants = [];
var filteredRestaurants = [];
var map = null;
var userLocation = null;
var filters = {
  city: '',
  company: '',
  search: ''
};


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


function showRestaurantDailyMenu(id) {
  getRestaurantDailyMenu(id).then(data => {
    const app = document.getElementById('restaurant-info');
    app.innerHTML = `
      <div class="restaurant-info-bg">
        <div class="restaurant-info-content">
          <button class="close-button" onclick="closeRestaurantDetails()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
          <h2>Daily Menu</h2>
          ${createMenuTable(data)}
        </div>
      </div>
    `;
  });
}

function showRestaurantWeeklyMenu(id) {
  getRestaurantWeeklyMenu(id).then(data => {
    const app = document.getElementById('restaurant-info');
    app.innerHTML = `
      <div class="restaurant-info-bg">
        <div class="restaurant-info-content">
          <button class="close-button" onclick="closeRestaurantDetails()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
          <h2>Weekly Menu</h2>
          ${createWeeklyMenuTable(data)}
        </div>
      </div>
    `;
  });
}

function closeRestaurantDetails() {
  const app = document.getElementById('restaurant-info');
  app.innerHTML = '';
}

// function to create daily menu table
function createMenuTable(menuData) {
  if (!menuData || !menuData.courses || menuData.courses.length === 0) {
    return '<p>No menu data available</p>';
  }

  let tableHTML = `
    <div class="menu-table-container">
      <table class="menu-table">
        <thead>
          <tr>
            <th>Dish</th>
            <th>Price</th>
            <th>Dietary Info</th>
          </tr>
        </thead>
        <tbody>
  `;

  menuData.courses.forEach(course => {
    const diets = course.diets ? (typeof course.diets === 'string' ? course.diets : course.diets.join(', ')) : '';
    tableHTML += `
      <tr>
        <td class="dish-name">${course.name}</td>
        <td class="dish-price">${course.price || ''}</td>
        <td class="dish-diets">${diets}</td>
      </tr>
    `;
  });

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  return tableHTML;
}

// function to create weekly menu table
function createWeeklyMenuTable(menuData) {
  console.log('menuData', menuData);
  if (!menuData || !Array.isArray(menuData.days) || menuData.days.length === 0) {
    return '<p>No weekly menu data available</p>';
  }

  let tableHTML = '<div class="weekly-menu-container">';

  menuData.days.forEach(day => {
    tableHTML += `
      <div class="day-menu">
        <h3 class="day-title">${day.date}</h3>
        <div class="menu-table-container">
          <table class="menu-table">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Price</th>
                <th>Dietary Info</th>
              </tr>
            </thead>
            <tbody>
    `;

    day.courses.forEach(course => {
      const diets = course.diets ? (typeof course.diets === 'string' ? course.diets : course.diets.join(', ')) : '';
      tableHTML += `
        <tr>
          <td class="dish-name">${course.name}</td>
		  <td class="dish-price">${course.price || ''}</td>
          <td class="dish-diets">${diets}</td>
        </tr>
      `;
    });

    tableHTML += `
            </tbody>
          </table>
        </div>
      </div>
    `;
  });

  tableHTML += '</div>';
  return tableHTML;
}

// function to initialize filters
function initializeFilters() {
  // get unique cities
  const cities = [...new Set(restaurants.map(r => r.city).filter(city => city))].sort();
  const cityFilter = document.getElementById('city-filter');

  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });

  // get unique companies
  const companies = [...new Set(restaurants.map(r => r.company).filter(company => company))].sort();
  const companyFilter = document.getElementById('company-filter');

  companies.forEach(company => {
    const option = document.createElement('option');
    option.value = company;
    option.textContent = company;
    companyFilter.appendChild(option);
  });

  // add event listeners
  document.getElementById('city-filter').addEventListener('change', applyFilters);
  document.getElementById('company-filter').addEventListener('change', applyFilters);
  document.getElementById('search-filter').addEventListener('input', applyFilters);
  document.getElementById('clear-filters').addEventListener('click', clearFilters);

  // add functionality to toggle filters panel
  const toggleFiltersButton = document.getElementById('toggle-filters');
  const filtersContent = document.getElementById('filters-content');
  const toggleText = toggleFiltersButton.querySelector('.toggle-text');
  const toggleIcon = toggleFiltersButton.querySelector('.toggle-icon');

  toggleFiltersButton.addEventListener('click', function () {
    const isHidden = filtersContent.classList.contains('collapsed');

    if (isHidden) {
      filtersContent.classList.remove('collapsed');
      toggleText.textContent = 'Hide';
      toggleIcon.textContent = '▼';
    } else {
      filtersContent.classList.add('collapsed');
      toggleText.textContent = 'Show';
      toggleIcon.textContent = '▶';
    }
  });
}

// function to apply filters
function applyFilters() {
  const cityFilter = document.getElementById('city-filter').value;
  const companyFilter = document.getElementById('company-filter').value;
  const searchFilter = document.getElementById('search-filter').value.toLowerCase();

  filters.city = cityFilter;
  filters.company = companyFilter;
  filters.search = searchFilter;

  filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCity = !cityFilter || restaurant.city === cityFilter;
    const matchesCompany = !companyFilter || restaurant.company === companyFilter;
    const matchesSearch = !searchFilter ||
      restaurant.name.toLowerCase().includes(searchFilter) ||
      restaurant.company.toLowerCase().includes(searchFilter) ||
      (restaurant.address && restaurant.address.toLowerCase().includes(searchFilter));

    return matchesCity && matchesCompany && matchesSearch;
  });

  // update restaurants list
  createRestaurantsList();
  // update markers on the map
  updateMapMarkers();
  // update filter results counter
  updateFilterResults();
}

// function to clear filters
function clearFilters() {
  document.getElementById('city-filter').value = '';
  document.getElementById('company-filter').value = '';
  document.getElementById('search-filter').value = '';

  filters.city = '';
  filters.company = '';
  filters.search = '';

  filteredRestaurants = [...restaurants];
  createRestaurantsList();
  updateMapMarkers();
  updateFilterResults();
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
  if (nearestRestaurant && userLocation) {
    console.log('nearestRestaurant', nearestRestaurant, userLocation, calculateDistance(userLocation.lat, userLocation.lng, nearestRestaurant.location.coordinates[1], nearestRestaurant.location.coordinates[0]));
  } else {
    console.error('no nearest restaurant', nearestRestaurant, userLocation);
  }

  console.log('filteredRestaurants');
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

// function to update filter results counter
function updateFilterResults() {
  const resultsElement = document.getElementById('filter-results');
  const totalCount = restaurants.length;
  const filteredCount = filteredRestaurants.length;

  if (filteredCount === totalCount) {
    resultsElement.textContent = `Displayed ${totalCount} restaurants`;
  } else {
    resultsElement.textContent = `Displayed ${filteredCount} of ${totalCount} restaurants`;
  }
}

// function to create restaurants list
function createRestaurantsList() {
  const restaurantsListContainer = document.getElementById('restaurants-list');


  let listHTML = `
    <div class="restaurants-list-container">
      <div class="restaurants-header">
        <h2>Restaurants list</h2>
        <button id="toggle-restaurants" class="toggle-button">
          <span class="toggle-text">Hide</span>
          <span class="toggle-icon">▼</span>
        </button>
      </div>
      <div class="restaurants-grid" id="restaurants-grid">
  `;

  if (!filteredRestaurants || filteredRestaurants.length === 0) {
    listHTML += '<p>No restaurants found</p>';
  } else {
    filteredRestaurants.forEach(restaurant => {
      listHTML += `
      <div class="restaurant-card">
        <div class="restaurant-header">
          <h3 class="restaurant-name">${restaurant.name}</h3>
          <span class="restaurant-company">${restaurant.company}</span>
        </div>
        <div class="restaurant-info">
          <p class="restaurant-address">
            <strong>Address:</strong> ${restaurant.address || 'Not specified'}
          </p>
          <p class="restaurant-location">
            <strong>City:</strong> ${restaurant.city} ${restaurant.postalCode}
          </p>
        </div>
        <div class="restaurant-actions">
          <button onclick="showRestaurantDailyMenu('${restaurant._id}')" class="menu-button">
            Daily menu
          </button>
          <button onclick="showRestaurantWeeklyMenu('${restaurant._id}')" class="menu-button">
            Weekly menu
          </button>
        </div>
      </div>
    `;
    });
  }

  listHTML += `
      </div>
    </div>
  `;

  restaurantsListContainer.innerHTML = listHTML;

  // update filter results counter
  updateFilterResults();

  // add functionality to toggle restaurants list
  const toggleButton = document.getElementById('toggle-restaurants');
  const restaurantsGrid = document.getElementById('restaurants-grid');
  const toggleText = toggleButton.querySelector('.toggle-text');
  const toggleIcon = toggleButton.querySelector('.toggle-icon');

  toggleButton.addEventListener('click', function () {
    const isHidden = restaurantsGrid.classList.contains('collapsed');

    if (isHidden) {
      restaurantsGrid.classList.remove('collapsed');
      toggleText.textContent = 'Hide';
      toggleIcon.textContent = '▼';
    } else {
      restaurantsGrid.classList.add('collapsed');
      toggleText.textContent = 'Show';
      toggleIcon.textContent = '▶';
    }
  });
}

// initialization on start
document.addEventListener('DOMContentLoaded', function () {
  initMap();
});
