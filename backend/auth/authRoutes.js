const router = require("express").Router();

const UsuarioController = require("../Controllers/UserController");

router.post("/cadastro", UsuarioController.cadastrar);
router.post("/login", UsuarioController.login);
router.get("/perfil", UsuarioController.verificarAutenticacao, UsuarioController.buscarPerfil);
router.patch("/perfil", UsuarioController.verificarAutenticacao, UsuarioController.atualizarPerfil);
router.get("/usuarios", UserController.verificarAutenticacao, UserController.verificaIsAdmin, UserController.listarUsuarios);


router.post("/mesa/novo", UsuarioController.verificarAutenticacao, UsuarioController.verificaIsAdmin, UsuarioController.cadastrarMesa)
router.get("/mesa", UsuarioController.buscarMesa)

router.post("/reservas/novo", UsuarioController.verificarAutenticacao, UsuarioController.reservarMesa)
router.get("/reservas", UsuarioController.verificarAutenticacao, UsuarioController.verMinhasReservas)

router.post("/mesa/novo", UsuarioController.verificarAutenticacao, UsuarioController.verificaIsAdmin, UsuarioController.cadastrarMesa)
router.get("/mesa", UsuarioController.buscarMesa)

router.post("/reservas/novo", UsuarioController.verificarAutenticacao, UsuarioController.reservarMesa)
router.get("/reservas", UsuarioController.verificarAutenticacao, UsuarioController.verMinhasReservas)

router.post("/mesa/novo", UsuarioController.verificarAutenticacao, UsuarioController.verificaIsAdmin, UsuarioController.cadastrarMesa)
router.get("/mesa", UsuarioController.buscarMesa)

router.post("/reservas/novo", UsuarioController.verificarAutenticacao, UsuarioController.reservarMesa)
router.get("/reservas", UsuarioController.verificarAutenticacao, UsuarioController.verMinhasReservas)


module.exports = router;