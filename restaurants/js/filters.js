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
