const dbValidators = require('./dbValidators');
const generarJWT = require('./generar-jwt.js');
const googleVerify = require('./google-verify.js');
const subirArchivo = require('./subir-archivo.js');

module.exports = {
  ...dbValidators,
  ...generarJWT,
  ...googleVerify,
  ...subirArchivo,
};
