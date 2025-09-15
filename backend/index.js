const express = require("express");
const UserController = require("./Controllers/UserController");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

app.get("/areaLogada",UserController.verificarAutenticacao, (req, res) => {
    res.json({
        msg: "Você está logado com o id" + req.idUsuario + " e pode acessar esse recurso" 
    })});

app.get("/areaAdmin",UserController.verificarAutenticacao,UserController.verificaIsAdmin, (req, res) => {
    res.json({
        msg: "Você está é um administrador" 
    })});


try {
    const UserRoutes = require("./Routes/UserRoutes");
    app.use("/usuario", UserRoutes);
} catch (error) {
    console.error("Erro ao carregar rotas de usuario:", error.message);
    process.exit(1); 
}


app.get("/", (req, res) => {
    res.send("Pagina Home");
});


const PORT = 8000;
app.listen(PORT, (err) => {
    if (err) {
        console.error("Erro ao iniciar a aplicação:", err.message);
    } else {
        console.log(`Aplicação rodando na porta local ${PORT}`);
    }
});