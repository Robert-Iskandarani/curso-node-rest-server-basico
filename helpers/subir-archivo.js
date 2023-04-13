const path = require('path');

const { v4: uuidv4 } = require('uuid');

const subirArchivo = (
  files,
  carpeta = '',
  extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extensión
    if (!extensionesValidas.includes(extension)) {
      reject(
        `La extensión ${extension} no es permitida, Ingrese un archivo con alguna de las siguientes extensiones: ${extensionesValidas}`
      );
    }

    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = { subirArchivo };
