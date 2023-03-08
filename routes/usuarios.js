const { Router } = require('express');
const { check } = require('express-validator');

const {
  getUsuarios,
  postUsuarios,
  putUsuarios,
  patchUsuarios,
  deleteUsuarios,
} = require('../controllers/usuarios');

const { validarCampos } = require('../middlewares/validar-campos');

const {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
} = require('../helpers/dbValidators');

const router = Router();

router.get('/', getUsuarios);

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('password', 'El password debe de ser de más de 6 letras').isLength({
      min: 6,
    }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRolValido),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos,
  ],
  postUsuarios
);

router.put(
  '/:id',
  [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos,
  ],
  putUsuarios
);

router.patch('/', patchUsuarios);

router.delete(
  '/:id',
  [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
  ],
  deleteUsuarios
);

module.exports = router;
