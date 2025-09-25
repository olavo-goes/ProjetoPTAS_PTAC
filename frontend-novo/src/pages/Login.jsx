import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./Login.module.css";

function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate(); // ← Hook para navegação

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", login);
      localStorage.setItem("token", res.data.token);
      setMensagem(res.data.mensagem);

    
      navigate("/area-logada");
    } catch (err) {
      if (err.response?.data?.mensagem) {
        setMensagem(err.response.data.mensagem);
      } else {
        setMensagem("Erro ao fazer login");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className={styles.input} />
        <input name="password" type="password" placeholder="Senha" onChange={handleChange} className={styles.input} />
        <button type="submit" className={styles.button}>Entrar</button>
      </form>
      <p className={styles.message}>{mensagem}</p>

      <div className={styles.linkContainer}>
        <p>Não tem uma conta?</p>
        <Link to="/cadastro" className={styles.link}>Cadastre-se aqui</Link>
      </div>
    </div>
  );
}

export default Login;