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
function editaElemento(event) {
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
        .then((response) => response.json())
        .then((data) => {
          modalTitle.textContent = `Editar ${
            type.charAt(0).toUpperCase() + type.slice(1)
          }`;

          modalFields.innerHTML = "";
          if (type === "reserva") {
            modalFields.innerHTML = `
                            <input type="hidden" name="id" value="${data.id}">
                            <label for="add-fecha">Fecha y Hora:</label>
                            <input type="datetime-local" id="add-fecha" name="fecha_reserva" value="${data.now}" min="${data.now}" required>
                            <label for="edit-cantidad">Cantidad de Personas:</label>
                            <input type="number" id="edit-cantidad" name="cantidad_personas" value="${data.cantidad_personas}" min="1" required>
                            <label for="edit-lugar">Lugar:</label>
                            <select id="edit-lugar" name="espacio" required>
                                <option value="">Seleccione un lugar</option>
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
                  lugarSelect.appendChild(option);
                });
              })
              .catch((error) => {
                console.error("Error fetching lugares:", error);
              });
          }
          modal.style.display = "flex";
        });
    });
  });

  window.closeModal = function () {
    modal.style.display = "none";
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
          } else if (type === "cliente") {
            row.querySelector("td:nth-child(2)").textContent =
              data.nombre || "N/A";
            row.querySelector("td:nth-child(3)").textContent =
              data.apellido || "N/A";
            row.querySelector("td:nth-child(4)").textContent =
              data.telefono || "N/A";
            row.querySelector("td:nth-child(5)").textContent =
              data.email || "N/A";
            row.querySelector("td:nth-child(6)").textContent =
              data.visitas || "N/A";
          } else if (type === "lugar") {
            row.querySelector("td:nth-child(2)").textContent =
              data.nombre || "N/A";
            row.querySelector("td:nth-child(3)").textContent =
              data.capacidadMaxima || "N/A";
            row.querySelector("td:nth-child(5)").textContent =
              data.descripcion || "N/A";
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

document.addEventListener("DOMContentLoaded", editaElemento);
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
                `${
                  type.charAt(0).toUpperCase() + type.slice(1)
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
  };
}
document.addEventListener("DOMContentLoaded", cerrarModalFuera);
// #endregion

// #region Cerrar el modal al presionar la tecla "Esc"
function cerrarModalESC(event) {
  if (event.key === "Escape") {
    const editModal = document.getElementById("edit-modal");
    if (editModal.style.display === "flex") {
      closeModal();
    } else if (addModal.style.display === "flex") {
      closeAddModal();
    }
  }
}
document.addEventListener("keydown", cerrarModalESC);
// #endregion

function eliminarCuenta() {
  const button = document.getElementById("eliminar");
  const id = document.getElementById("rut-cliente");
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


function editar_cliente() {
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    
}