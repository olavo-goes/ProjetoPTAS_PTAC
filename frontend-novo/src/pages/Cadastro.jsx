import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import styles from "./Cadastro.module.css";

function Cadastro() {
  const [cadastro, setCadastro] = useState({
    nome: "",
    email: "",
    password: ""
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setCadastro({ ...cadastro, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/cadastro", cadastro);
      setMensagem(res.data.mensagem);
    } catch (err) {
      if (err.response?.data?.mensagem) {
        setMensagem(err.response.data.mensagem);
      } else {
        setMensagem("Erro ao cadastrar usuário");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cadastro</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="nome" placeholder="Nome" onChange={handleChange} className={styles.input} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className={styles.input} />
        <input name="password" type="password" placeholder="Senha" onChange={handleChange} className={styles.input} />
        <button type="submit" className={styles.button}>Cadastrar</button>
      </form>
      <p className={styles.message}>{mensagem}</p>

      <div className={styles.linkContainer}>
        <p>Já tem uma conta?</p>
        <Link to="/" className={styles.link}>Faça login aqui</Link>
      </div>
    </div>
  );
}

export default Cadastro;