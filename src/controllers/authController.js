const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Clave secreta para firmar los tokens JWT (debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// Método para registrar usuarios
exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, current_password, role } = req.body;
    console.log(req.body);
    // Verificar si el usuario ya existe
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Cifrar la contraseña antes de guardarla en la base de datos
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(current_password, salt);

    // Crear nuevo usuario
    const newUser = new userModel({
      firstname,
      lastname,
      email,
      current_password: hashedPassword, // Guardar la contraseña cifrada
      role,
      user_status: 'active', // Estado por defecto
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Método para login de usuarios
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // Verificar si el usuario existe
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    // Verificar si la contraseña es correcta
    const isPasswordValid = await bcrypt.compare(password, user.current_password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generar token JWT
    const token = jwt.sign({ email: user.email, role: user.role, _id: user.id }, JWT_SECRET, {
      expiresIn: '1h', // Expira en 1 hora
    });

    res.status(200).json({
      message: 'Login successful',
      token, // Devolver el token para el frontend
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

