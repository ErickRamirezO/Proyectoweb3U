//INICIO SECCION ver compras
function actualizarOrdenes(){
  $.ajax({
    type: 'GET',
    url: '../php/muestraproducto.php',
    success: function(response) {
      $('#informacionORDEN').html(response);
    }
  });
}

//VER ORDENES
$('#buscar_orden_btn').click(function(e) {
  e.preventDefault();
  var codigoBuscar = $('#codigo_buscar').val();
  $.ajax({
    type: 'POST',
    url: '../php/buscarOrden.php',
    data: { codigo_buscar: codigoBuscar },
    success: function(response) {
      $('#tabla_body_ordenes').html(response);
    }
  });
  $("#restablecer_orden_btn").removeAttr("disabled");
});

//recargar los datos 

$('#restablecer_orden_btn').click(function(e) {
  e.preventDefault();
  cargarTodosRegistrosOrden();
  $("#restablecer_orden_btn").prop("disabled", true);
  $("input[type='text']").val("");
});

//VER ORDENES
$('#submitOrdenBtn').click(function(e) {
  e.preventDefault();
  var codigoBuscar = $('#codigo_buscar').val();
  $.ajax({
    type: 'POST',
    url: '../php/muestraproducto.php',
    data: { codigo_buscar: codigoBuscar },
    success: function(response) {
      $('#tabla_body_ordenes').html(response);
    }
  });
  $("#restablecer_btn").removeAttr("disabled");
});


//FIN SECCION VER COMPRAS


// Cargar todos los registros al cargar la página
cargarTodosRegistros();
actualizarListaMateriales();
cargarTodosRegistrosOrden();
$('#buscar_btn').click(function(e) {
  e.preventDefault();
  var codigoBuscar = $('#codigo_buscar').val();
  $.ajax({
    type: 'POST',
    url: '../php/consultasBodeguero/buscarCompra.php',
    data: { codigo_buscar: codigoBuscar },
    success: function(response) {
      $('#tabla_body').html(response);
    }
  });
  $("#restablecer_btn").removeAttr("disabled");
});

$('#restablecer_btn').click(function(e) {
  e.preventDefault();
  cargarTodosRegistros();
  $("#restablecer_btn").prop("disabled", true);
  $("input[type='text']").val("");
});

function cargarTodosRegistros() {
  $.ajax({
    type: 'GET',
    url: '../php/consultasBodeguero/cargarDatosCompras.php',
    success: function(response) {
      $('#tabla_body').html(response);
    }
  });
}

function cargarTodosRegistrosOrden() {
  $.ajax({
    type: 'GET',
    url: '../php/cargarDatosOrden.php',
    success: function(response) {
      $('#tabla_body_ordenes').html(response);
    }
  });
}

//FIN SECCION ver compras

//INICIO SECCION HACER COMPRAS

function actualizarListaMateriales(){
  $.ajax({
    type: 'GET',
    url: '../php/consultasBodeguero/obtenerListaMateriales.php',
    success: function(response) {
      $('#material_compra_opcion').html(response);
    }
  });
}

$('.producto_btn').click(function(e) {
    e.preventDefault();
    var formulario = $(this).closest('#formulario_compras'); // Encontrar el formulario más cercano al botón
    var nombreMaterial = formulario.find("input[name='nombre_compra']").val();
    var codigoCompra = formulario.find("input[name='codigo_compra']").val();
    var fechaCompra = formulario.find("input[name='fecha_compra']").attr('placeholder');
    var [hora,fecha] = fechaCompra.split(' ');
    var costoCompra = formulario.find("input[name='costo_compra']").val();
    var cantidadCompra = formulario.find("input[name='cantidad_compra']").val();
    var precioTotalCompra = formulario.find("input[name='total_compra']").val();

    var datosCompra = {
      nombreMaterial: nombreMaterial,
      codigoCompra: codigoCompra,
      fecha: fecha,
      hora: hora,
      costoCompra: costoCompra,
      cantidadCompra: cantidadCompra,
      precioTotalCompra: precioTotalCompra
    };

    var detallesProducto = `<div>
        <h2>Detalles del Producto</h2>
        <p><strong>Nombre:</strong> ${nombreMaterial}</p>
        <p><strong>Código:</strong> ${codigoCompra}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Hora:</strong> ${hora}</p>
        <p><strong>Costo:</strong>$ ${costoCompra}</p>
        <p><strong>Cantidad:</strong> ${cantidadCompra}</p>
        <p><strong>Total:</strong>$ ${precioTotalCompra}</p>
    </div>`;

    Swal.fire({
        html: detallesProducto + `
            <hr>
            <h3>¿Deseas añadir este producto al inventario?</h3>`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            type: "POST",
            url: "../php/consultasBodeguero/agregarMaterialInventario.php",
            data: datosCompra, 
            success: function(response) {
              if (response === "Exito") {
                console.log("La inserción fue exitosa.");
                Swal.fire({
                  icon: 'success',
                  title: 'Producto añadido con éxito'
                });
                $("select[name='material_compra_opcion']").prop('selectedIndex', 0);
                $("input[type='text']").val("");
                document.title= "Compras";
                $('.titulo_compras').text("Compras");
                $(".nombre_compra").removeClass("w3-show").addClass("w3-hide");
                $(".guardar_btn").removeClass("w3-hide").addClass("w3-show");
                $(".producto_btn").removeClass("w3-show").addClass("w3-hide");
                //actualizar la lista de materiales en el select
                 actualizarListaMateriales();
              } else {
                console.log("Hubo un error en la inserción.");
              }
              
            },
            error: function(error) {
              // Manejo de errores
              console.error("Error en la solicitud AJAX:", error);
            }
          });
        }
    });
}); 

