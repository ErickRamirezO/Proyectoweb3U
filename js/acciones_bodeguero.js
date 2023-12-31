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
$('#restablecer_pro_btn').click(function(e) {
  e.preventDefault();
  cargarTodosRegistrosProductos();
  $("#restablecer_pro_btn").prop("disabled", true);
  $("input[type='text']").val("");
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
cargarTodosRegistrosProductos();
$('#buscar_btn').click(function(e) {
  e.preventDefault();
  var nombreBuscar = $('#codigo_buscar').val();
    const regex = /^[A-Za-z0-9\s/]+$/;
  if (!regex.test(nombreBuscar) || nombreBuscar.length > 45) {
    Swal.fire({
        icon: 'error',
        title: 'Campo inválido',
        text: 'Ingresa solo letras y asegúrate de que la longitud no exceda 45 caracteres.'
    });
    return;
  }
  $.ajax({
    type: 'POST',
    url: '../php/consultasBodeguero/buscarCompra.php',
    data: { nombreBuscar: nombreBuscar },
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
function cargarTodosRegistrosProductos(){ 
  $.ajax({
    type: 'GET',
    url: '../php/cargar_productos.php',
    success: function(response) {
     
      $('#tabla_body_productos').html(response);
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

function calcularTotal() {
  const cantidad = parseFloat($(".cantidad_compra").val());
  const costo = parseFloat($(".costo_compra").val());
  const total = isNaN(cantidad) || isNaN(costo) ? 0 : cantidad * costo;

  $("#total_compra").val(total.toFixed(2));
}

$(".cantidad_compra, .costo_compra").on("input change", function() {
  calcularTotal();
});

  


$('.comprar_nuevo_material_btn').click(async function(e) {
    e.preventDefault();
    var formulario = $(this).closest('#formulario_compras_nuevo');

    var nombreMaterial = formulario.find("input[name='nombre_compra']").val();
    var codigoCompra = formulario.find("input[name='codigo_compra']").val();
    var unidadMedida = formulario.find("select[name='unidad_medida_compra_opcion']").val();
    var fechaCompra = formulario.find("input[name='fecha_compra']").attr('placeholder');
    var [hora,fecha] = fechaCompra.split(' ');
    var costoCompra = formulario.find("input[name='costo_compra']").val().trim();
    var cantidadCompra = formulario.find("input[name='cantidad_compra']").val().trim();
    var precioTotalCompra = formulario.find("input[name='total_compra']").val().trim();

    var datosCompra = {
      nombreMaterial: nombreMaterial,
      codigoCompra: codigoCompra,
      unidadMedida: unidadMedida,
      fecha: fecha,
      hora: hora,
      costoCompra: costoCompra,
      cantidadCompra: cantidadCompra,
      precioTotalCompra: precioTotalCompra
    };
    // Validación de nombre de material
        if (!validarNombreMaterial(nombreMaterial)) {
          Swal.fire({
            icon: 'error',
            title: 'Campo incorrecto',
            text: 'El nombre del material debe contener ya sea letras o numeros'
          });
          return;
        }
    if (!validarCodigo(codigoCompra)) {
        Swal.fire({
            icon: 'error',
            title: 'Campo incorrecto',
            text: 'El campo Código debe tener 5 números enteros'
        });
        return;
    }
    // Validación de campos de costo y cantidad
    if (costoCompra === "") {
      Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: 'El campo Costo no puede estar en blanco'
      });
      return;
    }

    if (cantidadCompra === "") {
      Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: 'El campo Cantidad no puede estar en blanco'
      });
      return;
    }
  
    // Validación de código en la base de datos
    try {
      //verificar si ya existe el nombre de ese material
    const responseM = await verificarNombreMaterialEnBaseDeDatos(nombreMaterial);
      if (responseM === "Existe") {
        Swal.fire({
          icon: 'error',
          title: 'Nombre existente',
          text: 'El nombre de ese material ya existe, intenta con otro'
        });
        return;
    }
      const response = await verificarCodigoEnBaseDeDatos(codigoCompra);
      if (response === "Existe") {
        Swal.fire({
          icon: 'error',
          title: 'Código existente',
          text: 'El código ya existe, intente con otro'
        });
        return;
      }

      // Si todas las validaciones pasan, mostrar el SweetAlert final
      var detallesProducto = `<div>
        <h2>Detalles del nuevo material</h2>
        <p><strong>Nombre:</strong> ${nombreMaterial}</p>
        <p><strong>Código:</strong> ${codigoCompra}</p>
        <p><strong>Costo:</strong>$ ${costoCompra}</p>
        <p><strong>Cantidad:</strong> ${cantidadCompra} ${unidadMedida}</p>
        <p><strong>Total:</strong>$ ${precioTotalCompra}</p>
      </div>`;

      Swal.fire({
          html: detallesProducto + `
              <hr>
              <h3>¿Deseas comprar este nuevo material?</h3>`,
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
                    title: 'Compra realizada con éxito'
                  });
                  $("select[name='material_compra_opcion']").prop('selectedIndex', 0);
                  $("input[type='text']").val("");
                  //actualizar la lista de materiales en el select
                  actualizarListaMateriales();
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error al realizar la compra'
                  });
                }
                
              },
              error: function(error) {
                // Manejo de errores
                console.error("Error en la solicitud AJAX:", error);
              }
            });
          }
      });

    } catch (error) {
      console.error("Error en la verificación del código:", error);
    }
});

