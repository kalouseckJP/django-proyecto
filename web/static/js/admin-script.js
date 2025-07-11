// #region Autenticado
function verificarAutenticado(event) {
    if (document.body.classList.contains("admin")) {
        const cookies = document.cookie.split(";").map(cookie => cookie.trim());
        const isLoggedIn = cookies.some(cookie => cookie.startsWith("loggedIn=true"));
        if (!isLoggedIn) {
            window.location.href = "/";
        }
        else {
            document.body.classList.add("authenticated");
        }
    }
}

document.addEventListener("DOMContentLoaded", verificarAutenticado);
// #endregion

// #region Cambiar tabla
function cambiarTabla() {
    const buttons = document.querySelectorAll("nav button");
    const adminContent = document.getElementsByClassName("admin-content")[0];

    buttons.forEach(button => {
        button.addEventListener("click", async function () {
            const value = this.value;
            let content = "";
            test = "";

            switch (value) {
                case "Productos":
                    adminContent.style.display = "none";
                    document.getElementById("reserva-content").style.display = "block";
                    document.getElementById("lugar-content").style.display = "none";
                    document.getElementById("cliente-content").style.display = "none";
                    document.getElementById("reporte-content").style.display = "none";
                    document.getElementById("mesas-content").style.display = "none";
                    document.getElementById("menu-content").style.display = "none";
                    document.getElementById("empleado-content").style.display = "none";
                    document.getElementById("promociones-content").style.display = "none";

                    // content = "<div id='admin-content-header'><h3>Gestion de Productos</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los productos.</p>";
                    break;
                case "Clientes":
                    adminContent.style.display = "none";
                    document.getElementById("reserva-content").style.display = "none";
                    document.getElementById("cliente-content").style.display = "block";
                    document.getElementById("lugar-content").style.display = "none";
                    document.getElementById("reporte-content").style.display = "none";
                    document.getElementById("mesas-content").style.display = "none";
                    document.getElementById("menu-content").style.display = "none";
                    document.getElementById("empleado-content").style.display = "none";
                    document.getElementById("promociones-content").style.display = "none";

                    // content = "<div id='admin-content-header'><h3>Gestion de Clientes</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los clientes.</p>";
                    break;
                case "Lugares":
                    adminContent.style.display = "none";
                    document.getElementById("reserva-content").style.display = "none";
                    document.getElementById("cliente-content").style.display = "none";
                    document.getElementById("lugar-content").style.display = "block";
                    document.getElementById("reporte-content").style.display = "none";
                    document.getElementById("mesas-content").style.display = "none";
                    document.getElementById("menu-content").style.display = "none";
                    document.getElementById("empleado-content").style.display = "none";
                    document.getElementById("promociones-content").style.display = "none";

                    // content = "<div id='admin-content-header'><h3>Gestion de Ventas</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los ventas.</p>";
                    break;
                case "Reportes":
                    adminContent.style.display = "none";
                    document.getElementById("reserva-content").style.display = "none";
                    document.getElementById("cliente-content").style.display = "none";
                    document.getElementById("lugar-content").style.display = "none";
                    document.getElementById("reporte-content").style.display = "block";
                    document.getElementById("mesas-content").style.display = "none";
                    document.getElementById("menu-content").style.display = "none";
                    document.getElementById("empleado-content").style.display = "none";
                    document.getElementById("promociones-content").style.display = "none";

                    // content = "<div id='admin-content-header'><h3>Gestion de Reportes</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los reportes.</p>";
                    break;
                case "Mesas":
                    await get_cantidad_mesas();
                    adminContent.style.display = "none";
                    document.getElementById("reserva-content").style.display = "none";
                    document.getElementById("cliente-content").style.display = "none";
                    document.getElementById("lugar-content").style.display = "none";
                    document.getElementById("reporte-content").style.display = "none";
                    document.getElementById("mesas-content").style.display = "block";
                    document.getElementById("menu-content").style.display = "none";
                    document.getElementById("empleado-content").style.display = "none";
                    document.getElementById("promociones-content").style.display = "none";

                    break;
                case "Menu":
                    adminContent.style.display = "none";
                    document.getElementById("reserva-content").style.display = "none";
                    document.getElementById("cliente-content").style.display = "none";
                    document.getElementById("lugar-content").style.display = "none";
                    document.getElementById("reporte-content").style.display = "none";
                    document.getElementById("mesas-content").style.display = "none";
                    document.getElementById("menu-content").style.display = "block";
                    document.getElementById("empleado-content").style.display = "none";
                    document.getElementById("promociones-content").style.display = "none";

                    break;
                case "Empleados":
                    adminContent.style.display = "none";
                    document.getElementById("reserva-content").style.display = "none";
                    document.getElementById("cliente-content").style.display = "none";
                    document.getElementById("lugar-content").style.display = "none";
                    document.getElementById("reporte-content").style.display = "none";
                    document.getElementById("mesas-content").style.display = "none";
                    document.getElementById("menu-content").style.display = "none";
                    document.getElementById("empleado-content").style.display = "block";
                    document.getElementById("promociones-content").style.display = "none";
                    cargarEmpleados();
                    editarElemento();
                    eliminarElemento();
                    break;
                case "Promociones":
                    adminContent.style.display = "none";
                    document.getElementById("reserva-content").style.display = "none";
                    document.getElementById("cliente-content").style.display = "none";
                    document.getElementById("lugar-content").style.display = "none";
                    document.getElementById("reporte-content").style.display = "none";
                    document.getElementById("mesas-content").style.display = "none";
                    document.getElementById("menu-content").style.display = "none";
                    document.getElementById("empleado-content").style.display = "none";
                    document.getElementById("promociones-content").style.display = "block";
                    break;

                default:
                    content = "<h3>Contenido de Administración</h3><p>Aquí van gestionar los productos, clientes y ventas.</p>";
            }

        });
    });
}
document.addEventListener("DOMContentLoaded", cambiarTabla);
// #endregion

