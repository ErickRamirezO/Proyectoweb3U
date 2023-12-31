const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const cedulaInput = document.getElementById('cedula');
const tipoEmpleadoSelect = document.getElementById('tipo_empleado');
const userInput = document.getElementsByName('user')[0];
const contraseñaInput = document.getElementById('contraseña');

nombreInput.addEventListener('input', function() {
    if (!/^[A-Za-zÁ-Úá-úñÑ\s]+$/.test(nombreInput.value)) {
        setErrorField(nombreInput, 'Solo se permiten letras y espacios');
        disableFieldsExcept(nombreInput);
    } else {
        setSuccessField(nombreInput);
        enableFields();
    }
});

apellidoInput.addEventListener('input', function() {
    if (!/^[A-Za-zÁ-Úá-úñÑ\s]+$/.test(apellidoInput.value)) {
        setErrorField(apellidoInput, 'Solo se permiten letras y espacios');
        disableFieldsExcept(apellidoInput);
    } else {
        setSuccessField(apellidoInput);
        enableFields();
    }
});

cedulaInput.addEventListener('input', function() {
    if (!/^[0-9]+$/.test(cedulaInput.value) || cedulaInput.value.length !== 10) {
        setErrorField(cedulaInput, 'Ingrese una cédula válida de 10 dígitos');
        disableFieldsExcept(cedulaInput);
    } else {
        setSuccessField(cedulaInput);
        enableFields();
    }
});

cedulaInput.addEventListener('input', function() {
    const cedula = cedulaInput.value;
    if (!/^[0-9]+$/.test(cedula) || cedula.length !== 10) {
        setErrorField(cedulaInput, 'Ingrese una cédula válida de 10 dígitos');
        disableFieldsExcept(cedulaInput);
    } else if (!validarCedulaEcuatoriana(cedula)) {
        setErrorField(cedulaInput, 'Ingrese una cédula ecuatoriana válida');
        disableFieldsExcept(cedulaInput);
    } else {
        setSuccessField(cedulaInput);
        enableFields();
    }
});

// Función para validar cédulas ecuatorianas
function validarCedulaEcuatoriana(cedula) {
    if (cedula.length !== 10) {
        return false;
    }
    
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const provincia = parseInt(cedula.substring(0, 2));
    
    if (provincia < 1 || provincia > 24) {
        return false;
    }
    
    let suma = 0;
    
    for (let i = 0; i < coeficientes.length; i++) {
        let producto = parseInt(cedula.charAt(i)) * coeficientes[i];
        if (producto >= 10) {
            producto -= 9;
        }
        suma += producto;
    }
    
    const digitoVerificadorCalculado = 10 - (suma % 10);
    const digitoVerificador = parseInt(cedula.charAt(9));
    
    if (digitoVerificador === 0) {
        return digitoVerificadorCalculado === 0;
    } else {
        return digitoVerificadorCalculado === digitoVerificador;
    }
}

function enableFields() {
    nombreInput.disabled = false;
    apellidoInput.disabled = false;
    cedulaInput.disabled = false;
    tipoEmpleadoSelect.disabled = false;
    userInput.disabled = false;
    contraseñaInput.disabled = false;
}

function disableFieldsExcept(except) {
    if (except !== nombreInput) nombreInput.disabled = true;
    if (except !== apellidoInput) apellidoInput.disabled = true;
    if (except !== cedulaInput) cedulaInput.disabled = true;
    if (except !== tipoEmpleadoSelect) tipoEmpleadoSelect.disabled = true;
    if (except !== userInput) userInput.disabled = true;
    if (except !== contraseñaInput) contraseñaInput.disabled = true;
}

function setErrorField(element, errorMessage) {
    element.classList.remove('success-field');
    element.classList.add('error-field');
    element.nextElementSibling.textContent = errorMessage;
    element.style.borderColor = 'red';
}

function setSuccessField(element) {
    element.classList.remove('error-field');
    element.classList.add('success-field');
    element.nextElementSibling.textContent = '';
    element.style.borderColor = 'green';
}

// Habilitar todos los campos al principio (Editables)
enableFields();

// Cambiar color de borde a verde al tener datos válidos 
userInput.addEventListener('input', function() {
    if (userInput.value.trim() !== '') {
        userInput.style.borderColor = 'green';
    } else {
        userInput.style.borderColor = '';
    }
});

contraseñaInput.addEventListener('input', function() {
    if (contraseñaInput.value.trim() !== '') {
        contraseñaInput.style.borderColor = 'green';
    } else {
        contraseñaInput.style.borderColor = '';
    }
});

tipoEmpleadoSelect.addEventListener('change', function() {
    if (tipoEmpleadoSelect.value !== '') {
        tipoEmpleadoSelect.style.borderColor = 'green';
    } else {
        tipoEmpleadoSelect.style.borderColor = '';
    }
});
