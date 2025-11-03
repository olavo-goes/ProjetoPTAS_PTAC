const router = require("express").Router();

const UsuarioController = require("../Controllers/UserController");

// Rotas de autenticação e perfil
router.post("/cadastro", UsuarioController.cadastrar);
router.post("/login", UsuarioController.login);
router.get("/perfil", UsuarioController.verificarAutenticacao, UsuarioController.buscarPerfil);
router.patch("/perfil", UsuarioController.verificarAutenticacao, UsuarioController.atualizarPerfil);

// Rotas administrativas
router.get("/usuarios", UsuarioController.verificarAutenticacao, UsuarioController.verificaIsAdmin, UsuarioController.listarUsuarios);

// Rotas de mesa
router.post("/mesa/novo", UsuarioController.verificarAutenticacao, UsuarioController.verificaIsAdmin, UsuarioController.cadastrarMesa);
router.get("/mesa", UsuarioController.buscarMesa);

// Rotas de reservas
router.post("/reservas/novo", UsuarioController.verificarAutenticacao, UsuarioController.reservarMesa);
router.get("/reservas", UsuarioController.verificarAutenticacao, UsuarioController.verMinhasReservas);

module.exports = router;