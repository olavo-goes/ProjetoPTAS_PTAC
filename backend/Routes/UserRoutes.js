const router = require("express").Router();

const UsuarioController = require("../Controllers/UserControllers");

router.post("/cadastro", UsuarioController.cadastrar);
router.post("/login", UsuarioController.login);


module.exports = router;