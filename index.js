const express = require('express');
require('dotenv').config();

/* Importar rutas y conexión a la DB*/
const connectDB = require('./src/config/database');
const routes = require('./src/routes/routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', routes);


/* Config del servidor */
if (process.env.NODE_ENV !== 'test') {
  app.set("port", process.env.PORT_CONNECTION || 3005);
  app.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
  });
}
/* Conexión a la base de datos */
connectDB();
module.exports = app