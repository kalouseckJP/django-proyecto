
/**
 * Funcion que permite al usuario registrarse en la base de datos.
 */
function crear_usuario() {
    const registroForm = document.getElementById("registroForm");
    const correo = registroForm.email;
    const telefono = registroForm.telefono;
    correo.addEventListener("input", () => {
        correo.setCustomValidity("");
        telefono.setCustomValidity("")
    });

    telefono.addEventListener("input", () => {
        telefono.setCustomValidity("");
        correo.setCustomValidity("");
    });
    registroForm.addEventListener("submit", event => {
        event.preventDefault();
        console.log(correo.value);
        if (correo.value == "" && telefono.value == "") {
            correo.setCustomValidity("Debe tener por lo menos una opción de contacto.");
            telefono.setCustomValidity("Debe tener por lo menos una opción de contacto.");
        } else {
            const formData = new FormData(registroForm);
            fetch('/add_cliente_registro/', {
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
        }
    })
}

document.addEventListener("DOMContentLoaded", crear_usuario)