const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


class UserController {
    static async cadastrar(req, res) {
        try {
            const salt = bcrypt.genSaltSync(8);
            const hashSenha = bcrypt.hashSync(req.body.senha, salt);

            const usuario = await prisma.usuario.create({
                data: {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: hashSenha,
                },
            });

            res.json({ usuarioId: usuario.id });
        } catch (error) {
            console.error("Erro no cadastro:", error.message);
            res.status(500).json({ erro: "Erro ao cadastrar usuário" });
        }
    }

    static async login(req, res) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { email: req.body.email },
            });

            if (!usuario) {
                return res.status(404).json({ msg: "Usuário não existe!" });
            }

            const correto = bcrypt.compareSync(req.body.senha, usuario.senha);
            if (!correto) {
                return res.status(401).json({ msg: "Senha incorreta!" });
            }

            const token = jwt.sign({ id: usuario.id }, process.env.SENHA_TOKEN, {
                expiresIn: "1h",
            });

            res.json({
                msg: "Autenticado com sucesso!",
                token: token,
            });
        } catch (error) {
            console.error("Erro no login:", error.message);
            res.status(500).json({ erro: "Erro ao fazer login" });
        }
    }

    static async verificarAutenticação(req, res, next) {
        const auth = req.headers["authorization"];

        if (!auth) {
            return res.status(401).json({ msg: "Token não fornecido." });
        }

        const token = auth.split(" ")[1];

        jwt.verify(token, process.env.SENHA_TOKEN, (err, payload) => {
            if (err) {
                return res.status(403).json({ msg: "Seu login expirou." });
            }
            req.idUsuario = payload.id;
            next();
        });
    }

    // middleware
    static async verificarAutenticacao(req, res, next) {
        const auth = req.headers["authorization"];

        let token
        if (auth) {
            token = auth.split(" ")[1];
            jwt.verify(token, process.env.SENHA_TOKEN, (err, payload) => {
                if (err) {
                    return res.json({
                        msg: "seu login expirou",
                    })
                }
                req.idUsuario = payload.id
                next()
            })

        } else {
            return res.json({
                msg: "Token não encontrado."
            })
        }
    }

    static async verificaIsAdmin(req, res, next) {
        if (!req.idUsuario) {
            return res.json({
                msg: "Voce não está autenticado."
            })
        }
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: req.idUsuario,
            }
        })
        if (!usuario.isAdmin) {
            return res.json({
                msg: "Acesso negado! Você não é um administrador :("
            })
        }
        next()
    }
}

module.exports = UserController;