$(".cantidad_compra").on("input", function() {
    actualizarTotal();
});

$("#formulario_compras").submit(function(e) {
  e.preventDefault(); // Prevenir el envío del formulario por defecto
  var formData = $(this).serialize(); // Serializar los datos del formulario
  Swal.fire({
    icon: 'question',
    title: '¿Deseas realizar esta compra?',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: "../php/consultasBodeguero/agregarMaterial.php",
        data: formData, // Enviar datos serializados
        success: function(response) {
           Swal.fire({
                icon: 'success',
                title: 'Compra realizada con éxito'
            });
          $("select[name='material_compra_opcion']").prop('selectedIndex', 0);
          $("input[type='text']").val("");
        },
        error: function(xhr, status, error) {
          console.log("Error en la petición AJAX: " + error);
        }
      });
    }
  });
});

//verificar que no se repitan los codigos 


$("#material_compra_opcion").change(function() {
  var selectedOption = $(this).val();
  if (selectedOption === "nuevo_material") {
    document.title= "Añadir producto";
    $(".nombre_compra").removeClass("w3-hide").addClass("w3-show");
    $('.titulo_compras').text("Añadir producto a inventario");
    $(".guardar_btn").removeClass("w3-show").addClass("w3-hide");
    $(".producto_btn").removeClass("w3-hide").addClass("w3-show");
    //resetear los valor de los inputs
    $(".cantidad_compra, .costo_compra, #total_compra").val("");
    $("#codigo_compra").prop("readonly", false);
    $(".disminuir_cantidad, .aumentar_cantidad, .cantidad_compra, .costo_compra, .detalle_compra, #total_compra, #codigo_compra, #guardar_btn, #unidad_medida_compra_opcion").removeAttr("disabled");
    $("#codigo_compra, .costo_compra").removeAttr("readonly");
    $("#codigo_compra").val("");
  } else if(selectedOption !== ""){
    document.title= "Hacer compras";
    $('.titulo_compras').text("Compras");
    $(".nombre_compra").removeClass("w3-show").addClass("w3-hide");
    $(".guardar_btn").removeClass("w3-hide").addClass("w3-show");
    $(".producto_btn").removeClass("w3-show").addClass("w3-hide");
    $(".disminuir_cantidad, .aumentar_cantidad, .cantidad_compra, .costo_compra, .detalle_compra, #total_compra, #codigo_compra, .guardar_btn, #unidad_medida_compra_opcion").removeAttr("disabled");
    $.ajax({
      type: "POST",
      url: "../php/consultasBodeguero/obtenerMaterial.php",
      data: { id_material: parseInt(selectedOption) },
      dataType: "json", // Indicamos que esperamos una respuesta JSON
      success: function(response) {
        if ("error" in response) {
          console.log(response);
        } else {
          // Rellenar los campos de entrada con los valores del material
          console.log(response);
          $(".costo_compra").val(response.costo_material);
          $("#codigo_compra").val(response.codigo_material);
          $("#codigo_compra").prop("readonly", true);
          $(".cantidad_compra").val(response.cantidad_material);
          $("#total_compra").val(parseFloat((response.precio_total)).toFixed(2));
        }
      }
    });
  }
});

//FIN SECCION HACER COMPRAS