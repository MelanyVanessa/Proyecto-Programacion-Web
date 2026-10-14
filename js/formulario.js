// Formulario de registro y edición de productos: validación con mensajes en la página

const form = document.getElementById("form-producto");
const modo = form.dataset.modo; // "registrar" o "editar"

const resumen = document.getElementById("resumen-errores");
const resumenTexto = document.getElementById("resumen-texto");
const resumenLista = document.getElementById("resumen-lista");
const mensaje = document.getElementById("mensaje");

const inputImagen = document.getElementById("imagen");
const archivoNombre = document.getElementById("archivo-nombre");

// Datos de ejemplo (todavía no se guardan en ningún lado)
const productos = {
  "MEL-H001": { nombre: "212 AQUA", categoria: "Hombre", descripcion: "Amaderado, calido especiado, citrico", precio: 80000, cantidad: 24, imagen: "212-aqua.jpg" },
  "MEL-H002": { nombre: "212 BLACK", categoria: "Hombre", descripcion: "Aromatico, avainillado, especiado suave", precio: 80000, cantidad: 18, imagen: "212-black.jpg" },
  "MEL-H003": { nombre: "212 RED", categoria: "Hombre", descripcion: "Dulce, aromático, fresco especiado", precio: 80000, cantidad: 12, imagen: "212-red.jpg" },
  "MEL-M001": { nombre: "GOOD GIRL BLUSH", categoria: "Mujer", descripcion: "Floral, avainillado, cítrico", precio: 80000, cantidad: 16, imagen: "good-girl-blush.jpg" },
  "MEL-M002": { nombre: "LA BOMBA", categoria: "Mujer", descripcion: "Floral, afrutado, ambarado", precio: 90000, cantidad: 8, imagen: "la-bomba.jpg" },
  "MEL-H004": { nombre: "LE MALE ELIXIR", categoria: "Hombre", descripcion: "Cálida, dulce, sensual", precio: 95000, cantidad: 10, imagen: "le-male-elixir.jpg" }
};

// ----- En modo edición, cargar el producto indicado en la URL -----
let codigoOriginal = "MEL-H001";

if (modo === "editar") {
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  if (codigo && productos[codigo]) {
    codigoOriginal = codigo;
    const p = productos[codigo];
    form.codigo.value = codigo;
    form.nombre.value = p.nombre;
    form.categoria.value = p.categoria;
    form.descripcion.value = p.descripcion;
    form.precio.value = p.precio;
    form.cantidad.value = p.cantidad;
    archivoNombre.textContent = p.imagen;
  }
  const nombreOriginal = productos[codigoOriginal].nombre;
  document.getElementById("subtitulo").textContent =
    nombreOriginal + " · Actualiza los datos del registro " + codigoOriginal + ".";
  document.getElementById("consejo-edicion").textContent =
    "Estás actualizando " + nombreOriginal + ", código " + codigoOriginal + ". Revisa los datos antes de guardar los cambios.";
  document.getElementById("resumen-pie").textContent =
    "Los demás datos se conservan. El registro " + nombreOriginal + " no se ha modificado.";
}

// ----- Reglas de validación -----
// Cada regla devuelve "" si el campo es válido, o el mensaje de error.
const reglas = {
  codigo: {
    etiqueta: "Código",
    resumen: "escribe un código válido.",
    validar: function (valor) {
      if (valor === "") return "Escribe el código del producto.";
      if (!/^MEL-[A-Z]\d{3}$/.test(valor.toUpperCase())) return "Usa el formato MEL-H001.";
      const repetido = productos[valor.toUpperCase()] && valor.toUpperCase() !== (modo === "editar" ? codigoOriginal : "");
      if (repetido) return "Ya existe un producto con este código.";
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
      const numero = Number(valor.replace(",", "."));
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

// ----- Envío del formulario -----
form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensaje.classList.remove("visible");

  const errores = [];
  Object.keys(reglas).forEach(function (nombre) {
    if (validarCampo(nombre) !== "") {
      errores.push(nombre);
    }
  });

  if (errores.length > 0) {
    resumenTexto.textContent = errores.length === 1
      ? "Corrige este campo para continuar:"
      : "Corrige estos " + errores.length + " campos para continuar:";
    resumenLista.innerHTML = "";
    errores.forEach(function (nombre) {
      const li = document.createElement("li");
      li.textContent = reglas[nombre].etiqueta + ": " + reglas[nombre].resumen;
      resumenLista.appendChild(li);
    });
    resumen.classList.add("visible");
    resumen.scrollIntoView({ behavior: "smooth", block: "start" });
    form.elements[errores[0]].focus({ preventScroll: true });
    return;
  }

  // Todo correcto (en esta entrega los datos aún no se guardan)
  resumen.classList.remove("visible");
  if (modo === "registrar") {
    mensaje.textContent = "El producto " + form.nombre.value.trim() + " se registró correctamente.";
    form.reset();
    archivoNombre.textContent = "Ningún archivo seleccionado";
  } else {
    mensaje.textContent = "Los cambios de " + form.nombre.value.trim() + " se guardaron correctamente.";
  }
  mensaje.classList.add("visible");
  mensaje.scrollIntoView({ behavior: "smooth", block: "start" });
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

// Mostrar el nombre del archivo elegido
inputImagen.addEventListener("change", function () {
  archivoNombre.textContent = inputImagen.files[0] ? inputImagen.files[0].name : "Ningún archivo seleccionado";
  validarCampo("imagen");
});
