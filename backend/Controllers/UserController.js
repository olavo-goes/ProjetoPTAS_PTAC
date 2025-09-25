const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


class UserController {
    static async cadastrar(req, res) {
        try {
            const salt = bcrypt.genSaltSync(8);
            const hashPassword = bcrypt.hashSync(req.body.password, salt);

            const usuario = await prisma.usuario.create({
                data: {
                    nome: req.body.nome,
                    email: req.body.email,
                    password: hashPassword,
                },
            });


            const token = jwt.sign({ id: usuario.id }, process.env.SENHA_TOKEN, {
                expiresIn: "1h"
            })

            res.status(201).json({
                mensagem: "Usuário cadastrado com sucesso!",
                erro: false,
                token: token
            })
        } catch (error) {
            console.error("Erro no cadastro:", error.message);
            res.status(500).json({
                erro: true,
                mensagem: "erro ao realizar cadastro"

            });
        }
    }

    static async login(req, res) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { email: req.body.email },
            });

            if (!usuario) {
                return res.status(404).json({ 
                    mensagem: "Usuário não existe!",
                    erro: true 
                });
            }

            const correto = bcrypt.compareSync(req.body.password, usuario.password);
            if (!correto) {
                return res.status(401).json({ 
                    mensagem: "Senha incorreta!",
                    erro: true
                 });
            }

            const token = jwt.sign({ id: usuario.id }, process.env.SENHA_TOKEN, {
                expiresIn: "10h",
            });

            res.json({
                mensagem: "Autenticado com sucesso!",
                erro: false,
                token: token,
            });
        } catch (error) {
            console.error("Erro no login:", error.message);
            res.status(500).json({
                mensagem: "Seu login expirou",
                erro: true
            });
        }
    }


    // middleware
    static async verificarAutenticacao(req, res, next) {
        const auth = req.headers["authorization"];

        let token
        if (auth) {
            token = auth.split(" ")[1];
            jwt.verify(token, process.env.SENHA_TOKEN, (err, payload) => {
                if (err) {
                    return res.status(403).json({
                        mensagem: "Seu login expirou",
                        erro: true
                    })
                }
                req.idUsuario = payload.id
                next()
            })

        } else {
            return res.status(401).json({
                mensagem: "Token não encontrado.",
                erro: true
            })
        }
    }

    static async verificaIsAdmin(req, res, next) {
        if (!req.idUsuario) {
            return res.status(401).json({
                mensagem: "Voce não está autenticado.",
                erro: true 
            })
        }
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: req.idUsuario,
            }
        })
        if (!usuario.isAdmin) {
            return res.status(403).json({
                mensagem: "Acesso negado! Você não é um administrador.",
                erro: true
            })
        }
        next()
    }
}

module.exports = UserController;
