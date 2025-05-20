// #region Expirar cookie
function expirarCookie() {
    if (document.body.classList.contains("login")) {
        document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}

document.addEventListener("DOMContentLoaded", expirarCookie);
// #endregion