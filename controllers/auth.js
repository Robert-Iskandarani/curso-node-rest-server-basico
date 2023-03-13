const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const loginController = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si correo existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Contraseña no son correctos - correo',
      });
    }

    // Verificar si usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Contraseña no son correctos - estado: false',
      });
    }

    // Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Contraseña no son correctos - password',
      });
    }
    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

const googleSingIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, correo, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // Crear usuario
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
        rol: 'USER_ROLE',
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    // estado de usuario en DB = false
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({ usuario, token });
  } catch (error) {
    res.status(400).json({ ok: false, msg: 'El token no se pudo verificar' });
  }
};

module.exports = {
  loginController,
  googleSingIn,
};
