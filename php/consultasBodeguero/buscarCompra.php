<?php
include('dbconnection.php');
  $buscarCompra = mysqli_real_escape_string($con, $_POST['nombreBuscar']);
  $query = "SELECT *, (cantidad_material * costo_material) AS precio_total FROM materiales WHERE nombre_material = '$buscarCompra'";
  $materiales = mysqli_query($con, $query);
  if (mysqli_num_rows($materiales) == 0) {
    echo '<tr><th style="text-align:center; color:red;" colspan="6">No se han encontrado registros.</th></tr>';
  } else {
      while ($row = mysqli_fetch_assoc($materiales)) {
          echo '<tr>';
          echo '<td>' . $row['codigo_material'] . '</td>';
          echo '<td>' . $row['fecha_material'] . '</td>';
          echo '<td>' . $row['nombre_material'] . '</td>';
          echo '<td>' . $row['cantidad_material'] . '</td>';
          echo '<td>' . "$". $row['costo_material'] . '</td>';
          echo '<td>' . "$". number_format($row['precio_total'], 2) . '</td>';
          echo '</tr>';
      }
  }
?>
