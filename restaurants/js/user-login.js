let isUserLoggedIn = false;
let currentUser = null;
let isLoginMode = true; // true for login, false for registration


// Function for toggling between login and registration modes
function toggleMode() {
  isLoginMode = !isLoginMode;
  const dialogTitle = document.getElementById('dialog-title');
  const emailField = document.getElementById('login-user-email');
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');

  if (isLoginMode) {
    dialogTitle.textContent = 'Kirjaudu sisään';
    emailField.classList.add('hidden');
    emailField.removeAttribute('required');
    // loginButton.style.display = 'inline-block';
    registerButton.style.display = 'inline-block';
  } else {
    dialogTitle.textContent = 'Rekisteröidy';
    emailField.classList.remove('hidden');
    emailField.setAttribute('required', 'required');
    // loginButton.style.display = 'none';
    registerButton.style.display = 'inline-block';
  }
}

// Function for checking the availability of a username
function CheckUserNameValid() {
  const userName = document.getElementById('login-user-name').value.trim();

  return fetch(`https://media1.edu.metropolia.fi/restaurant/api/v1/users/available/${userName}`)
    .then(async (res) => {
      let data = await res.json();
      if (res.status !== 200) {
        throw new Error('Server error. Try again later!');
      }
      console.log('CheckUserNameValid', data);
      if (data.available === false) {
        // alert('This username already exists!');
        throw new Error('This username already exists!');
      }
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
}

// Function for checking the availability of a username
function GetCurrentUserByToken(token) {
  return fetch(`https://media1.edu.metropolia.fi/restaurant/api/v1/users/token`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(async (res) => {
      let data = await res.json();
      if (res.status !== 200) {
        throw new Error('Server error. Try again later!');
      }
      console.log('GetCurrentUserByToken', data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

// Function for logging in a user
async function loginUser() {
  const username = document.getElementById('login-user-name').value.trim();
  const password = document.getElementById('login-user-password').value;

  if (!username || !password) {
    alert('Please fill all fields');
    return;
  }

  try {
    const response = await fetch('https://media1.edu.metropolia.fi/restaurant/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);

      // Save the token and user data
      localStorage.setItem('authToken', data.token);
      currentUser = data.data;
      isUserLoggedIn = true;

      // Close the dialog
      document.getElementById('user-login-dialog').close();
      isUserLoginDialogOpen = false;

      // Update the UI
      updateUserUI();

    } else {
      const errorData = await response.json();
      alert(`Error in login: ${errorData.message || 'Invalid credentials'}`);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Error in login. Please try again.');
  }
}

// Function for registering a user
async function registerUser() {
  const username = document.getElementById('login-user-name').value.trim();
  const email = document.getElementById('login-user-email').value.trim();
  const password = document.getElementById('login-user-password').value;

  if (!username || !email || !password) {
    alert('Please fill all fields');
    return;
  }

  // Check the availability of a username
  const isUsernameAvailable = await CheckUserNameValid();
  if (!isUsernameAvailable) {
    alert('This username is already taken');
    return;
  }
  // return;

  try {
    const response = await fetch('https://media1.edu.metropolia.fi/restaurant/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Registration successful:', data);

      alert('Registration successful! Check your email for account activation.');

      // Switch to login mode
      toggleMode();
    } else {
      const errorData = await response.json();
      alert(`Registration error: ${errorData.message || 'Please try again'}`);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Error in registration. Please try again.');
  }
}

// Function for logging out a user
function logoutUser() {
  localStorage.removeItem('authToken');
  currentUser = null;
  isUserLoggedIn = false;
  updateUserUI();
  document.getElementById('user-info-dialog').close();
  alert('You have logged out');
}

// Function for updating the UI depending on the user status
function updateUserUI() {
  const userButton = document.getElementById('header-user-button');

  if (isUserLoggedIn && currentUser) {
    userButton.innerHTML = `<i class="bi bi-person-check-fill"></i> ${currentUser.username}`;
    userButton.title = `Login as ${currentUser.username}`;
  } else {
    userButton.innerHTML = '<i class="bi bi-person-fill"></i>';
    userButton.title = 'Login to the system';
  }
}

// Event handlers
document.addEventListener('DOMContentLoaded', async function () {
  // Event handler for the login button
  document.getElementById('login-button').addEventListener('click', function () {
    if (isLoginMode) {
      // If in login mode, login
      loginUser();
    } else {
      // If in registration mode, switch to login mode
      toggleMode();
    }
  });

  // Event handler for the registration button
  document.getElementById('register-button').addEventListener('click', function () {
    if (isLoginMode) {
      // If in login mode, switch to registration mode
      toggleMode();
    } else {
      // If in registration mode, register
      registerUser();
    }
  });

  // Event handler for the form (prevent default submission)
  document.getElementById('user-form').addEventListener('submit', function (e) {
    e.preventDefault();
  });

  // Event handler for the user button in the header
  let isUserLoginDialogOpen = false;
  document.getElementById('header-user-button').addEventListener('click', function () {
    if (isUserLoggedIn) {
      document.getElementById('user-info-dialog').showModal();
      updateUserInfo();
    } else {
      // If the user is not logged in, open the dialog
      if (isUserLoginDialogOpen) {
        document.getElementById('user-login-dialog').close();
        isUserLoginDialogOpen = false;
      } else {
        // Reset the form and switch to login mode
        document.getElementById('user-form').reset();
        if (!isLoginMode) {
          toggleMode();
        }
        document.getElementById('user-login-dialog').showModal();
        isUserLoginDialogOpen = true;
      }
    }
  });

  document.getElementById('logout-button').addEventListener('click', function () {
    if (confirm('Do you want to logout?')) {
      logoutUser();
    }
  });

  // Event handler for the close dialog button
  document.getElementById('close-user-login-dialog-button').addEventListener('click', function () {
    document.getElementById('user-login-dialog').close();
    isUserLoginDialogOpen = false;
  });

  if (localStorage.getItem('authToken')) {
    currentUser = await GetCurrentUserByToken(localStorage.getItem('authToken'));
    isUserLoggedIn = true;
    updateUserUI();
  }

  // Initialization of UI
  updateUserUI();

  // Initialization of login mode (hide the email field)
  const emailField = document.getElementById('login-user-email');
  emailField.classList.add('hidden');
  emailField.removeAttribute('required');
});