// #region Editar un elemento de la tabla
function editarElemento(event) {
    const editButtons = document.querySelectorAll(".edit-button");
    const modal = document.getElementById("edit-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalFields = document.getElementById("modal-fields");
    const form = document.getElementById("edit-form");

    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const type = button.getAttribute("data-type");

            fetch(`/get_${type}/${id}/`)
                .then(response => response.json())
                .then(data => {
                    modalTitle.textContent = `Editar ${type.charAt(0).toUpperCase() + type.slice(1)}`;

                    modalFields.innerHTML = "";
                    if (type === "reserva") {
                        modalFields.innerHTML = `
                            <input type="hidden" name="id" value="${data.id}">
                            <label for="edit-rut">RUT:</label>
                            <input type="text" id="edit-rut" name="RUT" value="${data.RUT}" required disabled>
                            <label for="add-fecha">Fecha y Hora:</label>
                            <input type="datetime-local" id="add-fecha" name="fecha_reserva" value="${data.now}" min="${data.now}" required autofocus>
                            <label for="edit-cantidad">Cantidad de Personas:</label>
                            <input type="number" id="edit-cantidad" name="cantidad_personas" value="${data.cantidad_personas}" min="1" required>
                            <label for="edit-lugar">Lugar:</label>
                            <select id="edit-lugar" name="espacio" required>
                                <option value="">Seleccione un lugar</option>
                            </select>
                        `;

                        const lugarSelect = document.getElementById("edit-lugar");
                        fetch(`/get_lugares/`)
                            .then(response => response.json())
                            .then(data => {
                                data.forEach(lugar => {
                                    const option = document.createElement("option");
                                    option.value = lugar.id;
                                    option.textContent = lugar.nombre;
                                    lugarSelect.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error("Error fetching lugares:", error);
                            });
                    } else if (type === "cliente") {
                        modalFields.innerHTML = `
                            <input type="hidden" name="RUT" value="${data.RUT}">
                            <label for="edit-nombre">Nombre:</label>
                            <input type="text" id="edit-nombre" name="nombre" value="${data.nombre}" required>
                            <label for="edit-apellido">Apellido:</label>
                            <input type="text" id="edit-apellido" name="apellido" value="${data.apellido}" required>
                            <label for="edit-telefono">Teléfono:</label>
                            <input type="text" id="edit-telefono" name="telefono" value="${data.telefono}" required>
                            <label for="edit-email">Correo Electrónico:</label>
                            <input type="email" id="edit-email" name="email" value="${data.email}" required>
                            <label for="edit-visitas">Visitas:</label>
                            <input type="number" id="edit-visitas" name="visitas" value="${data.visitas}" required>
                        `;
                    } else if (type === "lugar") {
                        modalFields.innerHTML = `
                            <input type="hidden" name="id" value="${data.id}">
                            <label for="edit-nombre">Nombre:</label>
                            <input type="text" id="edit-nombre" name="nombre" value="${data.nombre}" required>
                            <label for="edit-capacidad">Capacidad Máxima:</label>
                            <input type="number" id="edit-capacidad" name="capacidadMaxima" value="${data.capacidadMaxima}" required>
                            <label for="edit-descripcion">Descripción:</label>
                            <textarea id="edit-descripcion" name="descripcion" required>${data.descripcion}</textarea>
                        `;
                    } else if (type === "mesas") {
                        modalFields.innerHTML = `
                            <input type="hidden" name="id" value="${data.id}">
                            <label for="edit-capacidad">Capacidad Mesa:</label>
                            <input type="number" id="edit-capacidad" name="capacidad_mesa" value="${data.capacidad_mesa}" required autofocus>
                            <label for="edit-capacidad-maxima">Tamaño Mesa:</label>
                            <input type="number" id="edit-capacidad-maxima" name="tamano_mesa" value="${data.tamano_mesa}" min="1" max="4" required>
                            <label for="edit-cantidad-mesas">Cantidad Mesas:</label>
                            <input type="number" id="edit-cantidad-mesas" name="cantidad_mesas" value="${data.cantidad_mesas}" min="0" required>
                            <label for="edit-cantidad-actual">Cantidad Actual:</label>
                            <input type="number" id="edit-cantidad-actual" name="cantidad-actual" value="${data.cantidad_actual}" min="0" required>
                        `;
                    } else if (type === "productos") {
                        modalFields.innerHTML = `
                            <input type="hidden" name="id" value="${data.id}">
                            <label for="edit-nombre">Nombre:</label>
                            <input type="text" id="edit-nombre" name="name" value="${data.name}" required>
                            <label for="edit-precio">Precio:</label>
                            <input type="number" id="edit-capacidad" name="price" value="${data.price}" required>
                            <label for="edit-descripcion">Descripción:</label>
                            <textarea id="edit-descripcion" name="description" required>${data.description}</textarea>
                            <label for="edit-descripcion">URL:</label>
                            <input type="url" id="edit-capacidad" name="image" value="${data.image}" required>
                        `;
                    } else if (type === "reporte") {
                        modalFields.innerHTML = `
                            <input type="hidden" name="id" value="${data.id}">
                            <label for="edit-tipo">Tipo:</label>
                            <select id="edit-tipo" name="tipo">
                                <option value="Mensual">Mensual</option>
                                <option value="Semanal">Semanal</option>
                            </select>
                            <label for="edit-fecha">
                            <input type="date" id="edit-fecha" name="fecha" value="${data.rango_inicio}">
                        `
                    } else if (type === "empleado") {

                        modalFields.innerHTML = `
                        <input type="hidden" name="id" value="${data.id}">
                        <label for="edit-nombre">Nombre:</label>
                        <input type="text" id="edit-nombre" name="nombre" value="${data.nombre}" required>
                        <label for="edit-apellido">Apellido:</label>
                        <input type="text" id="edit-apellido" name="apellido" value="${data.apellido}" required>
                        <label for="edit-rut">RUT:</label>
                        <input type="text" id="edit-rut" name="RUT" value="${data.rut}" required>
                        <label for="edit-email">Correo Electrónico:</label>
                        <input type="email" id="edit-email" name="email" value="${data.email}" required>
                        <label for="edit-telefono">Teléfono:</label>
                        <input type="text" id="edit-telefono" name="telefono" value="${data.telefono}" required>
                        <label for="edit-rol">Rol:</label>
                        <input type="text" id="edit-rol" name="rol" value="${data.rol}" required>
                        <label for="edit-asistencia">Asistencia:</label>
                        <select id="edit-asistencia" name="asistencia">
                            <option value="Presente" ${data.asistencia === "Presente" ? "selected" : ""}>Presente</option>
                            <option value="Ausente" ${data.asistencia === "Ausente" ? "selected" : ""}>Ausente</option>
                        </select>
                    `;
                    } else if (type === "promocion") {
                        let diasSemanaHtml = `
                            <div>
                                <label>Días de la Semana Aplicables:</label><br>
                                <input type="checkbox" id="edit_dia_lunes" name="dias_semana_aplicables" value="Lunes"> <label for="edit_dia_lunes">Lunes</label><br>
                                <input type="checkbox" id="edit_dia_martes" name="dias_semana_aplicables" value="Martes"> <label for="edit_dia_martes">Martes</label><br>
                                <input type="checkbox" id="edit_dia_miercoles" name="dias_semana_aplicables" value="Miércoles"> <label for="edit_dia_miercoles">Miércoles</label><br>
                                <input type="checkbox" id="edit_dia_jueves" name="dias_semana_aplicables" value="Jueves"> <label for="edit_dia_jueves">Jueves</label><br>
                                <input type="checkbox" id="edit_dia_viernes" name="dias_semana_aplicables" value="Viernes"> <label for="edit_dia_viernes">Viernes</label><br>
                                <input type="checkbox" id="edit_dia_sabado" name="dias_semana_aplicables" value="Sábado"> <label for="edit_dia_sabado">Sábado</label><br>
                                <input type="checkbox" id="edit_dia_domingo" name="dias_semana_aplicables" value="Domingo"> <label for="edit_dia_domingo">Domingo</label>
                            </div>
                        `;
                        modalFields.innerHTML = `
                            <input type="hidden" name="id" value="${data.id}">

                            <label for="edit-nombre-promocion">Nombre de la Promoción:</label>
                            <input type="text" id="edit-nombre-promocion" name="nombre" value="${data.nombre}" required>

                            <label for="edit-producto-promocion">Producto:</label>
                            <select id="edit-producto-promocion" name="producto_id" required>
                                </select>

                            <label for="edit-tipo-descuento">Tipo de Descuento:</label>
                            <select id="edit-tipo-descuento" name="tipo_descuento" required>
                                <option value="porcentaje" ${data.tipo_descuento === 'porcentaje' ? 'selected' : ''}>Porcentaje</option>
                                <option value="monto_fijo" ${data.tipo_descuento === 'monto_fijo' ? 'selected' : ''}>Monto Fijo</option>
                            </select>

                            <label for="edit-valor-descuento">Valor del Descuento:</label>
                            <input type="number" id="edit-valor-descuento" name="valor_descuento" value="${data.valor_descuento}" step="0.01" required>

                            <label for="edit-fecha-inicio">Fecha de Inicio:</label>
                            <input type="datetime-local" id="edit-fecha-inicio" name="fecha_inicio" value="${data.fecha_inicio.slice(0, 16)}" required>

                            <label for="edit-fecha-fin">Fecha de Fin:</label>
                            <input type="datetime-local" id="edit-fecha-fin" name="fecha_fin" value="${data.fecha_fin.slice(0, 16)}" required>

                            ${diasSemanaHtml}  
                            <label for="edit-descripcion-promocion">Descripción:</label>
                            <textarea id="edit-descripcion-promocion" name="descripcion">${data.descripcion}</textarea>
                            
                            <label for="edit-esta-activo">Estado:</label>
                            <select id="edit-esta-activo" name="esta_activo" required>
                                <option value="true" ${data.esta_activo ? 'selected' : ''}>Activo</option>
                                <option value="false" ${!data.esta_activo ? 'selected' : ''}>Inactivo</option>
                            </select>
                        `;
                        const productoSelect = document.getElementById("edit-producto-promocion");
                        fetch("/products/")
                            .then(response => response.json())
                            .then(responseData => {
                                const productos = responseData.products;
                                productos.forEach(producto => {
                                    const option = document.createElement("option");
                                    option.value = producto.id;
                                    option.textContent = producto.name;
                                    productoSelect.appendChild(option);
                                });
                            })
                            .catch(error => console.error("Error fetching productos:", error));
                    }
                    modal.style.display = "flex";
                });
        });
    });

    window.closeModal = function () {
        modal.style.display = "none";
    };

    form.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(form);
        const type = modalTitle.textContent.split(" ")[1].toLowerCase();

        if (type === 'promocion') {
            const dias = Array.from(form.querySelectorAll('input[name="dias_semana_aplicables"]:checked')).map(cb => cb.value);
            formData.delete('dias_semana_aplicables');
            formData.append('dias_semana_aplicables', dias.join(','));
            const estaActivo = form.querySelector('#edit-esta-activo').value;
            formData.set('esta_activo', estaActivo);
        }

        let url = `/edit_${type}/`;
        if (type === "promocion") {
            url = `/promociones/add_edit/`;
        }
        fetch(url, {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    let row;
                    if (type === "cliente") {
                        row = document.querySelector(`button[data-id="${data.RUT}"]`).closest("tr");
                    } else {
                        row = document.querySelector(`button[data-id="${data.id}"]`).closest("tr");
                    }

                    if (type === "reserva") {
                        row.querySelector("td:nth-child(2)").textContent = data.nombre || "N/A";
                        row.querySelector("td:nth-child(3)").textContent = data.apellido || "N/A";
                        row.querySelector("td:nth-child(4)").textContent = data.RUT || "N/A";
                        row.querySelector("td:nth-child(5)").textContent = data.telefono || "N/A";
                        row.querySelector("td:nth-child(6)").textContent = data.email || "N/A";
                        row.querySelector("td:nth-child(7)").textContent = data.fecha_reserva || "N/A";
                        row.querySelector("td:nth-child(8)").textContent = data.hora_inicio || "N/A";
                        row.querySelector("td:nth-child(9)").textContent = data.cantidad_personas || "N/A";
                        row.querySelector("td:nth-child(10)").textContent = data.espacio || "N/A";
                    } else if (type === "cliente") {
                        row.querySelector("td:nth-child(2)").textContent = data.nombre || "N/A";
                        row.querySelector("td:nth-child(3)").textContent = data.apellido || "N/A";
                        row.querySelector("td:nth-child(4)").textContent = data.telefono || "N/A";
                        row.querySelector("td:nth-child(5)").textContent = data.email || "N/A";
                        row.querySelector("td:nth-child(6)").textContent = data.visitas || "N/A";
                    } else if (type === "lugar") {
                        row.querySelector("td:nth-child(2)").textContent = data.nombre || "N/A";
                        row.querySelector("td:nth-child(3)").textContent = data.capacidadMaxima || "N/A";
                        row.querySelector("td:nth-child(5)").textContent = data.descripcion || "N/A";
                    } else if (type === "mesas") {
                        row.querySelector("td:nth-child(2)").textContent = data.tamano_mesa || "N/A";
                        row.querySelector("td:nth-child(3)").textContent = data.capacidad_mesa || "N/A";
                        row.querySelector("td:nth-child(4)").textContent = data.cantidad_mesas || "N/A";
                        row.querySelector("td:nth-child(5)").textContent = data.cantidad_actual || "N/A";
                    } else if (type === "reporte") {
                        row.querySelector("td:nth-child(2)").textContent = data.tipo || "N/A";
                        row.querySelector("td:nth-child(3)").textContent = data.rango_inicio || "N/A";
                        row.querySelector("td:nth-child(4)").textContent = data.rango_final || "N/A";
                        row.querySelector("td:nth-child(5)").textContent = data.clientes || "N/A";
                    } else if (type === "empleado") {
                        row.querySelector("td:nth-child(2)").textContent = data.nombre || "N/A";
                        row.querySelector("td:nth-child(3)").textContent = data.apellido || "N/A";
                        row.querySelector("td:nth-child(4)").textContent = data.rut || "N/A";
                        row.querySelector("td:nth-child(5)").textContent = data.email || "N/A";
                        row.querySelector("td:nth-child(6)").textContent = data.telefono || "N/A";
                        row.querySelector("td:nth-child(7)").textContent = data.rol || "N/A";
                        row.querySelector("td:nth-child(8)").textContent = data.asistencia || "N/A";
                    } else if (type === "promocion") {

                        const fechaInicio = new Date(data.fecha_inicio).toLocaleString('es-CL');
                        const fechaFin = new Date(data.fecha_fin).toLocaleString('es-CL');
                        const estado = data.esta_activo ? 'Activo' : 'Inactivo';
                        const valorDescuento = data.tipo_descuento === 'porcentaje'
                            ? `${parseFloat(data.valor_descuento).toFixed(2)}%`
                            : `$${parseInt(data.valor_descuento)}`;
                        row.querySelector("td:nth-child(2)").textContent = data.nombre || "N/A";
                        row.querySelector("td:nth-child(3)").textContent = data.producto || "N/A";
                        row.querySelector("td:nth-child(4)").textContent = valorDescuento || "N/A";
                        row.querySelector("td:nth-child(5)").textContent = fechaInicio || "N/A";
                        row.querySelector("td:nth-child(6)").textContent = fechaFin || "N/A";
                        row.querySelector("td:nth-child(7)").textContent = estado || "N/A";
                    }

                    closeModal();
                } else {
                    alert("Error al guardar los cambios.");
                }
            })
    });
}

