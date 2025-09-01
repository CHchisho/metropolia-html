var restaurants = [];
var filteredRestaurants = [];
var map = null;
var userLocation = null;
var filters = {
  city: '',
  company: '',
  search: ''
};


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
