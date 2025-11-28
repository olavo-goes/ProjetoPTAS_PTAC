const router = require("express").Router();
const UsuarioController = require("../Controllers/UserController");


router.post("/cadastro", UsuarioController.cadastrar);
router.post("/login", UsuarioController.login);

router.get("/perfil",
    UsuarioController.verificarAutenticacao,
    UsuarioController.buscarPerfil
);

router.patch("/perfil",
    UsuarioController.verificarAutenticacao,
    UsuarioController.atualizarPerfil
);

router.patch("/perfil/senha",
    UsuarioController.verificarAutenticacao,
    UsuarioController.atualizarSenha
);


router.get("/usuarios",
    UsuarioController.verificarAutenticacao,
    UsuarioController.listarUsuarios          
);


router.get("/mesas", UsuarioController.buscarMesa);

router.post("/mesas",
    UsuarioController.verificarAutenticacao,
    UsuarioController.cadastrarMesa
);

router.put("/mesas/:id",
    UsuarioController.verificarAutenticacao,
    UsuarioController.atualizarMesa
);

router.delete("/mesas/:id",
    UsuarioController.verificarAutenticacao,
    UsuarioController.excluirMesa
);


router.post("/reservas/novo",
    UsuarioController.verificarAutenticacao,
    UsuarioController.reservarMesa
);

router.get("/reservas",
    UsuarioController.verificarAutenticacao,
    UsuarioController.verMinhasReservas
);

module.exports = router;
