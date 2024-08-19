const { Router } = require("express");
const userController = require("../controllers/userController");
const router = Router();

router.get("/", userController.getAllUsers);
router.post("/", userController.addUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id", userController.getUserById);

module.exports = router;
