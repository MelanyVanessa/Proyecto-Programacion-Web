// Formulario de registro y edición de productos: validación con mensajes en la página
// y guardado de los datos

const form = document.getElementById("form-producto");
const modo = form.dataset.modo; // "registrar" o "editar"

const resumen = document.getElementById("resumen-errores");
const resumenTexto = document.getElementById("resumen-texto");
const resumenLista = document.getElementById("resumen-lista");
const mensaje = document.getElementById("mensaje");

const inputImagen = document.getElementById("imagen");
const archivoNombre = document.getElementById("archivo-nombre");
const vistaPrevia = document.getElementById("vista-previa");
const SIN_ARCHIVO = "Ningún archivo seleccionado";

// En edición: código e imagen que tenía el producto antes de modificarlo
let codigoOriginal = "";
let imagenActual = "";

// ----- En modo edición, cargar el producto indicado en la URL -----
function mostrarTextosEdicion(producto) {
  document.getElementById("subtitulo").textContent =
    producto.nombre + " · Actualiza los datos del registro " + producto.codigo + ".";
  document.getElementById("consejo-edicion").textContent =
    "Estás actualizando " + producto.nombre + ", código " + producto.codigo + ". Revisa los datos antes de guardar los cambios.";
  document.getElementById("resumen-pie").textContent =
    "Los demás datos se conservan. El registro " + producto.nombre + " no se ha modificado.";
}

function llenarFormulario(producto) {
  form.codigo.value = producto.codigo;
  form.nombre.value = producto.nombre;
  form.categoria.value = producto.categoria;
  form.descripcion.value = producto.descripcion;
  form.precio.value = producto.precio;
  form.cantidad.value = producto.cantidad;
  form.estado.value = producto.estado;
  form.nuevo.value = producto.nuevo || "";
  archivoNombre.textContent = producto.imagen || SIN_ARCHIVO;
}

function cargarProductoAEditar() {
  const codigo = new URLSearchParams(window.location.search).get("codigo");
  const producto = buscarProducto(codigo);
  if (!producto) {
    window.location.href = "index.html"; // no existe: volver al listado
    return;
  }
  codigoOriginal = producto.codigo;
  imagenActual = producto.imagen;
  llenarFormulario(producto);
  mostrarTextosEdicion(producto);
}

if (modo === "editar") {
  cargarProductoAEditar();
}

// "250.000" o "250000" -> 250000; "80,5" -> 80.5 (el punto es separador de miles)
function convertirPrecio(texto) {
  return Number(texto.trim().replace(/\./g, "").replace(",", "."));
}

// ----- Reglas de validación -----
// Cada regla devuelve "" si el campo es válido, o el mensaje de error.
const reglas = {
  codigo: {
    etiqueta: "Código",
    resumen: "escribe un código válido.",
    validar: function (valor) {
      const codigo = valor.toUpperCase();
      if (valor === "") return "Escribe el código del producto.";
      if (!/^MEL-[A-Z]\d{3}$/.test(codigo)) return "Usa el formato MEL-H001.";
      if (existeCodigo(codigo) && codigo !== codigoOriginal) return "Ya existe un producto con este código.";
      return "";
    }
  },
  nombre: {
    etiqueta: "Nombre",
    resumen: "escribe el nombre del producto.",
    validar: function (valor) {
      if (valor === "") return "Escribe el nombre del producto.";
      return "";
    }
  },
  categoria: {
    etiqueta: "Categoría",
    resumen: "selecciona una opción.",
    validar: function (valor) {
      if (valor === "") return "Selecciona Hombre, Mujer o Lujo.";
      return "";
    }
  },
  descripcion: {
    etiqueta: "Descripción",
    resumen: "describe las notas de la fragancia.",
    validar: function (valor) {
      if (valor === "") return "Describe las notas y el carácter de la fragancia.";
      return "";
    }
  },
  precio: {
    etiqueta: "Precio",
    resumen: "debe ser mayor que 0.",
    validar: function (valor) {
      const numero = convertirPrecio(valor);
      if (valor === "" || isNaN(numero) || numero <= 0) return "Ingresa un precio mayor que 0 COP.";
      return "";
    }
  },
  cantidad: {
    etiqueta: "Cantidad",
    resumen: "usa un número entero desde 0.",
    validar: function (valor) {
      if (!/^\d+$/.test(valor)) return "Ingresa un entero igual o mayor que 0; no uses decimales.";
      return "";
    }
  },
  imagen: {
    etiqueta: "Imagen",
    resumen: "debe ser JPG o PNG de máximo 5 MB.",
    validar: function () {
      const archivo = inputImagen.files[0];
      if (!archivo) return ""; // es opcional
      if (!/\.(jpe?g|png)$/i.test(archivo.name)) return "La imagen debe ser JPG o PNG.";
      if (archivo.size > 5 * 1024 * 1024) return "La imagen no puede pesar más de 5 MB.";
      return "";
    }
  },
  estado: {
    etiqueta: "Estado",
    resumen: "selecciona un estado.",
    validar: function (valor) {
      if (valor === "") return "Selecciona Activo o Inactivo.";
      return "";
    }
  },
  nuevo: {
    etiqueta: "Nuevo",
    resumen: "selecciona 1, 2 o 3.",
    validar: function (valor) {
      if (valor === "") return "Selecciona 1, 2 o 3.";
      return "";
    }
  }
};