function validarNombreMaterial(nombre) {
    const regex = /^[A-Za-z0-9\s/]+$/;
    return regex.test(nombre) && nombre.length <= 45 && nombre.length > 1;
}


function validarCodigo(codigo) {
    const regex = /^\d{5}$/;
    return regex.test(codigo);
}

async function verificarNombreMaterialEnBaseDeDatos(nombreMaterial){
  try {
        const response = await $.ajax({
            type: "POST",
            url: "../php/consultasBodeguero/verificarNombre.php",
            data: { nombreMaterial: nombreMaterial },
        });

        return response;
    } catch (error) {
        console.error("Error en la solicitud AJAX:", error);
        return "Error";
    }
}

async function verificarCodigoEnBaseDeDatos(codigo) {
    try {
        const response = await $.ajax({
            type: "POST",
            url: "../php/consultasBodeguero/verificarCodigo.php",
            data: { codigo: codigo },
        });

        return response;
    } catch (error) {
        console.error("Error en la solicitud AJAX:", error);
        return "Error";
    }
}

$("#formulario_compras").submit(function(e) {
  e.preventDefault(); // Prevenir el envío del formulario por defecto

  // Validar el formulario antes de proceder
  if (!validarFormulario($(this))) {
    return; // No se ejecuta el código AJAX si no es válido
  }

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
          if (response === "Exito") {
            Swal.fire({
              icon: 'success',
              title: 'Compra realizada con éxito'
            });
            $("select[name='material_compra_opcion']").prop('selectedIndex', 0);
            $("input[type='text']").val("");
            $("input[type='number']").val("");
            document.title = "Compras";
            $('.titulo_compras').text("Compras");
            $(".nombre_compra").removeClass("w3-show").addClass("w3-hide");
            $(".guardar_btn").removeClass("w3-hide").addClass("w3-show");
            //actualizar la lista de materiales en el select
            actualizarListaMateriales();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ocurrió un error al realizar la compra'
            });
          }
        },
        error: function(xhr, status, error) {
          console.log("Error en la petición AJAX: " + error);
        }
      });
    }
  });
});


 function validarFormulario(formulario) {
  var costoCompra = parseFloat(formulario.find("input[name='costo_compra']").val().trim());
  var cantidadCompra = parseFloat(formulario.find("input[name='cantidad_compra']").val().trim());

  if (isNaN(costoCompra) || isNaN(cantidadCompra) || costoCompra <= 0 || cantidadCompra <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Campos incorrectos',
      text: 'Los campos Costo y Cantidad deben ser valores numéricos mayores a cero'
    });
    return false;
  }

  return true; // Si todas las validaciones pasan, el formulario es válido
}

  
//verificar que no se repitan los codigos 


$("#material_compra_opcion").change(function() {
   var selectedOption = $(this).val();
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
});

//FIN SECCION HACER COMPRAS