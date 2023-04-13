const { request, response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');

const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req = request, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, 'images');
    res.json({
      nombre,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const actualizarArchivo = async (req = request, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id: ${id}` });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id: ${id}` });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, coleccion);
  modelo.img = nombre;

  modelo.save();

  res.json(modelo);
};

const actualizarArchivoCloudinary = async (req = request, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id: ${id}` });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id: ${id}` });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(`node-Cafe/${coleccion}/${public_id}`);
  }

  try {
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
      folder: `node-Cafe/${coleccion}`,
    });
    modelo.img = secure_url;
    await modelo.save();
    res.json(modelo);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const mostrarImagen = async (req = request, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id: ${id}` });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id: ${id}` });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  }
};

module.exports = {
  actualizarArchivo,
  cargarArchivo,
  mostrarImagen,
  actualizarArchivoCloudinary,
};