document.addEventListener("DOMContentLoaded", editarElemento);
// #endregion


// #region Eliminar un elemento de la tabla
function eliminarElemento(event) {
    const deleteButtons = document.querySelectorAll(".delete-button");

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const type = button.getAttribute("data-type");

            const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar este ${type}?`);
            if (confirmDelete) {
                fetch(`/delete_${type}/${id}/`, {
                    method: "DELETE",
                    headers: {
                        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Remove the row from the table
                            const row = button.closest("tr");
                            row.remove();
                            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} eliminado con éxito.`);
                        } else {
                            alert("Error al eliminar el elemento.");
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        alert("Error al eliminar el elemento.");
                    });
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", eliminarElemento);
// #endregion

// #region Añadir un nuevo elemento a la tabla
function añadirElemento(event) {

    let promocionFormHTML = '';
    const promoFormContainer = document.getElementById('promocion-form-content');
    if (promoFormContainer) {
        promocionFormHTML = promoFormContainer.parentElement.innerHTML;
    }

    const addButtons = document.querySelectorAll("#add, #add_promocion_btn");
    const addModal = document.getElementById("add-modal");
    const addModalTitle = document.getElementById("add-modal-title");
    const addModalFields = document.getElementById("add-modal-fields");
    const addForm = document.getElementById("add-form");

    addButtons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.getAttribute("data-type");

            addModalTitle.textContent = `Agregar ${type.charAt(0).toUpperCase() + type.slice(1)}`;
            addModalFields.innerHTML = "";

            if (type === "promocion") {
                addModalFields.innerHTML = promocionFormHTML;


            } else if (type === "reserva") {
                addModalFields.innerHTML = `
                    <label for="add-rut">RUT:</label>
                    <input type="text" id="add-rut" name="RUT" required>
                    <label for="add-fecha">Fecha y Hora:</label>
                    <input type="datetime-local" id="add-fecha" name="fecha_reserva" required>
                    <label for="add-cantidad">Cantidad de Personas:</label>
                    <input type="number" id="add-cantidad" name="cantidad_personas" value="1" min="1" required>
                    <label for="add-lugar">Lugar:</label>
                    <select id="add-lugar" name="espacio" required>
                        <option value="">Seleccione un lugar</option>
                    </select>
                `;

                const lugarSelect = document.getElementById("add-lugar");
                fetch(`/get_lugares/`)
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(lugar => {
                            const option = document.createElement("option");
                            option.value = lugar.id;
                            option.textContent = lugar.nombre;
                            lugarSelect.appendChild(option);
                        });
                    })
                    .catch(error => console.error("Error fetching lugares:", error));
            } else if (type === "cliente") {
                addModalFields.innerHTML = `
                    <label for="add-rut">RUT:</label>
                    <input type="text" id="add-rut" name="RUT" required>
                    <label for="add-nombre">Nombre:</label>
                    <input type="text" id="add-nombre" name="nombre" required>
                    <label for="add-apellido">Apellido:</label>
                    <input type="text" id="add-apellido" name="apellido" required>
                    <label for="add-telefono">Teléfono:</label>
                    <input type="text" id="add-telefono" name="telefono" value="+569" required>
                    <label for="add-email">Correo Electrónico:</label>
                    <input type="email" id="add-email" name="email" required>
                    <label for="add-visitas">Visitas:</label>
                    <input type="number" id="add-visitas" name="visitas" value="1" min="1" required>
                `;
            } else if (type === "lugar") {
                addModalFields.innerHTML = `
                    <label for="add-nombre">Nombre:</label>
                    <input type="text" id="add-nombre" name="nombre" required>
                    <label for="add-capacidad">Capacidad Máxima:</label>
                    <input type="number" id="add-capacidad" name="capacidadMaxima" required>
                    <label for="add-descripcion">Descripción:</label>
                    <textarea id="add-descripcion" name="descripcion" required></textarea>
                `;
            } else if (type === "mesas") {
                addModalFields.innerHTML = `
                    <label for="add-capacidad">Capacidad Mesa:</label>
                    <input type="number" id="add-capacidad" name="capacidad-mesa" value="2" required autofocus>
                    <label for="add-capacidad-maxima">Tamaño Mesa:</label>
                    <input type="number" id="add-capacidad-maxima" name="tamano-mesa" value="1" min="1" max="4" required>
                    <label for="add-cantidad-mesas">Cantidad Mesas:</label>
                    <input type="number" id="add-cantidad-mesas" name="cantidad-mesas" value="10" min="0" required>
                    <label for="add-cantidad-actual">Cantidad Actual:</label>
                    <input type="number" id="add-cantidad-actual" name="cantidad-actual" value="10" min="0" required>
                `;
            } else if (type === "productos") {
                addModalFields.innerHTML = `
                    <label for="add-nombre">Nombre:</label>
                    <input type="text" id="add-nombre" name="name" required>
                    <label for="add-precio">Precio:</label>
                    <input type="number" id="add-capacidad" name="price" min="500" value="500" required>
                    <label for="add-descripcion">Descripción:</label>
                    <textarea id="add-descripcion" name="description" required></textarea>
                    <label for="add-descripcion">URL:</label>
                    <input type="url" id="add-capacidad" name="image" required>
                `;
            } else if (type === "reporte") {
                addModalFields.innerHTML = `
                    <label for="add-tipo">Tipo:</label>
                    <select id="add-tipo" name="tipo">
                        <option value="Mensual">Mensual</option>
                        <option value="Semanal">Semanal</option>
                    </select>
                    <label for="add-fecha">
                    <input type="date" id="add-fecha" name="fecha">
                `
            } else if (type === "empleado") {
                addModalFields.innerHTML = `
                    <label for="add-nombre">Nombre:</label>
                    <input type="text" id="add-nombre" name="nombre" required>
                    <label for="add-apellido">Apellido:</label>
                    <input type="text" id="add-apellido" name="apellido" required>
                    <label for="add-rut">RUT:</label>
                    <input type="text" id="add-rut" name="RUT" required>
                    <label for="add-email">Correo Electrónico:</label>
                    <input type="email" id="add-email" name="email" required>
                    <label for="add-telefono">Teléfono:</label>
                    <input type="text" id="add-telefono" name="telefono" required>
                    <label for="add-rol">Rol:</label>
                    <input type="text" id="add-rol" name="rol" required>
                    <label for="add-asistencia">Asistencia:</label>
                    <select id="add-asistencia" name="asistencia" required>
                        <option value="Presente">Presente</option>
                        <option value="Ausente">Ausente</option>
                    </select>
                `;
            }

            addModal.style.display = "flex";
        });
    });

    window.closeAddModal = function () {
        addModal.style.display = "none";
    };

    addForm.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(addForm);
        const type = addModalTitle.textContent.split(" ")[1].toLowerCase();

        // Corrección para el campo de días de la semana
        if (type === 'promocion') {
            const dias = Array.from(addForm.querySelectorAll('input[name="dias_semana_aplicables"]:checked')).map(cb => cb.value);
            formData.delete('dias_semana_aplicables');
            formData.append('dias_semana_aplicables', dias.join(','));
        }

        let url = `/add_${type}/`;
        if (type === 'promocion') {
            url = '/promociones/add_edit/'; // Correct URL for promotions
        }

        fetch(url, { // Use the corrected URL
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // CAMBIO 4: Se asegura de que la nueva fila se agregue a la tabla correcta.
                    // La tabla de promociones tiene un ID diferente en su `<tbody>`.
                    let tableBody;
                    if (type === "promocion") {
                        tableBody = document.querySelector(`#promociones-content .reservas-body`);
                    } else {
                        tableBody = document.querySelector(`#${type}-content .reservas-body`);
                    }

                    const newRow = document.createElement("tr");
                    newRow.innerHTML = data.new_row_html; // El servidor debe devolver el HTML de la nueva fila.
                    if (tableBody) {
                        tableBody.appendChild(newRow);
                    } else {
                        console.error(`No se encontró el cuerpo de la tabla para: ${type}`);
                    }


                    closeAddModal();
                } else {
                    if (data.noCliente) {
                        alert(`No existe`);
                    } else {
                        alert("Error al agregar el elemento.");
                    }
                }
            });
    });
}
document.addEventListener("DOMContentLoaded", añadirElemento);
// #endregiondocument.addEventListener("DOMContentLoaded", añadirElemento);
// #endregion

