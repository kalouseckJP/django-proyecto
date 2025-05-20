// #region Validar login
function loginValidar(event) {
    const loginForm = document.getElementById("loginForm")

    loginForm.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(loginForm);

        await fetch("/leer_admin/", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "admin";
                } else {
                    alert("Usuario o contraseña incorrectos");
                }
            })
    })
}

document.addEventListener("DOMContentLoaded", loginValidar);
// #endregion