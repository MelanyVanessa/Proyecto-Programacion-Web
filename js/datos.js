// Manejo de los datos de productos (CRUD y búsqueda). No toca la interfaz.

// Catálogo con el que arranca la aplicación la primera vez
const PRODUCTOS_INICIALES = [
  { codigo: "MEL-H001", nombre: "212 AQUA", categoria: "Hombre", descripcion: "Amaderado, calido especiado, citrico", precio: 80000, cantidad: 24, imagen: "212-aqua.jpg", estado: "Activo" },
  { codigo: "MEL-H002", nombre: "212 BLACK", categoria: "Hombre", descripcion: "Aromatico, avainillado, especiado suave", precio: 80000, cantidad: 18, imagen: "212-black.jpg", estado: "Activo" },
  { codigo: "MEL-H003", nombre: "212 RED", categoria: "Hombre", descripcion: "Dulce, aromático, fresco especiado", precio: 80000, cantidad: 12, imagen: "212-red.jpg", estado: "Activo" },
  { codigo: "MEL-M001", nombre: "GOOD GIRL BLUSH", categoria: "Mujer", descripcion: "Floral, avainillado, cítrico", precio: 80000, cantidad: 16, imagen: "good-girl-blush.jpg", estado: "Activo" },
  { codigo: "MEL-M002", nombre: "LA BOMBA", categoria: "Mujer", descripcion: "Floral, afrutado, ambarado", precio: 90000, cantidad: 8, imagen: "la-bomba.jpg", estado: "Activo" },
  { codigo: "MEL-H004", nombre: "LE MALE ELIXIR", categoria: "Hombre", descripcion: "Cálida, dulce, sensual", precio: 95000, cantidad: 10, imagen: "le-male-elixir.jpg", estado: "Activo" }
];

// ----- Leer -----
function obtenerProductos() {
  const guardados = leerProductosGuardados();
  if (guardados === null) {
    guardarProductos(PRODUCTOS_INICIALES);
    return PRODUCTOS_INICIALES.slice();
  }
  return guardados;
}

function buscarProducto(codigo) {
  const encontrado = obtenerProductos().find(function (producto) {
    return producto.codigo === codigo;
  });
  return encontrado || null;
}

function existeCodigo(codigo) {
  return buscarProducto(codigo) !== null;
}

// ----- Crear, actualizar y eliminar -----
function agregarProducto(producto) {
  const productos = obtenerProductos();
  productos.push(producto);
  guardarProductos(productos);
}

// Se usa el código original porque el usuario puede haber cambiado el código
function actualizarProducto(codigoOriginal, productoActualizado) {
  const productos = obtenerProductos().map(function (producto) {
    return producto.codigo === codigoOriginal ? productoActualizado : producto;
  });
  guardarProductos(productos);
}

function eliminarProducto(codigo) {
  const productos = obtenerProductos().filter(function (producto) {
    return producto.codigo !== codigo;
  });
  guardarProductos(productos);
}

// ----- Búsqueda -----
function filtrarProductos(productos, texto, categoria) {
  const busqueda = texto.trim().toLowerCase();
  return productos.filter(function (producto) {
    const coincideTexto = producto.nombre.toLowerCase().includes(busqueda) ||
      producto.codigo.toLowerCase().includes(busqueda);
    const coincideCategoria = categoria === "Todos" || producto.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });
}
