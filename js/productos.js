// Listado de productos: búsqueda, filtros por categoría y confirmación de eliminación

const buscador = document.getElementById("buscar");
const botonesFiltro = document.querySelectorAll(".filtro");
const lista = document.getElementById("lista-productos");
const sinResultados = document.getElementById("sin-resultados");
const mensaje = document.getElementById("mensaje");

const modal = document.getElementById("modal-eliminar");
const btnCancelar = document.getElementById("cancelar-eliminar");
const btnConfirmar = document.getElementById("confirmar-eliminar");

let filtroActual = "Todos";
let filaAEliminar = null;

// ----- Búsqueda y filtros -----
function aplicarFiltros() {
  const texto = buscador.value.trim().toLowerCase();
  const filas = lista.querySelectorAll("tr");
  let visibles = 0;

  filas.forEach(function (fila) {
    const nombre = fila.dataset.nombre.toLowerCase();
    const codigo = fila.dataset.codigo.toLowerCase();
    const coincideTexto = nombre.includes(texto) || codigo.includes(texto);
    const coincideCategoria = filtroActual === "Todos" || fila.dataset.categoria === filtroActual;

    if (coincideTexto && coincideCategoria) {
      fila.style.display = "";
      visibles++;
    } else {
      fila.style.display = "none";
    }
  });

  document.getElementById("mostrando").textContent = visibles;
  sinResultados.style.display = visibles === 0 ? "block" : "none";
}

function actualizarTotales() {
  const total = lista.querySelectorAll("tr").length;
  document.getElementById("total").textContent = total;
  document.getElementById("total-pie").textContent = total;
  aplicarFiltros();
}

buscador.addEventListener("input", aplicarFiltros);

botonesFiltro.forEach(function (boton) {
  boton.addEventListener("click", function () {
    botonesFiltro.forEach(function (b) {
      b.classList.remove("activo");
    });
    boton.classList.add("activo");
    filtroActual = boton.dataset.filtro;
    aplicarFiltros();
  });
});

// ----- Modal de eliminación -----
function abrirModal(fila) {
  filaAEliminar = fila;
  const d = fila.dataset;
  document.getElementById("modal-nombre").textContent = d.nombre;
  document.getElementById("modal-detalle").textContent = d.codigo + " · " + d.categoria + " · Activo";
  document.getElementById("modal-descripcion").textContent = d.descripcion;
  document.getElementById("modal-precio").textContent = "COP $" + d.precio + " · " + d.cantidad + " unidades disponibles";
  modal.classList.add("abierto");
  btnCancelar.focus();
}

function cerrarModal() {
  modal.classList.remove("abierto");
  filaAEliminar = null;
}

lista.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".btn-eliminar");
  if (boton) {
    abrirModal(boton.closest("tr"));
  }
});

btnCancelar.addEventListener("click", cerrarModal);

btnConfirmar.addEventListener("click", function () {
  if (filaAEliminar) {
    const nombre = filaAEliminar.dataset.nombre;
    filaAEliminar.remove();
    mensaje.textContent = "El producto " + nombre + " fue eliminado del catálogo.";
    mensaje.classList.add("visible");
    actualizarTotales();
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
