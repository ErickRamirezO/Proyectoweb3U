<?php
session_start();

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['usuario'])) {
    // Si no ha iniciado sesión, redirigir a la página de inicio de sesión
    header('Location: ../index.php');
    exit();
}

$usuario = $_SESSION['usuario'];
if ($usuario === 'admin') {
    // Si es administrador, redirigir a la página de administrador
    header('Location: administrador.php');
    exit();
}elseif ($usuario === 'producción') {
    header('Location: produccion.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bodega</title>
    <link href="../css/estilo_administrador.css" rel="stylesheet" type="text/css" />
   <link href="../css/sidenav.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <div class="principal">
    <div class="encabezado">
        <div class="logo"><img src="../img/LOGO1.png"></div>
        <div class="informacion">
            <div class="nombre"><p>Nombre del usuario</p></div>
            <div class="user-logo"> <img src="../img/usuario-logo.png" alt=""></div>
            <div class="cerrar"><p> <a href="logout.php">Cerrar Sesión</a></p> </div>
        </div>
    </div>
    <div class="portada-usuarios">
        <img src="../img/portada_administrador1.jpg" alt="">
    </div> 
    <div class="contenido">
        
        <div class="segundo-contenido contenido-s">
            <div id="compra_b"> <p>Comprar</p></div>
            <div id="compra_v"><p>Ver compras</p></div>
            
        </div>
    </div>   
    </div>
    
</body>
</html>