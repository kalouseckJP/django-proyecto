
/**
 * Funcion que permite al usuario registrarse en la base de datos.
 */
function crear_usuario() {
    console.log('aaaaaaaaaa');
    const registroForm = document.getElementById("registroForm");
    registroForm.addEventListener("submit", async event => {
        console.log('esta funcionando?');
        event.preventDefault();
        const formData = new FormData(registroForm);
        await fetch('/add_cliente_registro/', {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                console.log('llega aqui')
                if(data.existente){
                    console.log('por que llego aqui?');
                    alert("Este cliente ya esta registrado");
                }else{
                    console.log('deberia haber llegado aqui');
                    alert("Perfil creado");
                    window.location.href = "front";
                }
            }
            else {
                alert("error");
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", crear_usuario)