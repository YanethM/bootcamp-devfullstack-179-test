const mongoose = require('mongoose');

// Cerrar la conexión a la base de datos después de todas las pruebas
afterAll(async () => {
  await mongoose.connection.close();
});
