

let isUserLoginDialogOpen = false;
document.getElementById('header-user-button').addEventListener('click', function() {
    if (isUserLoginDialogOpen) {
        document.getElementById('user-login-dialog').close();
        isUserLoginDialogOpen = false;
    } else {
        document.getElementById('user-login-dialog').showModal();
        isUserLoginDialogOpen = true;
    }
});

document.getElementById('close-user-login-dialog-button').addEventListener('click', function() {
    document.getElementById('user-login-dialog').close();
    isUserLoginDialogOpen = false;
});