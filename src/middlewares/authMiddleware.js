const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1]; // Extrae el token, ignorando el prefijo Bearer
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.userId = decoded.id;
      next();
    });
  };

module.exports = verifyToken;