import React, { useState } from "react";
import api from "../services/api";

import styles from "./Cadastro.module.css"; // Importando o CSS Module

function Cadastro() {
    const [cadastro, setCadastro] = useState({
        nome: "",
        email: "",
        senha: ""
    });

    const [mensagem, setMensagem] = useState("");

    const handleChange = (e) => {
        setCadastro({ ...cadastro, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/usuario/cadastro", cadastro);
            setMensagem(`Usuário cadastrado com o ID ${res.data.usuarioId}`);
        } catch (err) {
            setMensagem("Erro ao cadastrar usuário");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Cadastro</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    name="nome"
                    placeholder="Nome"
                    onChange={handleChange}
                    className={styles.input}
                />
                <input
                    name="email"
                    type="email"
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
                <button type="submit" className={styles.button}>Cadastrar</button>
            </form>
            <p className={styles.message}>{mensagem}</p>
        </div>
    );
}

export default Cadastro;
