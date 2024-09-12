const userModel = require("../models/userModel");

exports.createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, current_password, role, user_status } =
      req.body;
      console.log(req.body);
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new userModel({
      firstname,
      lastname,
      email,
      current_password,
      role,
      user_status,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

/* Función que devuelve en un array todos los usuarios de la BD */
exports.getUsers = async (req, res) => {
    console.info("Consultando usuarios");
  try {
    const users = await userModel.find();
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al consultar los usuarios:", error); // Registra el error en el servidor
    res
      .status(500)
      .json({ message: "Error al consultar los usuarios", error: error.message }); // Enviar mensaje de error al cliente
  }
};

/* Función que devuelve un usuario por su ID */
exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar los usuarios", error: error.json });
  }
};

/* Función que permite editar un usuario por su ID */
exports.editUser = async (req, res) => {
  try {
    const { firstname, lastname, email, currentPassword, role, active } =
      req.body;
    /* Buscar y actualizar el usuario */
    const updateduser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        firstname,
        lastname,
        email,
        currentPassword,
        role,
        active,
      },
      { new: true, runValidators: true }
    );
    console.log(updateduser);

    if (!updateduser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(updateduser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar los usuarios", error: error.json });
  }
};

/* Función que permite eliminar un usuario por su ID */
exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar los usuarios", error: error.json });
  }
};

/* Función que permite inactivar un usuario por su ID */
exports.inactivateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { active: "inactive" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario inactivado" });
  } catch (error) {}
};

/* Función que permite consultar los usuarios con email de Gmail */
exports.getUsersByGmail = async (req, res) => {
    try {
        console.log("Consultando usuarios con email de Gmail");
        const gmailUsers = await userModel.find({ email: /@gmail\.com$/ });
        console.log(gmailUsers);
        if(gmailUsers.length === 0){
            return res.status(404).json({ message: "No hay usuarios con email de Gmail" });
        }
        res.status(200).json(gmailUsers);
    } catch (error) {
        res
        .status(500)
        .json({ message: "Error al consultar los usuarios", error: error.json });
    }
}

/* Función para inactivar todos los usuarios excepto el usuario con rol admin */
exports.inactivateNonAdminUsers = async (req, res) => {
    try{
        /* const inactiveUsers = await userModel.updateMany({ role: 'user' }, { active: 'inactive' }); */
        const inactiveUsers = await userModel.updateMany({ role: { $ne: 'admin' } }, { active: 'inactive' });
        if(inactiveUsers.modifiedCount === 0){
            return res.status(404).json({ message: "No hay usuarios para inactivar" });
        }
        res.status(200).json({ message: "Todos los usuarios fueron inactivados" });
    }catch(error){
        res
        .status(500)
        .json({ message: "Error al consultar los usuarios", error: error.json });
    }
}
