
function cliente_logged() {
    let x = document.cookie.split("; ");
    i = 0;
    for (let index = 0; index < x.length; index++) {
        dx = x[index].split('=');
        if (dx[0] == 'user_id') {
            console.log(dx);
            return true
        }
    }
    console.log(x)
    return false
}

function search_cookie(name) {
    let x = document.cookie.split("; ");
    i = 0;
    for (let index = 0; index < x.length; index++) {
        dx = x[index].split('=');
        if (dx[0] == name) {
            console.log(dx);
            return dx[1];
        }
    }
}

function cambiar_incio() {
    if (cliente_logged()) {
        const nombre = search_cookie('user_nombre');
        const apellido = search_cookie('user_apellido');
        const divLogin = document.getElementById("divLogin");
        divLogin.innerHTML = `
            <a id="user-button" class="header-button" href="usuario">${nombre} ${apellido} <i class="bi bi-person-circle"></i></a>
            <button id="cerrar-sesion" class="header-button">Cerrar Sesion</button>
        `
    }
}

document.addEventListener("DOMContentLoaded", cambiar_incio)

function cerrar_sesion(){
    const button = document.getElementById("cerrar-sesion")
    button.addEventListener("click", () => {
        document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user_nombre=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user_apellido=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
    })
}

document.addEventListener("DOMContentLoaded", cerrar_sesion)
