import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


import api from "../services/api";

function Login() {

    const navigate = useNavigate();
    
    const [login, setLogin] = useState({
        email: "",
        senha: ""
    });

    const [mensagem, setMensagem] = useState("")


    const handleChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/usuario/login", login);
            localStorage.setItem("token", res.data.token);
            navigate("/area-logada")
            setMensagem("login realizado com sucesso :)")
        }
        catch (err) {
            setMensagem("erro ao realizar login :( ")
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="senha" type="password" placeholder="Senha" onChange={handleChange} />
                <button type="submit">Entrar</button>
            </form>
            <p>{mensagem}</p>
        </div>
    )
}

export default Login;
