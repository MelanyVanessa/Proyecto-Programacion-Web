// Funciones de apoyo compartidas por el listado y el formulario

// Crea un elemento HTML con su clase y su texto (ambos opcionales)
function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

// Muestra un mensaje de confirmación y lleva la vista hasta él
function mostrarMensaje(elemento, texto) {
  elemento.textContent = texto;
  elemento.classList.add("visible");
  elemento.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ocultarMensaje(elemento) {
  elemento.classList.remove("visible");
}

// 80000 -> "$80.000"
function formatearPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}
