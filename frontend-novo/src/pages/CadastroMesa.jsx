import React, { useState } from "react";
import api from "../services/api";
import styles from "./CadastroMesa.module.css";

function CadastroMesa() {
  const [form, setForm] = useState({
    numero: "",
    capacidade: "",
    descricao: "",
  });
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await api.post("/mesas", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMensagem("Mesa cadastrada com sucesso!");
      setForm({ numero: "", capacidade: "", descricao: "" });
    } catch (err) {
      setMensagem("Erro ao cadastrar mesa. Tente novamente.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cadastro de Mesas</h2>

      {mensagem && <p className={styles.message}>{mensagem}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Número da Mesa:
          <input
            type="text"
            name="numero"
            value={form.numero}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label>
          Capacidade:
          <input
            type="number"
            name="capacidade"
            value={form.capacidade}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label>
          Descrição (opcional):
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className={styles.textarea}
          />
        </label>

        <button type="submit" className={styles.submitBtn}>
          Cadastrar Mesa
        </button>
      </form>
    </div>
  );
}

export default CadastroMesa;