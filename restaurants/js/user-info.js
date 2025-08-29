// Event handler for the user button in the header
document.getElementById('close-user-info-dialog-button').addEventListener('click', function () {
  document.getElementById('user-info-dialog').close();
});


function updateUserInfo() {
  const userInfoContent = document.getElementById('user-info-dialog').querySelector('.user-info-content');
  if (currentUser) {
    userInfoContent.innerHTML = `
    <div><p>Username:</p><p>${currentUser.username}</p></div>
    <div><p>Email:</p><p>${currentUser.email}</p></div>
    <div><p>Role:</p><p>${currentUser.role}</p></div>
    <div><p>ID:</p><p>${currentUser._id}</p></div>
    `;
    if (currentUser.avatar) {
      userInfoContent.innerHTML += `<div><img src="${currentUser.avatar}" alt="Avatar"></div>`;
    }
  } else {
    userInfoContent.innerHTML = `
      <div>No user info</div>
    `;
  }
}
