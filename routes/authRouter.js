const { Router } = require("express");
const authController = require("../controllers/authController");
const authRouter = Router();

//Register
authRouter.post("/register", authController.singup);
authRouter.post("/login", authController.login);

module.exports = authRouter;
