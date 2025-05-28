
/**
 * Hace la reserva por parte del cliente.
 * @param {*} event 
 */
function reservacion_cliente(event) {
    const reservacionForm = document.getElementById("reservacionForm");
    reservacionForm.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(reservacionForm);
        console.log("estas aqui")
        await fetch("/add_reserva_cliente/", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Reservación creada correctamente")
                    console.log("deberia haber funcionado")
                } else {
                    alert("Error al crear reservación")
                    console.log("Falló")
                }
            })
    })
}

document.addEventListener("DOMContentLoaded", reservacion_cliente);

/**
 * No se usa.
 * @returns {Array} Devuelve la hora y fecha en un array
 */
function get_hora() {
    const hora = document.getElementById("hora");
    const fecha = document.getElementById("fecha");
    let values = [];
    values[0] = hora.value;
    values[1] = fecha.value;
    return values
}

/**
 * 
 * @returns Devuelve todos los datos actualizados de los Espacios
 */
async function get_cantidad() {
    const reservacionForm = document.getElementById("reservacionForm");
    const formData = new FormData(reservacionForm);
    try {
        const response = await fetch("/get_horarios/", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (data.success) {
            return data.lugares;
        } else {
            alert("Error al cargar");
            console.log("Falló");
            return null;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

/**
 * Actualiza la cantidad de espacios disponibles despues de un cambio eb la reserva
 * @async
 * @param {InputEvent} event El evento es el Input con el que se interactuo ultimo
 */
async function get_values(event) {
    let personas = document.getElementById("cantidad_personas_cliente").value;
    let horario = [];
    horario[0] = document.getElementById("hora").value;
    horario[1] = document.getElementById("fecha").value;

    if (event.target.id === "cantidad_personas_cliente") {
        const cantidad = event.target
        let value = cantidad.value;
        console.log(value);
    }

    if (event.target.id === "hora" || event.target.id === "fecha") {
        horario = get_hora();
    }

    await actualizar_capacidad();

    console.log(`Cantidad personas: ${personas}, Horario: ${horario}`)
}

document.addEventListener("input", get_values);


/**
 * @async
 * En cuanto se abre la pagina se hace una lectura y actulzacion inicial de la capacidad
 */
async function carga_inicial() {
    let horario = get_hora();
    await actualizar_capacidad();
}

document.addEventListener("DOMContentLoaded", carga_inicial);

/**
 * @async
 * Actualiza la cantidad de espacios disponibles en cada lugar en las opciones de HTML
 */
async function actualizar_capacidad() {
    const lugares = await get_cantidad();
    for (let index = 0; index < lugares.length; index++) {
        const element = document.getElementById(`espacio_${lugares[index].id}`);
        const lugar = lugares[index];
        element.innerHTML = `${lugar.nombre} - ${lugar.espacio_disponible}`;

    }
}

function cerrar_sesion(){
    const button = document.getElementById("cerrar-sesion")
    button.addEventListener("click", () => {
        document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user_nombre=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user_apellido=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "front"
    })
}

document.addEventListener("DOMContentLoaded", cerrar_sesion)

function verificarRegistrado(event) {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());
    const isLoggedIn = cookies.some(cookie => cookie.startsWith("user_id"));
    if (!isLoggedIn) {
        window.location.href = "/";
    }
}
