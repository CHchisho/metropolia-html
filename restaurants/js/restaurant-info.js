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
