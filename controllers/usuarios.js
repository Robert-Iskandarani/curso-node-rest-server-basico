const { response, request } = require('express');

const getUsuarios = (req = request, res = response) => {
  const { q, nombre = 'No name', apikey, page = '1', limit } = req.query;

  res.json({
    msg: 'get API - controlador',
    q,
    nombre,
    apikey,
    page,
    limit,
  });
};

const postUsuarios = (req, res) => {
  const { nombre, edad } = req.body;

  res.status(201).json({
    msg: 'post API - controlador',
    nombre,
    edad,
  });
};

const putUsuarios = (req, res) => {
  const { id } = req.params;

  res.json({
    msg: 'put API - controlador',
    id,
  });
};

const patchUsuarios = (req, res) => {
  res.json({
    msg: 'patch API - controlador',
  });
};

const deleteUsuarios = (req, res) => {
  res.json({
    msg: 'delete API - controlador',
  });
};

module.exports = {
  getUsuarios,
  postUsuarios,
  putUsuarios,
  patchUsuarios,
  deleteUsuarios,
};
