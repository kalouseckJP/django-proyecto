// #region Validar inputs
// Usa el nombre del input, no su ID o tipo
function validarInputs(event) {
    // #region Restringir el campo de Telefono a un formato específico. "+56912345678", iniciando con +569 forzado
    if (event.target.name === "telefono") {
        const input = event.target;
        let value = input.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no válidos, excepto números

        // Asegurar que el prefijo "+569" siempre esté presente
        if (!value.startsWith("569")) {
            value = "569" + value;
        }

        // Limitar a un máximo de 12 caracteres (incluyendo el prefijo "+569")
        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length < 11) {
            input.setCustomValidity("Telefóno invalido");
        } else {
            input.setCustomValidity("");
        }
        
        // Agregar el "+" al inicio
        input.value = "+" + value;
    }
    // #endregion

    // #region Restringir el campo de RUT a un formato específico. "12345678-9"
    if (event.target.name === "RUT") {
        const input = event.target;
        let value = input.value.replace(/[^0-9kK]/g, ""); // Eliminar caracteres no válidos

        if (value.length > 0) {
            if (value.length > 9) {
                // Limitar a un máximo de 9 caracteres antes del guion y 1 después
                value = value.slice(0, 8) + "-" + value.slice(8, 9);
            } else if (value.length > 8) {
                // Agregar el guion automáticamente si tiene más de 8 caracteres
                value = value.slice(0, 8) + "-" + value.slice(8)
            }
            else if (value.length > 7) {
                // Agregar el guion automáticamente si tiene más de 8 caracteres
                value = value.slice(0, 7) + "-" + value.slice(7);
            }
        }

        let tmp = value.split('-');
        let rut = tmp[0];
        let digv = tmp[1];

        if (digv == 'K') {
            digv = 'k';
        }

        let M = 0, S = 1;
        for (; rut; rut = Math.floor(rut / 10)) {
            S = (S + rut % 10 * (9 - M++ % 6)) % 11;
        }
        S -= 1;
        if (S != digv) {
            input.setCustomValidity("RUT invalido.")
        } else {
            input.setCustomValidity("")

        }

        input.value = value;
    }
    // #endregion

    // #region Restringir el campo de visitas a un número positivo
    if (event.target.name === "visitas") {
        const input = event.target;
        let value = input.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no válidos, excepto números

        // Limitar a un máximo de 2 dígitos
        if (value.length > 2) {
            value = value.slice(0, 2);
        }

        input.value = value;
    }
    // #endregion

    // #region Restringir el campo de capacidad máxima a un número positivo
    if (event.target.name === "capacidadMaxima") {
        const input = event.target;
        let value = input.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no válidos, excepto números

        // Limitar a un máximo de 3 dígitos
        if (value.length > 3) {
            value = value.slice(0, 3);
        }

        input.value = value;
    }
    // #endregion

    // #region Restringir el campo de cantidad de personas a un número positivo
    if (event.target.name === "cantidad_personas") {
        const input = event.target;
        let value = input.value.replace(/[^0-9]/g, ""); // Eliminar caracteres no válidos, excepto números

        // Limitar a un máximo de 2 dígitos
        if (value.length > 2) {
            value = value.slice(0, 2);
        }

        input.value = value;
    }
    // #endregion
}

document.addEventListener("input", validarInputs);