// Valida un campo, muestra u oculta su mensaje y devuelve el error
function validarCampo(nombre) {
  const campo = form.elements[nombre];
  const valor = nombre === "imagen" ? "" : campo.value.trim();
  const error = reglas[nombre].validar(valor);

  document.getElementById("error-" + nombre).textContent = error;
  campo.closest(".campo").classList.toggle("invalido", error !== "");
  return error;
}

// Valida todos los campos y devuelve los nombres de los que tienen error
function validarFormulario() {
  return Object.keys(reglas).filter(function (nombre) {
    return validarCampo(nombre) !== "";
  });
}

function mostrarResumenErrores(errores) {
  resumenTexto.textContent = errores.length === 1
    ? "Corrige este campo para continuar:"
    : "Corrige estos " + errores.length + " campos para continuar:";
  resumenLista.innerHTML = "";
  errores.forEach(function (nombre) {
    const texto = reglas[nombre].etiqueta + ": " + reglas[nombre].resumen;
    resumenLista.appendChild(crearElemento("li", "", texto));
  });
  resumen.classList.add("visible");
  resumen.scrollIntoView({ behavior: "smooth", block: "start" });
  form.elements[errores[0]].focus({ preventScroll: true });
}

// Arma el objeto producto con los valores ya validados del formulario
function leerProductoDelFormulario() {
  return {
    codigo: form.codigo.value.trim().toUpperCase(),
    nombre: form.nombre.value.trim(),
    categoria: form.categoria.value,
    descripcion: form.descripcion.value.trim(),
    precio: convertirPrecio(form.precio.value),
    cantidad: Number(form.cantidad.value.trim()),
    imagen: inputImagen.files[0] ? inputImagen.files[0].name : imagenActual,
    estado: form.estado.value,
    nuevo: form.nuevo.value
  };
}

function registrarProducto(producto) {
  agregarProducto(producto);
  form.reset();
  archivoNombre.textContent = SIN_ARCHIVO;
  ocultarVistaPrevia();
  mostrarMensaje(mensaje, "El producto " + producto.nombre + " se registró correctamente.");
}

function guardarCambios(producto) {
  actualizarProducto(codigoOriginal, producto);
  codigoOriginal = producto.codigo;
  imagenActual = producto.imagen;
  mostrarTextosEdicion(producto);
  mostrarMensaje(mensaje, "Los cambios de " + producto.nombre + " se guardaron correctamente.");
}

// ----- Envío del formulario -----
form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  ocultarMensaje(mensaje);

  const errores = validarFormulario();
  if (errores.length > 0) {
    mostrarResumenErrores(errores);
    return;
  }

  resumen.classList.remove("visible");
  const producto = leerProductoDelFormulario();
  if (modo === "registrar") {
    registrarProducto(producto);
  } else {
    guardarCambios(producto);
  }
});

// Quitar el error del campo en cuanto el usuario lo corrige
Object.keys(reglas).forEach(function (nombre) {
  const campo = form.elements[nombre];
  const tipoEvento = campo.tagName === "SELECT" || nombre === "imagen" ? "change" : "input";
  campo.addEventListener(tipoEvento, function () {
    if (campo.closest(".campo").classList.contains("invalido")) {
      validarCampo(nombre);
    }
  });
});

// ----- Vista previa de la imagen elegida -----
// Solo se muestra mientras se llena el formulario; la imagen no se guarda en localStorage
function ocultarVistaPrevia() {
  if (vistaPrevia.src) URL.revokeObjectURL(vistaPrevia.src); // libera la memoria de la anterior
  vistaPrevia.removeAttribute("src");
  vistaPrevia.classList.remove("visible");
}

function mostrarVistaPrevia(archivo) {
  ocultarVistaPrevia();
  vistaPrevia.src = URL.createObjectURL(archivo);
  vistaPrevia.classList.add("visible");
}

// Mostrar el nombre y la vista previa del archivo elegido
inputImagen.addEventListener("change", function () {
  const archivo = inputImagen.files[0];
  archivoNombre.textContent = archivo ? archivo.name : (imagenActual || SIN_ARCHIVO);
  const esValida = validarCampo("imagen") === "";
  if (archivo && esValida) {
    mostrarVistaPrevia(archivo);
  } else {
    ocultarVistaPrevia();
  }
});
