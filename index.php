<?php
include('php/dbconnection.php');
session_start();

// Verificar si el usuario ha iniciado sesión
if (isset($_SESSION['tipo_usuario'])) {
    // Redirigir según el rol del usuario
    redirigirSegunRol($_SESSION['tipo_usuario']);
    exit();
}

// Verificar las credenciales y si son válidas, guardar los datos del usuario en la sesión
if (isset($_POST['usuario']) && isset($_POST['contraseña'])) {
    $usuario = $_POST['usuario'];
    $contraseña = $_POST['contraseña'];

    $validacion = credenciales_son_validas($usuario, $contraseña);

    if ($validacion === true) {
        $tipo_usuario = obtener_tipo_usuario($usuario);
        $nombre_usuario = obtener_nombre_usuario($usuario);
        $id_usuario = obtener_id($usuario);
        
        // VARIABLES PARA LA SESION
        $_SESSION['tipo_usuario'] = $tipo_usuario;
        $_SESSION['nombre_usuario'] = $nombre_usuario;
        $_SESSION['id_usuario'] = $id_usuario;
        
        redirigirSegunRol($tipo_usuario);
        exit();
    } else {
        $mensajeError = $validacion; // Mostrar el mensaje de error de la validación
    }
}


function obtener_tipo_usuario($usuario) {
    global $con;
    $query = "SELECT tipo_usuario FROM usuario WHERE usuario='$usuario'";
    $result = mysqli_query($con, $query);
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        return $row['tipo_usuario'];
    }
    return false;
}

function obtener_nombre_usuario($usuario){
   global $con;
    $query = "SELECT nombre FROM usuario WHERE usuario='$usuario'";
    $result = mysqli_query($con, $query);
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        return $row['nombre'];
    }
    return false;
}
///////////////////////////////////////////////////////////////
function obtener_id($usuario){
   global $con;
    $query = "SELECT id_usuario FROM usuario WHERE usuario='$usuario'";
    $result = mysqli_query($con, $query);
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        return $row['id_usuario'];
    }
    return false;
}

function credenciales_son_validas($usuario, $contraseña) {
    global $con;
    $query = "SELECT * FROM usuario WHERE usuario='$usuario'";
    $result = mysqli_query($con, $query);
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        if ($row != NULL) {
            $contraseña_db = $row['contraseña'];
            $contraseña_ingresada_md5 = md5($contraseña);
            
            if ($contraseña_ingresada_md5 === $contraseña_db) {
                if ($row['activo'] == 0) {
                    return true;
                } else {
                    return "Usuario inactivo. Contacta al administrador.";
                }
            } else {
                return "Credenciales inválidas. Inténtalo nuevamente.";
            }
        } else {
            return "Credenciales inválidas. Inténtalo nuevamente.";
        }
    }
}


function redirigirSegunRol($tipo_usuario) {
    if ($tipo_usuario === 'producción') {
        header('Location: php/produccion.php');
    } elseif ($tipo_usuario === 'administrador') {
        header('Location: php/administrador.php');
    } elseif ($tipo_usuario === 'bodeguero') {
        header('Location: php/bodeguero.php');
    }elseif ($tipo_usuario === 'superU') {
        header('Location: php/SuperUsuario.php');
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de Sesión</title>
    <link rel="icon" href="../img/icon_logo.png" type="image/png" sizes="32x32"/>
    <link href="css/estilo_inicio.css" rel="stylesheet" type="text/css" />
	 <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
	<!-- SweetAlert 2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.2/dist/sweetalert2.min.js"></script>
    <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.2/dist/sweetalert2.min.css"
        />
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
</head>
<body>
  <img class="logo_index" src="img/logo.png" alt="logo_innovaGenius">
    <div class="principal">
        <div class="Login">
            <div class="portada-login w3-hide-small">
                <img src="img/portada1.jpg"/>
            </div>
            <div class="Inicio">
                <div class="Inicio-login">
                    <form id="login-form" action="index.php" method="post">
                        <label for="usuario">Usuario</label><br>
                        <input type="text" name="usuario" id="usuario"><br>
                        <label for="contraseña">Contraseña</label><br>
                        <input type="password" name="contraseña" id="contraseña"><?php if (isset($mensajeError)) { ?>
                        <p align="center" style="color:red;"><?php echo $mensajeError; ?></p><br>
                    <?php } ?>
                        <input type="submit" name="button" id="button" class="w3-btn" value="Iniciar sesión">
                    </form>
                </div>
            </div>
        </div>
    </div>
	<script>
$(document).ready(function() {
    $("#login-form").submit(function(event) {
        const usuario = $("#usuario").val();
        const contraseña = $("#contraseña").val();

        if ($.trim(usuario) === "" || $.trim(contraseña) === "") {
            event.preventDefault(); // Evita que el formulario se envíe
            mostrarAlerta("Campos en blanco", "Por favor, completa todos los campos.");
        }
    });

    function mostrarAlerta(titulo, mensaje) {
        Swal.fire({
            icon: "error",
            title: titulo,
            text: mensaje
        });
    }
});
</script>
</body>
</html>
