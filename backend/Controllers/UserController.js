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
                    sobrenome: req.body.sobrenome,
                    email: req.body.email,
                    password: hashPassword,
                    rua: req.body.rua,
                    numero: req.body.numero,
                    bairro: req.body.bairro,
                    cidade: req.body.cidade,
                    uf: req.body.uf
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
                    sobrenome: true,
                    email: true,
                    rua: true,
                    numero: true,
                    bairro: true,
                    cidade: true,
                    uf: true,
                    isAdmin: true,
                    dataCadastro: true,
                    ultimaAtualizacao: true
                }
            });

            if (!usuario) {
                return res.status(404).json({
                    mensagem: "Usuario não encontrado!",
                    erro: true
                });
            }

            res.json({
                mensagem: "Perfil carregado com sucesso!",
                erro: false,
                usuario
            });
        } catch (err) {
            console.log("Erro ao encontrar perfil: ", err.message);
            res.status(500).json({
                mensagem: "Erro ao buscar perfil!",
                erro: true
            });
        }
    }

    static async atualizarPerfil(req, res) {
        try {
            const { usuario } = req.body;

            if (
                !usuario ||
                !usuario.nome ||
                !usuario.sobrenome ||
                !usuario.email ||
                !usuario.rua ||
                !usuario.numero ||
                !usuario.bairro ||
                !usuario.cidade ||
                !usuario.uf
            ) {
                return res.status(400).json({
                    mensagem: "Dados incompletos para atualização!",
                    erro: true
                });
            }

            const atualizado = await prisma.usuario.update({
                where: { id: req.idUsuario },
                data: {
                    nome: usuario.nome,
                    sobrenome: usuario.sobrenome,
                    email: usuario.email,
                    rua: usuario.rua,
                    numero: usuario.numero,
                    bairro: usuario.bairro,
                    cidade: usuario.cidade,
                    uf: usuario.uf,
                    ultimaAtualizacao: new Date()
                }
            });

            res.status(200).json({
                mensagem: "Perfil atualizado com sucesso!",
                erro: false,
                usuario: atualizado
            });
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error.message);
            res.status(500).json({
                mensagem: "Erro ao atualizar perfil!",
                erro: true
            });
        }
    }



    static async atualizarSenha(req, res) {
        try {
            const { senhaAtual, novaSenha } = req.body;

            if (!senhaAtual || !novaSenha) {
                return res.status(400).json({
                    mensagem: "Senha atual e nova senha são obrigatórias!",
                    erro: true
                });
            }

            const usuario = await prisma.usuario.findUnique({
                where: { id: req.idUsuario }
            });

            if (!usuario) {
                return res.status(404).json({
                    mensagem: "Usuário não encontrado!",
                    erro: true
                });
            }

            // Verifica se a senha atual confere
            const senhaValida = await bcrypt.compare(senhaAtual, usuario.password);
            if (!senhaValida) {
                return res.status(400).json({
                    mensagem: "Senha atual incorreta!",
                    erro: true
                });
            }

            // Cria hash da nova senha
            const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

            await prisma.usuario.update({
                where: { id: req.idUsuario },
                data: { password: novaSenhaHash, ultimaAtualizacao: new Date() }
            });

            return res.status(200).json({
                mensagem: "Senha atualizada com sucesso!",
                erro: false
            });
        } catch (error) {
            console.error("Erro ao atualizar senha:", error.message);
            res.status(500).json({
                mensagem: "Erro interno ao atualizar senha!",
                erro: true
            });
        }
    }


    static async buscarMesa(req, res) {
        try {
            const mesas = await prisma.mesa.findMany();

            res.status(200).json({
                mensagem: "Mesas carregadas com sucesso!",
                erro: false,
                mesas
            })
        } catch (err) {
            console.log("Erro ao buscar mesas!", err.message)
            res.status(500).json({
                mensagem: "Erro ao buscar mesas!",
                erro: true
            })
        }
    }

    static async cadastrarMesa(req, res) {
        try {
            const { numero, capacidade, descricao } = req.body;

            if (!numero || !capacidade) {
                return res.status(400).json({
                    mensagem: "Número e capacidade são obrigatórios.",
                    erro: true
                });
            }

            const mesa = await prisma.mesa.create({
                data: {
                    numero,
                    capacidade: parseInt(capacidade), // garante que seja número
                    descricao
                }
            });

            res.status(201).json({
                mensagem: "Mesa cadastrada com sucesso!",
                erro: false,
                mesa
            });
        } catch (error) {
            console.error("Erro ao cadastrar mesa:", error.message);
            res.status(500).json({
                mensagem: "Erro interno ao cadastrar mesa!",
                erro: true
            });
        }
    }

    static async reservarMesa(req, res) {
        try {
            const { mesaId, data, horario, n_pessoas } = req.body;

            // validação mais robusta
            if (!mesaId || !data || !horario || n_pessoas == null || n_pessoas <= 0) {
                return res.status(400).json({
                    mensagem: "Dados incompletos ou inválidos para reserva!",
                    erro: true
                });
            }

            // cria DateTime completo (string ISO)
            const dataHoraStr = `${data}T${horario}:00`;
            const dataHora = new Date(dataHoraStr);

            const reserva = await prisma.reserva.create({
                data: {
                    mesaId: parseInt(mesaId),
                    usuarioId: req.idUsuario, // vem do middleware de autenticação
                    data: dataHora,
                    n_pessoas: parseInt(n_pessoas)
                }
            });

            res.status(201).json({
                mensagem: "Reserva realizada com sucesso!",
                erro: false,
                reserva
            });
        } catch (error) {
            console.error("Erro ao reservar mesa:", error.message);
            res.status(500).json({
                mensagem: "Erro ao realizar reserva!",
                erro: true
            });
        }
    }


    static async verMinhasReservas(req, res) {
        try {
            const reservas = await prisma.reserva.findMany({
                where: { usuarioId: req.idUsuario },
                include: { mesa: true }
            });

            res.status(200).json({
                mensagem: "Reservas carregadas com sucesso!",
                erro: false,
                reservas
            });
        } catch (error) {
            console.error("Erro ao buscar reservas:", error.message);
            res.status(500).json({
                mensagem: "Erro ao buscar reservas!",
                erro: true
            });
        }
    }

    static async atualizarMesa(req, res) {
        try {
            const { numero, capacidade, descricao } = req.body;
            const { id } = req.params;

            const mesaAtualizada = await prisma.mesa.update({
                where: { id: parseInt(id) },
                data: { codigo: numero, n_lugares: capacidade, descricao }
            });

            res.status(200).json({
                mensagem: "Mesa atualizada com sucesso!",
                erro: false,
                mesa: mesaAtualizada
            });
        } catch (error) {
            console.error("Erro ao atualizar mesa:", error.message);
            res.status(500).json({ mensagem: "Erro ao atualizar mesa!", erro: true });
        }
    }

    static async excluirMesa(req, res) {
        try {
            const { id } = req.params;

            await prisma.mesa.delete({
                where: { id: parseInt(id) }
            });

            res.status(200).json({
                mensagem: "Mesa excluída com sucesso!",
                erro: false
            });
        } catch (error) {
            console.error("Erro ao excluir mesa:", error.message);
            res.status(500).json({ mensagem: "Erro ao excluir mesa!", erro: true });
        }
    }

    // middleware
    static async verificarAutenticacao(req, res, next) {
        const auth = req.headers["authorization"];
        if (!auth) {
            return res.status(401).json({
                mensagem: "Token não encontrado.",
                erro: true
            });
        }

        const token = auth.split(" ")[1];
        try {
            const payload = jwt.verify(token, process.env.SENHA_TOKEN);
            req.idUsuario = payload.id;
            req.isAdmin = payload.isAdmin; // se você incluir isAdmin no token
            next();
        } catch (err) {
            return res.status(403).json({
                mensagem: "Seu login expirou ou é inválido.",
                erro: true
            });
        }
    }

    static async verificaIsAdmin(req, res, next) {
        if (!req.idUsuario) {
            return res.status(401).json({
                mensagem: "Você não está autenticado.",
                erro: true
            });
        }

        // Se o token já trouxe isAdmin, usa direto
        if (req.isAdmin) {
            return next();
        }

        try {
            const usuario = await prisma.usuario.findUnique({
                where: { id: req.idUsuario },
                select: { isAdmin: true }
            });

            if (!usuario || !usuario.isAdmin) {
                return res.status(403).json({
                    mensagem: "Acesso negado! Você não é um administrador.",
                    erro: true
                });
            }

            next();
        } catch (err) {
            return res.status(500).json({
                mensagem: "Erro interno na verificação de administrador.",
                erro: true
            });
        }
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
