const DEFAULT_AVATAR = 'https://static.vecteezy.com/system/resources/previews/043/361/860/non_2x/hand-drawnman-avatar-profile-icon-for-social-networks-forums-and-dating-sites-user-avatar-profile-placeholder-anonymous-user-male-no-photo-web-template-default-user-picture-profile-male-symbol-free-vector.jpg';


// Event handler for the user button in the header
document.getElementById('close-user-info-dialog-button').addEventListener('click', function () {
  document.getElementById('user-info-dialog').close();
});

document.getElementById('edit-user-info-button').addEventListener('click', function () {
  document.getElementById('user-info-dialog').close();
  document.getElementById('user-edit-dialog').showModal();
  updateUserEdit();
});

document.getElementById('close-user-edit-dialog-button').addEventListener('click', function () {
  document.getElementById('user-edit-dialog').close();
});

document.getElementById('user-edit-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  
  // Check form validity
  if (!this.checkValidity()) {
    this.reportValidity(); // Show standard validation messages
    return;
  }
  
  const username = document.getElementById('edit-user-name').value;
  const email = document.getElementById('edit-user-email').value;
  const avatar = document.getElementById('edit-user-avatar').value;
  
  await updateUser(username || null, email || null, avatar || null);
  document.getElementById('user-edit-dialog').close();
  currentUser = await GetCurrentUserByToken(localStorage.getItem('authToken'));
});


function updateUserInfo() {
  const userInfoContent = document.getElementById('user-info-dialog').querySelector('.user-info-content');
  if (currentUser) {
    let htmlContent = '';
    if (currentUser.avatar) {
      htmlContent += `<img src="${currentUser.avatar || DEFAULT_AVATAR}" alt="Avatar">`;
    }
    htmlContent += `
    <div>
      <div><p>Username:</p><p>${currentUser.username}</p></div>
      <div><p>Email:</p><p>${currentUser.email}</p></div>
      <div><p>Role:</p><p>${currentUser.role}</p></div>
      <div><p>ID:</p><p>${currentUser._id}</p></div>
    </div>
    `;
    userInfoContent.innerHTML = htmlContent;
  } else {
    userInfoContent.innerHTML = `
      <div>No user info</div>
    `;
  }
}

function updateUserEdit() {
  const userEditContent = document.getElementById('user-edit-dialog').querySelector('.user-info-content');
  if (currentUser) {
    userEditContent.innerHTML = `
    <div>
      <div><p>Username:</p><input id="edit-user-name" placeholder="Nimi" pattern="^[a-zA-Z]{4,}$" title="Name must be at least 4 characters" type="text" value="${currentUser.username}" required></input></div>
      <div><p>Email:</p><input id="edit-user-email" placeholder="Sähköposti" pattern=".*@metropolia\.fi$" title="Email must end with @metropolia.fi" type="email" value="${currentUser.email}" required></input></div>
      <div><p>Favourite Restaurant:</p><p>${currentUser.favouriteRestaurant || 'Not specified'}</p></div>
      <div><p>Avatar:</p>${currentUser.avatar ? `<img src="${currentUser.avatar}" alt="Avatar">` : `<p>Not specified</p>`}</div>
      <div><p>New avatar:</p><input id="edit-user-avatar" placeholder="Avatar URL" title="Avatar URL" type="text" value="${currentUser.avatar}"></input></div>
    </div>
    `;
  }
      // <div><p>Select avatar:</p><input type="file" id="edit-user-avatar" accept="image/*"></input></div>
}
