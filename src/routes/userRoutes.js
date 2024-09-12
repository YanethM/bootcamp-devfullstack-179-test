const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware"); // Importar el middleware


router.post("/new",verifyToken, userController.createUser);
router.get("/",verifyToken, userController.getUsers);
router.get("/all/:id",verifyToken, userController.getUserById);
router.patch("/all/:id",verifyToken, userController.editUser);
router.delete("/all/:id",verifyToken, userController.deleteUser);


module.exports = router;
