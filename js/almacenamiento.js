// Acceso a localStorage: es el único archivo que lee y escribe en el navegador

const CLAVE_PRODUCTOS = "melne-productos";

// Devuelve la lista guardada, o null si todavía no hay nada guardado
function leerProductosGuardados() {
  const texto = localStorage.getItem(CLAVE_PRODUCTOS);
  if (texto === null) return null;
  try {
    return JSON.parse(texto);
  } catch (error) {
    return null; // datos dañados: se vuelve a empezar con los datos iniciales
  }
}

function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}
