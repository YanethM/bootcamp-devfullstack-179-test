const mongoose = require("mongoose");
require("dotenv").config();

/* Conexión a la base de datos */
const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Base de datos conectada ${db.connection.name}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