// #region Cerrar el modal al hacer clic fuera de él
function cerrarModalFuera(event) {
    const editModal = document.getElementById("edit-modal");
    const editModalContent = editModal.querySelector(".modal-content");
    const addModal = document.getElementById("add-modal");
    const addModalContent = addModal.querySelector(".modal-content");

    // Cerrar modal de edición al hacer clic fuera de él
    editModal.addEventListener("click", (event) => {
        if (!editModalContent.contains(event.target)) {
            closeModal();
        }
    });

    // Cerrar modal de añadir al hacer clic fuera de él
    addModal.addEventListener("click", (event) => {
        if (!addModalContent.contains(event.target)) {
            closeAddModal();
        }
    });

    window.closeModal = function () {
        editModal.style.display = "none";
    };

    window.closeAddModal = function () {
        addModal.style.display = "none";
    };
}
document.addEventListener("DOMContentLoaded", cerrarModalFuera);
// #endregion

// #region Cerrar el modal al presionar la tecla "Esc"
function cerrarModalESC(event) {
    if (event.key === "Escape") {
        const editModal = document.getElementById("edit-modal");
        const addModal = document.getElementById("add-modal");
        if (editModal.style.display === "flex") {
            closeModal();
        } else if (addModal.style.display === "flex") {
            closeAddModal();
        }
    }
}
document.addEventListener("keydown", cerrarModalESC);
// #endregion

async function get_cantidad_mesas() {
    const editForm = document.getElementById("edit-form");
    const formData = new FormData(editForm);
    try {
        const response = await fetch("/get_h_mesas_admin/", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (!data.success) {
            alert("Error al cargar");
            console.log("Falló");
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}