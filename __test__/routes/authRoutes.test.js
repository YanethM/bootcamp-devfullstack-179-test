const request = require('supertest');
const app = require('../../index');  // Asegúrate de que apunte correctamente a tu servidor principal
const userModel = require("../../src/models/userModel");// Mockear el modelo de usuario
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/userModel'); // Mock del modelo de usuario
jest.mock('bcrypt'); // Mock de bcrypt
jest.mock('jsonwebtoken'); // Mock de jsonwebtoken

describe('POST /api/v1/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
  });

  // Prueba de registro exitoso
  it('should register a new user successfully', async () => {
    userModel.findOne.mockResolvedValue(null); // Simula que no existe el usuario
    bcrypt.hash.mockResolvedValue('hashed_password'); // Simula el hashing de la contraseña
    userModel.prototype.save = jest.fn().mockResolvedValue({ firstname: 'John', email: 'john@example.com' });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(201); // Registro exitoso
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user.email).toBe('john@example.com');
  });

  // Prueba de usuario existente
  it('should return 400 if user already exists', async () => {
    userModel.findOne.mockResolvedValue({ email: 'john@example.com' }); // Simula que el usuario ya existe

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  // Prueba de error en el servidor
  it('should return 500 if there is a server error', async () => {
    userModel.findOne.mockRejectedValue(new Error('Server error')); // Simula un error del servidor

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Server error');
  });
});

describe('POST /api/v1/auth/login',()=>{
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
  });
  /* Primera prueba: Login exitoso */
  it("should log in successfully and return a token", async () => {
    /* Usuario simulado que existe en la base de datos */
    const mockUser = {
      _id: "123",
      firstname: "John",
      lastname: "Doe",
      email: "jhon@test.com",
      current_password: "hashed_password",
      role: "user",
    };

    userModel.findOne.mockResolvedValue(mockUser); // Simula que el usuario Jhon Doe existe
    bcrypt.compare.mockResolvedValue(true); // Simula que la contraseña ingresada en el caso de prueba es correcta hashed_password
    jwt.sign.mockReturnValue("token_creado_para_prueba"); // Simula la generación de un token

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "jhon@test.com",
      current_password: "password123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toBe("token_creado_para_prueba");
    expect(response.body.user.email).toBe("jhon@test.com");
  });

  /* Segunda prueba: Login no exitoso, no encuentra el email del user en la BD */
  it("should return 404 if user is not found", async () => {
    /* Suponemos que no encontro el usuario buscando por el email, por esto la condición retorna null 
        en este ejemplo, no encontro a john@example.com en la base de datos*/
    userModel.findOne.mockResolvedValue(null);
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "john@example.com", password: "password123" });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  /* Tercera prueba: Login no exitoso, la contraseña es incorrecta */
  it("shoul return 401 if the password is incorrect", async () => {
    /* Vamos a suponer que existe el siguiente usuario en la BD */
    const mockUser = {
      _id: "123",
      email: "john@example.com",
      current_password: "hashed_password",
    };

    userModel.findOne.mockResolvedValue(mockUser); // Simula que el usuario Jhon Doe existe
    bcrypt.compare.mockResolvedValue(false); // Simula que la contraseña ingresada en el caso de prueba es incorrecta y no coincide con el hashed_password

    /* Suponemos que la contraseña correcta es password123 pero el usuario ingreso Password1234 */
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "jhon@test.com",
      current_password: "Password1234",
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  /* Cuarta prueba: Error interno del servidor */
  it("should return 500 if there is a server error", async () => {
    userModel.findOne.mockRejectedValue(new Error("Server error")); // Simula un error del servidor

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "john@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Server error");
  });
})