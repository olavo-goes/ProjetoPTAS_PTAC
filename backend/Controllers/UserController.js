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

    static async buscarPerfil(req, res) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { id: req.idUsuario },
                select: {
                    nome: true,
                    email: true,
                    isAdmin: true,
                    dataCadastro: true,
                    ultimaAtualizacao: true
                }
            });


            if(!usuario){
                return res.status(404).json({
                    mensagem: "Usuario não encontrado!",
                    erro: true
                })
            }
            res.json({
                mensagem: "Perfil carregado com sucesso!",
                erro: false,
                usuario
            })
        }
        catch (err) {
            console.log("Erro ao encontrar perfil: ", err.message)
            res.status(500).json({
                menssagem: "Erro ao buscar perfil!",
                erro: true
            })
        }
    }

    static async atualizarPerfil (req,res){
        try{
            const{usuario} = req.body;

            if(!usuario || !usuario.nome || !usuario.email){
                return res.status(400).json({
                    mensagem: "Dados incompletos para atualização!",
                    erro: true
                })
            }
            const atualizado = await prisma.usuario.update({
                where: {id: req.idUsuario},
                data: {
                    nome: usuario.nome,
                    email: usuario.email,
                    ultimaAtualizacao: new Date()
                }
            });
            res.status(200).json({
                mensagem: "Perfil atualizado com sucesso!",
                erro: false
            })
        } catch(error){
            console.error("Erro ao atualizar perfil:", error.message);
            res.status(500).json({
                mensagem: "Erro ao atualizar perfil!",
                erro: true
            })
        }
    }

    static async buscarMesa (req,res){
        try{
            const mesas = await prisma.mesa.findMany();

            res.status(200).json({
                mensagem: "Mesas carregadas com sucesso!",
                erro: false,
                mesas
            })
        }catch(err){
            console.log("Erro ao buscar mesas!", err.message)
            res.status(500).json({
                mensagem: "Erro ao buscar mesas!",
                erro: true
            })
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

    static async listarUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, isAdmin: true }
    });

    res.status(200).json({
      mensagem: "Usuários carregados com sucesso!",
      erro: false,
      usuarios
    });
  } catch (err) {
    console.error("Erro ao listar usuários:", err.message);
    res.status(500).json({
      mensagem: "Erro ao carregar usuários!",
      erro: true
    });
  }
}

}

module.exports = UserController;
