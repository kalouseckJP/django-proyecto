/**
 * Valida los datos ingresados por el cliente comparándolo con los datos de la BD
 */
function validar_datos_cliente() {
    const loginFormCliente = document.getElementById("loginFormCliente");
    const error = document.getElementById("datInc")
    loginFormCliente.addEventListener("submit", async event => {
        event.preventDefault()
        const formData = new FormData(loginFormCliente)
        await fetch("/validacion_cliente/", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.existe) {
                        window.location.href = "front"
                    } else {
                        error.classList.add("error")
                    }
                } else {
                    alert('error al conectar');
                }
            })
    })
}

document.addEventListener("DOMContentLoaded", validar_datos_cliente)

