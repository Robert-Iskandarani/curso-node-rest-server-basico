const { Router } = require('express');
const { check } = require('express-validator');
const {
  obtenerProductos,
  crearProducto,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require('../controllers/productos');
const {
  existeCategoriaPorId,
  existeProductoPorNombre,
  existeProductoPorId,
} = require('../helpers/dbValidators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

// Obtener todos los productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por id - publico
router.get(
  '/:id',
  [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

// Crear un producto - privado - Cualquier persona con token valido
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('nombre').custom(existeProductoPorNombre),
    check('precio', 'El precio debe ser mayor o igual a 0').isInt({ min: 0 }),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

// Actualizar un producto - privado - Cualquier persona con token valido
//
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('precio', 'El precio debe ser mayor o igual a 0').isInt({ min: 0 }),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarProducto
);

// Borrar un producto - privado - Administrador
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
