const { Categoria, Role, Usuario, Producto } = require('../models');

const esRolValido = async (rol = '') => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol)
    throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
};

const emailExiste = async (correo = '') => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail)
    throw new Error(
      `El Email ${correo} ya esta registrado en la base de datos`
    );
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) throw new Error(`El id ${id} no existe`);
};

const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) throw new Error(`El id ${id} no existe`);
};

const existeCategoriaPorNombre = async (nombre) => {
  nombre = nombre.toUpperCase();
  const existeCategoria = await Categoria.findOne({ nombre });
  if (existeCategoria) throw new Error(`La categoria ${nombre}, ya existe`);
};

const existeProductoPorId = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) throw new Error(`El id ${id} no existe`);
};

const existeProductoPorNombre = async (nombre) => {
  nombre = nombre.toUpperCase();
  const existeProducto = await Producto.findOne({ nombre });
  if (existeProducto) throw new Error(`El producto ${nombre}, ya existe`);
};

const coleccionesPermitidas = (coleccion = '', coleccionesPermitidas = []) => {
  const estaIncluida = coleccionesPermitidas.includes(coleccion);
  if (!estaIncluida)
    throw new Error(
      `La colección ${coleccion} no es permitida, las colecciones permitidas son: ${coleccionesPermitidas}`
    );

  return true;
};

module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeCategoriaPorNombre,
  existeProductoPorId,
  existeProductoPorNombre,
  coleccionesPermitidas,
};
