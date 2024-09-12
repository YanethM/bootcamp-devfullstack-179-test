const request = require("supertest");
const jwt = require('jsonwebtoken');
const app = require("../../index");
const userModel = require("../../src/models/userModel");
jest.mock("../../src/models/userModel");


// Generar un token JWT válido
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';
const token = jwt.sign({ id: 'userId' }, JWT_SECRET, { expiresIn: '1h' });


describe('GET /api/v1/users', () => {
  let consoleInfoSpy, consoleErrorSpy;

  beforeAll(() => {
    // Intercepta y silencia las llamadas a console.info y console.error
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    // Restaura las funciones originales de consola
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('debe devolver todos los usuarios con un código de estado 200', async () => {
    const mockUsers = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
    userModel.find.mockResolvedValue(mockUsers);

    // Realiza la solicitud con el token JWT
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`); // Incluye el token en el header

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  it('debe manejar errores y devolver un código de estado 500', async () => {
    const errorMessage = 'Error al consultar los usuarios';
    userModel.find.mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`); // Incluye el token en el header

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Error al consultar los usuarios');
    expect(response.body.error).toBe(errorMessage);
  });
});