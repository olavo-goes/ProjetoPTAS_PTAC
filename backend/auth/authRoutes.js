const router = require("express").Router();

const UsuarioController = require("../Controllers/UserController");

router.post("/cadastro", UsuarioController.cadastrar);
router.post("/login", UsuarioController.login);
router.get("/perfil", UsuarioController.verificarAutenticacao, UsuarioController.buscarPerfil);
router.patch("/perfil", UsuarioController.verificarAutenticacao, UsuarioController.atualizarPerfil);


module.exports = router;