const { response, request } = require('express');

const { Producto, Categoria } = require('./../models');

// Paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre'),
  ]);

  res.json({
    total,
    productos,
  });
};

// Populate
const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

  res.status(200).json(producto);
};

const crearProducto = async (req = request, res = response) => {
  const data = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const producto = new Producto(data);

  await producto.save();
  res.status(201).json(producto);
};

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);
};

const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(producto);
};

module.exports = {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
};
