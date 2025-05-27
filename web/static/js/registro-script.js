
/**
 * Funcion que permite al usuario registrarse en la base de datos.
 */
function crear_usuario() {
    const registroForm = document.getElementById("registroForm");
    registroForm.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(registroForm);
        await fetch('/add_cliente_registro/', {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                if(data.existente){
                    alert("Este cliente ya esta registrado")
                }
            }
            else {
                alert("error")
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", crear_usuario)