function limitar_horario_usuario() {
    const input = document.getElementById("add-fecha");
    let value = input.value;
    const date = new Date();
    const currentMinutes = date.getMinutes();
    date.setMinutes(currentMinutes + 30);

	let value2 = value[1].split(":");
    let tiempo = parseInt(value2[0] * 60) + parseInt(value2[1]);
    const comparacion = date.getHours() * 60 + date.getMinutes();
	let test = date.getMinutes().toString();
	if(test.length < 2){
		test = "0" + test;
	}
	input.min = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${test}`;

	if(value[0].split("-")[2] == date.getDate() && tiempo < comparacion) {
        input.setCustomValidity("Su reserva debe ser realizada por lo menos 30 minutos en avance.");
    } else {
        input.setCustomValidity("");
    }
}

document.addEventListener("input", limitar_horario_usuario)

function fecha_30min(){
	const date = new Date();
    const currentMinutes = date.getMinutes();
    date.setMinutes(currentMinutes + 30);
	let test = date.getMinutes().toString();
	if(test.length < 2){
		test = "0" + test;
	}
    min = `${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${test}`;
	return min
}

function not_disp(input){
    const date = new Date();
    const currentMinutes = date.getMinutes();
    date.setMinutes(currentMinutes + 30);

    input = input.split("T");
	let value2 = input[1].split(":");
    let tiempo = parseInt(value2[0] * 60) + parseInt(value2[1]);
	const comparacion = date.getHours() * 60 + date.getMinutes();

	if(input[0].split("-")[2] == date.getDate() && tiempo < comparacion) {
		const form = document.getElementById("edit-form")
		alert("Solo puede modificar reservas con más de 30 minutos de antelación.");
		document.getElementById("editModal").display = "none"
    }
}
// #region Cambiar tabla
function cambiarTabla() {
	const buttons = document.querySelectorAll("nav button");
	const adminContent = document.getElementsByClassName("admin-content")[0];

	buttons.forEach((button) => {
		button.addEventListener("click", function () {
			const value = this.value;
			let content = "";
			test = "";

			switch (value) {
				case "Reservas":
					adminContent.style.display = "none";
					document.getElementById("datos").style.display = "none";
					document.getElementById("reserva-content").style.display = "block";
					// content = "<div id='admin-content-header'><h3>Gestion de Productos</h3><button type='button' id='add'><i class='bi bi-plus-circle'></i> Agregar</button></div><p>Aquí puedes gestionar los productos.</p>";
					break;
				case "Datos":
					adminContent.style.display = "none";
					document.getElementById("reserva-content").style.display = "none";
					document.getElementById("datos").style.display = "block";
				default:
					content =
						"<h3>Contenido de Administración</h3><p>Aquí van gestionar los productos, clientes y ventas.</p>";
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
	editButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const id = button.getAttribute("data-id");
			const type = button.getAttribute("data-type");

			fetch(`/get_${type}/${id}/`)
				.then(async (response) => await response.json())
				.then(async (data) => {
					modalTitle.textContent = `Editar ${type.charAt(0).toUpperCase() + type.slice(1)
						}`;

					modalFields.innerHTML = "";
					if (type === "reserva") {
						modalFields.innerHTML = `
                            <input type="hidden" name="id" value="${data.id}">
                            <label for="add-fecha">Fecha y Hora:</label>
                            <input type="datetime-local" id="add-fecha" name="fecha_reserva" value="${fecha_30min()}" min="${fecha_30min()}" required>
                            <label for="edit-cantidad">Cantidad de Personas:</label>
                            <input type="number" id="edit-cantidad" name="cantidad_personas" value="${data.cantidad_personas}" min="1" required>
                            <label for="edit-lugar">Lugar:</label>
                            <select id="edit-lugar" name="espacio" required>
                                <option disabled value="">Seleccione un lugar</option>
                            </select>
                        `;

						const lugarSelect = document.getElementById("edit-lugar");
						fetch(`/get_lugares/`)
							.then((response) => response.json())
							.then((data) => {
								data.forEach((lugar) => {
									const option = document.createElement("option");
									option.value = lugar.id;
									option.textContent = lugar.nombre;
									option.id = `espacio_${lugar.id}`
									lugarSelect.appendChild(option);
								});
							})
							.catch((error) => {
								console.error("Error fetching lugares:", error);
							});

						limitar_horario_usuario();
						await actualizar_capacidad();
						not_disp(data.fecha_reserva);
					}
					modal.style.display = "flex";
				});
		});
	});

	window.closeModal = function () {
		modal.style.display = "none";
		document.querySelectorAll('input').forEach(input => input.disabled = false);
	};

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const type = modalTitle.textContent.split(" ")[1].toLowerCase();

		fetch(`/edit_${type}/`, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					let row;
					if (type === "cliente") {
						row = document
							.querySelector(`button[data-id="${data.RUT}"]`)
							.closest("tr");
					} else {
						row = document
							.querySelector(`button[data-id="${data.id}"]`)
							.closest("tr");
					}

					if (type === "reserva") {
						row.querySelector("td:nth-child(2)").textContent =
							data.nombre || "N/A";
						row.querySelector("td:nth-child(3)").textContent =
							data.apellido || "N/A";
						row.querySelector("td:nth-child(4)").textContent =
							data.RUT || "N/A";
						row.querySelector("td:nth-child(5)").textContent =
							data.telefono || "N/A";
						row.querySelector("td:nth-child(6)").textContent =
							data.email || "N/A";
						row.querySelector("td:nth-child(7)").textContent =
							data.fecha_reserva || "N/A";
						row.querySelector("td:nth-child(8)").textContent =
							data.hora_inicio || "N/A";
						row.querySelector("td:nth-child(9)").textContent =
							data.cantidad_personas || "N/A";
						row.querySelector("td:nth-child(10)").textContent =
							data.espacio || "N/A";
					}

					closeModal();
				} else {
					alert("Error al guardar los cambios.");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				alert("CATCH Error al guardar los cambios.");
			});
	});
}

document.addEventListener("DOMContentLoaded", editarElemento);
// #endregion

// #region Eliminar un elemento de la tabla
function eliminarElemento(event) {
	const deleteButtons = document.querySelectorAll(".delete-button");

	deleteButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const id = button.getAttribute("data-id");
			const type = button.getAttribute("data-type");

			const confirmDelete = confirm(
				`¿Estás seguro de que deseas eliminar este ${type}?`
			);
			if (confirmDelete) {
				fetch(`/delete_${type}/${id}/`, {
					method: "DELETE",
					headers: {
						"X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
							.value,
					},
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.success) {
							// Remove the row from the table
							const row = button.closest("tr");
							row.remove();
							alert(
								`${type.charAt(0).toUpperCase() + type.slice(1)
								} eliminado con éxito.`
							);
						} else {
							alert("Error al eliminar el elemento.");
						}
					})
					.catch((error) => {
						console.error("Error:", error);
						alert("Error al eliminar el elemento.");
					});
			}
		});
	});
}

document.addEventListener("DOMContentLoaded", eliminarElemento);
// #endregion

// #region Cerrar el modal al hacer clic fuera de él
function cerrarModalFuera(event) {
	const editModal = document.getElementById("edit-modal");
	const editModalContent = editModal.querySelector(".modal-content");

	// Cerrar modal de edición al hacer clic fuera de él
	editModal.addEventListener("click", (event) => {
		if (!editModalContent.contains(event.target)) {
			closeModal();
		}
	});

	window.closeModal = function () {
		editModal.style.display = "none";
		document.querySelectorAll('input').forEach(input => input.disabled = false);
	};
}
document.addEventListener("DOMContentLoaded", cerrarModalFuera);
// #endregion

// #region Cerrar el modal al presionar la tecla "Esc"
function cerrarModalESC(event) {
	if (event.key === "Escape") {
		const editModal = document.getElementById("edit-modal");
		if (editModal.style.display === "flex") {
			document.querySelectorAll('input').forEach(input => input.disabled = false);
			closeModal();
		} else if (addModal.style.display === "flex") {
			document.querySelectorAll('input').forEach(input => input.disabled = false);
			closeAddModal();
		}
	}
}
document.addEventListener("keydown", cerrarModalESC);
// #endregion

function eliminarCuenta() {
	const button = document.getElementById("eliminar");
	const id = document.getElementById("RUT");
	button.addEventListener("click", () => {
		const confirmDelete = confirm(
			`¿Estás seguro de que deseas eliminar este perfil?`
		);
		if (confirmDelete) {
			fetch(`/delete_cliente/${id.value}/`, {
				method: "DELETE",
				headers: {
					"X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
						.value,
				},
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						alert("Cliente eliminado con éxito.");
						window.location.href = "front"
						document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
						document.cookie = "user_nombre=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
						document.cookie = "user_apellido=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
					} else {
						console.error("Error:", data.error);
						alert("Error al eliminar el elemento.");
					}
				})
				.catch((error) => {
					console.error("Error:", error);
					alert("Error al eliminar el elemento.");
				});
		}
	});
}

document.addEventListener("DOMContentLoaded", eliminarCuenta);


function editarCliente() {
	const usuarioForm = document.getElementById("usuarioForm");
	usuarioForm.addEventListener("submit", async event => {
		event.preventDefault();
		const formData = new FormData(usuarioForm);
		fetch("/edit_usuario/", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					alert("Cambios completados")

				} else {
					alert("Error")
				}
			}).catch(error => {
				console.error("Error:", error);
				alert("CATCH Error al guardar los cambios.");
			});
	})
}

document.addEventListener("DOMContentLoaded", editarCliente)

function togglePassword(button) {
	const input = button.previousElementSibling;
	const isHidden = input.type === "password";
	input.type = isHidden ? "text" : "password";
	button.textContent = isHidden ? "Mostrar" : "Ocultar";
}

/**
 * Recibe datos actualizados de los espacios
 * @returns {data}
 */
async function get_cantidad() {
	const editForm = document.getElementById("edit-form");
	const formData = new FormData(editForm);
	try {
		const response = await fetch("/get_horarios_usuario/", {
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

async function actualizar_capacidad() {
	const lugares = await get_cantidad();
	for (let index = 0; index < lugares.length; index++) {
		const element = document.getElementById(`espacio_${lugares[index].id}`);
		const lugar = lugares[index];
		element.innerHTML = `${lugar.nombre} - ${lugar.espacio_disponible}`;

	}
}

async function get_values() {
	await actualizar_capacidad();
}

document.addEventListener("input", get_values);

