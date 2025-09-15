import React, { useState } from "react";
import api from "../services/api";


function Cadastro() {
    const [cadastro, setCadastro] = useState({
        nome: "",
        email: "",
        senha: ""
    });

    const [mensagem, setMensagem] = useState("");

    const handleChange = (e) => {
        setCadastro({ ...cadastro, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/usuario/cadastro", cadastro);
            setMensagem(`usuario cadastrado com o id ${res.data.usuarioId}`)
        }
        catch (err) {
            setMensagem("erro ao cadastrar usuário")
        }
    }



    return (
        <div>
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit}>
                <input name="nome" placeholder="Nome" onChange={handleChange} />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} />
                <input name="senha" type="password" placeholder="Senha" onChange={handleChange} />
                <button type="submit">cadastrar</button>
            </form>
            <p>{mensagem}</p>
        </div>
    )
}

export default Cadastro;