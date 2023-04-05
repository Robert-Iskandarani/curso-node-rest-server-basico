const { Router } = require('express');
const { check } = require('express-validator');

const { loginController, googleSingIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post(
  '/login',
  [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos,
  ],
  loginController
);

router.post(
  '/google',
  [check('id_token', 'El id_token es necesario').notEmpty(), validarCampos],
  googleSingIn
);

module.exports = router;
