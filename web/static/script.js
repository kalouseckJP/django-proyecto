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
    const adminContent = document.getElementsByClassName("admin-content")[0];

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const value = this.value;
            let content = "";
             test = "";

            switch (value) {
                case "Productos":
                    adminContent.style.display = "none";
                    document.getElementById("lugares-content").style.display = "none";
                    document.getElementById("clientes-content").style.display = "none";
                    document.getElementById("reservas-content").style.display = "block";
                    // content = "<div id='admin-content-header'><h3>Gestion de Productos</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los productos.</p>";
                    break;
                case "Clientes":
                    adminContent.style.display = "none";
                    document.getElementById("reservas-content").style.display = "none";
                    document.getElementById("lugares-content").style.display = "none";
                    document.getElementById("clientes-content").style.display = "block";
                    // content = "<div id='admin-content-header'><h3>Gestion de Clientes</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los clientes.</p>";
                    break;
                case "Lugares":
                    adminContent.style.display = "none";
                    document.getElementById("reservas-content").style.display = "none";
                    document.getElementById("clientes-content").style.display = "none";
                    document.getElementById("lugares-content").style.display = "block";
                    // content = "<div id='admin-content-header'><h3>Gestion de Ventas</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los ventas.</p>";
                    break;
                default:    
                    content = "<h3>Contenido de Administración</h3><p>Aquí van gestionar los productos, clientes y ventas.</p>";
            }

        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll(".edit-button");
    const modal = document.getElementById("edit-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalFields = document.getElementById("modal-fields");
    const form = document.getElementById("edit-form");

    // Open modal and populate form dynamically
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const type = button.getAttribute("data-type");

            // Fetch data based on type
            fetch(`/get_${type}/${id}/`)
                .then(response => response.json())
                .then(data => {
                    // Update modal title
                    modalTitle.textContent = `Editar ${type.charAt(0).toUpperCase() + type.slice(1)}`;

                    // Populate modal fields dynamically
                    modalFields.innerHTML = ""; // Clear previous fields
                    if (type === "reserva") {
                        modalFields.innerHTML = `
                            <input type="hidden" name="id" value="${data.id}">
                            <label for="edit-nombre">Nombre:</label>
                            <input type="text" id="edit-nombre" name="nombre" value="${data.nombre}" required>
                            <label for="edit-apellido">Apellido:</label>
                            <input type="text" id="edit-apellido" name="apellido" value="${data.apellido}" required>
                            <label for="edit-rut">RUT:</label>
                            <input type="text" id="edit-rut" name="RUT" value="${data.RUT}" required>
                            <label for="edit-telefono">Teléfono:</label>
                            <input type="text" id="edit-telefono" name="telefono" value="${data.telefono}" required>
                            <label for="edit-email">Correo Electrónico:</label>
                            <input type="email" id="edit-email" name="email" value="${data.email}" required>
                        `;
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

        fetch(`/edit_${type}/`, {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the table row dynamically
                    const row = document.querySelector(`button[data-id="${data.id}"]`).closest("tr");
                    if (type === "Reservas") {
                        row.querySelector("td:nth-child(2)").textContent = data.nombre;
                        row.querySelector("td:nth-child(3)").textContent = data.apellido;
                        row.querySelector("td:nth-child(4)").textContent = data.RUT;
                        row.querySelector("td:nth-child(5)").textContent = data.telefono;
                        row.querySelector("td:nth-child(6)").textContent = data.email;
                    } else if (type === "Clientes") {
                        row.querySelector("td:nth-child(2)").textContent = data.nombre;
                        row.querySelector("td:nth-child(3)").textContent = data.apellido;
                        row.querySelector("td:nth-child(4)").textContent = data.telefono;
                        row.querySelector("td:nth-child(5)").textContent = data.email;
                        row.querySelector("td:nth-child(6)").textContent = data.visitas;
                    } else if (type === "Lugares") {
                        row.querySelector("td:nth-child(2)").textContent = data.nombre;
                        row.querySelector("td:nth-child(3)").textContent = data.capacidadMaxima;
                        row.querySelector("td:nth-child(4)").textContent = data.descripcion;
                    }

                    closeModal();
                } else {
                    alert("Error al guardar los cambios.");
                }
            });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delete-button");

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const type = button.getAttribute("data-type");

            // Show confirmation dialog
            const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar este ${type}?`);
            if (confirmDelete) {
                // Send delete request to the server
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
});
// Añadir un nuevo elemento a la tabla
document.addEventListener("DOMContentLoaded", () => {
    const addButtons = document.querySelectorAll("#add");
    const addModal = document.getElementById("add-modal");
    const addModalTitle = document.getElementById("add-modal-title");
    const addModalFields = document.getElementById("add-modal-fields");
    const addForm = document.getElementById("add-form");

    addButtons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.getAttribute("data-type");

            addModalTitle.textContent = `Agregar Nuevo ${type.charAt(0).toUpperCase() + type.slice(1)}`;

            addModalFields.innerHTML = "";
            if (type === "reserva") {
                addModalFields.innerHTML = `
                    <label for="add-rut">RUT:</label>
                    <input type="text" id="add-rut" name="RUT" required>
                    <label for="add-fecha">Fecha:</label>
                    <input type="date" id="add-fecha" name="fecha_reserva" required>
                    <label for="add-hora">Hora:</label>
                    <input type="time" id="add-hora" name="hora_inicio" required>
                    <label for="add-cantidad">Cantidad de Personas:</label>
                    <input type="number" id="add-cantidad" name="cantidad_personas" required>
                    <label for="add-lugar">Lugar:</label>
                    <input type="text" id="add-lugar" name="espacio" required>
                `;
            } else if (type === "cliente") {
                addModalFields.innerHTML = `
                    <label for="add-rut">RUT:</label>
                    <input type="text" id="add-rut" name="RUT" required>
                    <label for="add-nombre">Nombre:</label>
                    <input type="text" id="add-nombre" name="nombre" required>
                    <label for="add-apellido">Apellido:</label>
                    <input type="text" id="add-apellido" name="apellido" required>
                    <label for="add-telefono">Teléfono:</label>
                    <input type="text" id="add-telefono" name="telefono" required>
                    <label for="add-email">Correo Electrónico:</label>
                    <input type="email" id="add-email" name="email" required>
                    <label for="add-visitas">Visitas:</label>
                    <input type="number" id="add-visitas" name="visitas" required>
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
            }

            // Show the modal
            addModal.style.display = "flex";
        });
    });

    // Close modal
    window.closeAddModal = function () {
        addModal.style.display = "none";
    };

    // Submit form via AJAX
    addForm.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(addForm);
        const type = addModalTitle.textContent.split(" ")[2].toLowerCase();

        fetch(`/add_${type}/`, {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Add the new row to the table dynamically
                    const tableBody = document.querySelector(`#${type}-content .reservas-body`);
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = data.new_row_html; // Server should return the new row HTML
                    tableBody.appendChild(newRow);

                    // Close the modal
                    closeAddModal();
                } else {
                    alert("Error al agregar el elemento.");
                }
            });
    });
});

// Cerrar el modal al hacer clic fuera de él
document.addEventListener("DOMContentLoaded", () => {
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
});
