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
    window.location.href = "/";
    return false;
}

document.addEventListener("DOMContentLoaded", function() {
    // Check if the current page is admin.html
    if (document.body.classList.contains("admin")) {
        const cookies = document.cookie.split(";").map(cookie => cookie.trim());
        const isLoggedIn = cookies.some(cookie => cookie.startsWith("loggedIn=true"));
        if (!isLoggedIn) {
            window.location.href = "/";
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

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("nav button");
    const adminContent = document.getElementById("admin-content");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const value = this.value;
            let content = "";

            switch (value) {
                case "Productos":
                    content = "<div id='admin-content-header'><h3>Gestion de Productos</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los productos.</p>";
                    break;
                case "Clientes":
                    content = "<div id='admin-content-header'><h3>Gestion de Clientes</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los clientes.</p>";
                    break;
                case "Ventas":
                    content = "<div id='admin-content-header'><h3>Gestion de Ventas</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los ventas.</p>";
                    break;
                default:    
                    content = "<h3>Contenido de Administración</h3><p>Aquí van gestionar los productos, clientes y ventas.</p>";
            }

        });
    });
});
