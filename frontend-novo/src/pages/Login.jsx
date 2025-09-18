import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import styles from "./Login.module.css"; 

function Login() {
    const navigate = useNavigate();

    const [login, setLogin] = useState({
        email: "",
        senha: ""
    });

    const [mensagem, setMensagem] = useState("");

    const handleChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/usuario/login", login);
            localStorage.setItem("token", res.data.token);
            navigate("/area-logada");
            setMensagem("Login realizado com sucesso :)");
        } catch (err) {
            setMensagem("Erro ao realizar login :(");
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className={styles.input}
                />
                <input
                    name="senha"
                    type="password"
                    placeholder="Senha"
                    onChange={handleChange}
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Entrar</button>
            </form>

            <p className={styles.message}>{mensagem}</p>

            <p>
                Ainda não tem uma conta?{" "}
                <Link to="/cadastro">Cadastre-se aqui</Link>
            </p>
        </div>
    );
}

export default Login;
