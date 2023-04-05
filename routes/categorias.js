const { Router } = require('express');
const { check } = require('express-validator');
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require('../controllers/categorias');

const {
  existeCategoriaPorId,
  existeCategoriaPorNombre,
} = require('../helpers/dbValidators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get(
  '/:id',
  [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria
);

// Crear una categoria - privado - Cualquier persona con token valido
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre').custom(existeCategoriaPorNombre),
    validarCampos,
  ],
  crearCategoria
);

// Actualizar una categoria - privado - Cualquier persona con token valido
//
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre').custom(existeCategoriaPorNombre),
    validarCampos,
  ],
  actualizarCategoria
);

// Borrar una categoria - privado - Administrador
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
