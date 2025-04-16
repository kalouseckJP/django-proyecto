function validateForm() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const validUsername = "admin";
    const validPassword = "1234";

    if (username === validUsername && password === validPassword) {
        document.cookie = `loggedIn=true; path=/`;
        window.location.href = "admin";
        return false; 
    } else {
        document.cookie = `loggedIn=false; path=/`;
        alert("Usuario o contraseña incorrectos");
        return false; 
    }
}

function inicio() {
    window.location.href = "/index.html";
    return false;
}

document.addEventListener("DOMContentLoaded", function() {
    // Check if the current page is admin.html
    if (document.body.classList.contains("admin")) {
        const cookies = document.cookie.split(";").map(cookie => cookie.trim());
        const isLoggedIn = cookies.some(cookie => cookie.startsWith("loggedIn=true"));
        if (!isLoggedIn) {
            window.location.href = "/index.html";
        }
else {
            document.body.classList.add("authenticated"); // Show content if authenticated
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    if (document.body.classList.contains("login")) {
        document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
});

