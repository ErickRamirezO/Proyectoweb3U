<?php
session_start();
include('dbconnection.php');
// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['tipo_usuario'])) {
    // Si no ha iniciado sesión, redirigir a la página de inicio de sesión
    header('Location: ../index.php');
    exit();
}

$tipo_usuario = $_SESSION['tipo_usuario'];
$nombre_usuario = $_SESSION['nombre_usuario'];
if ($tipo_usuario === 'administrador') {
    // Si es administrador, redirigir a la página de administrador
    header('Location: administrador.php');
    exit();
}elseif ($tipo_usuario === 'producción') {
    header('Location: produccion.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ver Compras</title>
  <link rel="icon" href="../img/icon_logo.png" type="image/png" sizes="32x32"/>
    <link href="../css/estilo_administrador.css" rel="stylesheet" type="text/css" />
  <link href="../css/estilo_produccion.css" rel="stylesheet" type="text/css" />
  <link href="../css/sidenav.css" rel="stylesheet" type="text/css">
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
  <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <!-- SweetAlert 2 -->
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.2/dist/sweetalert2.min.js"></script>
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/sweetalert2@11.1.2/dist/sweetalert2.min.css"
        />
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <style>
    .contenido{
      width:80%;
      margin:auto;
    }
  </style>
</head>
<body>
    <div class="principal">
      <?php 
        include "sidenav_bodeguero_module.php"
      ?>
      <div class="encabezado">
          <div class="logo"><img src="../img/logo_alternativo.png"></div>
          <div class="informacion">
              <div class="nombre"><p><?php echo $nombre_usuario?></p></div>
              <div class="user-logo"><i class="fa-solid fa-user fa-2xl"></i></div>
              <div class="cerrar" id="cerrar_sesion"><p>Cerrar Sesión</p> </div>
          </div>
      </div>
        <span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776;</span>
      <div class="contenido">
          <h1 align="center">Ver compras</h1>
        <form method="post" id="formulario_ver_compras">
            <button class="w3-btn w3-round-large w3-blue" type="submit" name="buscar">Buscar</button>
          <input type="text" name="codigo_buscar" placeholder="Ingrese el código del producto" style="width:250px;">
        </form><br>
        <div class="w3-responsive">
          <table class="w3-table-all">
            <thead>
              <tr class="w3-light-grey">
                <th>Código</th>
                <th>Fecha</th>
                <th>Detalle</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Precio total</th>
              </tr>
            </thead>
            <tbody>
              <?php 
                if (isset($_POST['codigo_buscar'])) {
                  $buscarCompra = mysqli_real_escape_string($con, $_POST['codigo_buscar']);
                  $query = "SELECT *, (cantidad_material * costo_material) AS precio_total FROM materiales WHERE codigo_material LIKE '$buscarCompra%'";
                  $materiales = mysqli_query($con, $query);
                } else {
                  $materiales = mysqli_query($con,"SELECT *, (cantidad_material * costo_material) AS precio_total FROM materiales;");
                }
                if (mysqli_num_rows($materiales) == 0) {
              ?>
                  <tr>
                    <th style="text-align:center; color:red;" colspan="6">No se han encontrado registros.</th>
                  </tr>
              <?php 
                } else {
                  while ($row = mysqli_fetch_assoc($materiales)) {
              ?>
                    <tr>
                      <td><?php echo $row['codigo_material']; ?></td>
                       <!--cambiar a la fecha-->
                        <td><?php echo $row['codigo_material']; ?></td>
                        <!--cambiar a la fecha-->
                      <td><?php echo $row['nombre_material']; ?></td>
                      <td><?php echo $row['cantidad_material']; ?></td>
                      <td><?php echo $row['costo_material']; ?></td>
                      <td><?php echo $row['precio_total']; ?></td>
                    </tr>
              <?php
                  }
                }
              ?>
            </tbody>
          </table>
        </div> 
      </div>  
    </div>
  <script src="../js/cerrarSesion.js"></script>
  <script src="../js/sidenav.js"></script>
</body>
</html>