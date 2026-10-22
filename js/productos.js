// Listado de productos: se construye con el DOM a partir de los datos guardados,
// con búsqueda, filtros por categoría y confirmación de eliminación

const buscador = document.getElementById("buscar");
const botonesFiltro = document.querySelectorAll(".filtro");
const lista = document.getElementById("lista-productos");
const sinResultados = document.getElementById("sin-resultados");
const mensaje = document.getElementById("mensaje");

const modal = document.getElementById("modal-eliminar");
const btnCancelar = document.getElementById("cancelar-eliminar");
const btnConfirmar = document.getElementById("confirmar-eliminar");

let filtroActual = "Todos";
let codigoAEliminar = null;

// ----- Construcción de las filas -----
function crearCeldaNombre(producto) {
  const celda = crearElemento("td", "td-nombre nombre");
  celda.append(
    crearElemento("strong", "", producto.nombre),
    crearElemento("span", "categoria-movil", producto.categoria),
    crearElemento("small", "", producto.descripcion)
  );
  return celda;
}

function crearCeldaCantidad(producto) {
  const celda = crearElemento("td", "td-cantidad", producto.cantidad + " ");
  celda.appendChild(crearElemento("span", "disponibles", "disponibles"));
  return celda;
}

function crearCeldaEstado(producto) {
  const clase = producto.estado === "Activo" ? "estado" : "estado inactivo";
  const celda = crearElemento("td", "td-estado");
  celda.appendChild(crearElemento("span", clase, producto.estado));
  return celda;
}

function crearCeldaAcciones(producto) {
  const enlaceEditar = crearElemento("a", "btn btn-chico btn-editar", "Editar");
  enlaceEditar.href = "editar.html?codigo=" + encodeURIComponent(producto.codigo);

  const botonEliminar = crearElemento("button", "btn btn-chico btn-eliminar", "Eliminar");
  botonEliminar.type = "button";
  botonEliminar.dataset.codigo = producto.codigo;

  const acciones = crearElemento("div", "acciones");
  acciones.append(enlaceEditar, botonEliminar);

  const celda = crearElemento("td", "td-acciones");
  celda.appendChild(acciones);
  return celda;
}

function crearFilaProducto(producto) {
  const fila = document.createElement("tr");
  fila.append(
    crearElemento("td", "td-codigo codigo", producto.codigo),
    crearCeldaNombre(producto),
    crearElemento("td", "td-categoria", producto.categoria),
    crearElemento("td", "td-precio", formatearPrecio(producto.precio)),
    crearCeldaCantidad(producto),
    crearCeldaEstado(producto),
    crearCeldaAcciones(producto)
  );
  return fila;
}

// ----- Pintar el listado (se llama al cargar, al buscar, al filtrar y al eliminar) -----
function mostrarListado() {
  const productos = obtenerProductos();
  const visibles = filtrarProductos(productos, buscador.value, filtroActual);

  lista.innerHTML = "";
  visibles.forEach(function (producto) {
    lista.appendChild(crearFilaProducto(producto));
  });

  document.getElementById("total").textContent = productos.length;
  document.getElementById("total-pie").textContent = productos.length;
  document.getElementById("mostrando").textContent = visibles.length;
  sinResultados.textContent = productos.length === 0
    ? "Aún no hay productos registrados."
    : "No se encontraron productos.";
  sinResultados.style.display = visibles.length === 0 ? "block" : "none";
}

buscador.addEventListener("input", mostrarListado);

botonesFiltro.forEach(function (boton) {
  boton.addEventListener("click", function () {
    botonesFiltro.forEach(function (b) {
      b.classList.remove("activo");
    });
    boton.classList.add("activo");
    filtroActual = boton.dataset.filtro;
    mostrarListado();
  });
});

// ----- Modal de eliminación -----
function abrirModal(codigo) {
  const producto = buscarProducto(codigo);
  if (!producto) return;

  codigoAEliminar = codigo;
  document.getElementById("modal-nombre").textContent = producto.nombre;
  document.getElementById("modal-detalle").textContent =
    producto.codigo + " · " + producto.categoria + " · " + producto.estado;
  document.getElementById("modal-descripcion").textContent = producto.descripcion;
  document.getElementById("modal-precio").textContent =
    "COP " + formatearPrecio(producto.precio) + " · " + producto.cantidad + " unidades disponibles";
  modal.classList.add("abierto");
  btnCancelar.focus();
}

function cerrarModal() {
  modal.classList.remove("abierto");
  codigoAEliminar = null;
}

lista.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".btn-eliminar");
  if (boton) {
    abrirModal(boton.dataset.codigo);
  }
});

btnCancelar.addEventListener("click", cerrarModal);

btnConfirmar.addEventListener("click", function () {
  const producto = buscarProducto(codigoAEliminar);
  if (producto) {
    eliminarProducto(producto.codigo);
    mostrarListado();
    mostrarMensaje(mensaje, "El producto " + producto.nombre + " fue eliminado del catálogo.");
  }
  cerrarModal();
});

// Cerrar al hacer clic fuera del modal
modal.addEventListener("click", function (evento) {
  if (evento.target === modal) {
    cerrarModal();
  }
});

// Cerrar con la tecla Escape
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && modal.classList.contains("abierto")) {
    cerrarModal();
  }
});

mostrarListado();
