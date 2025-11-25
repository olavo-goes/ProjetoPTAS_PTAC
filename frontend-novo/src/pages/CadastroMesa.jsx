import React, { useState } from "react";
import styles from "../styles/CadastroMesa.module.css";

function CadastroMesa() {
  const [form, setForm] = useState({
    numero: "",
    capacidade: "",
    descricao: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [mesas, setMesas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  // 🔹 Atualiza inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Simula salvar / atualizar
  const handleSubmit = (e) => {
    e.preventDefault();

    setMensagem("Salvando...");

    setTimeout(() => {
      if (editandoId) {
        // Atualiza mesa existente
        const mesasAtualizadas = mesas.map((m) =>
          m.id === editandoId ? { ...m, ...form } : m
        );
        setMesas(mesasAtualizadas);
        setMensagem("Mesa atualizada com sucesso!");
      } else {
        // Cria nova mesa
        const novaMesa = {
          id: Date.now(),
          ...form,
        };
        setMesas([...mesas, novaMesa]);
        setMensagem("Mesa cadastrada com sucesso!");
      }

      setForm({ numero: "", capacidade: "", descricao: "" });
      setEditandoId(null);
    }, 700); // simula demora
  };

  const handleEditar = (mesa) => {
    setForm({
      numero: mesa.numero,
      capacidade: mesa.capacidade,
      descricao: mesa.descricao,
    });
    setEditandoId(mesa.id);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Deseja realmente excluir esta mesa?")) {
      setMesas(mesas.filter((mesa) => mesa.id !== id));
      setMensagem("Mesa excluída com sucesso!");
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
          Descrição:
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className={styles.textarea}
          />
        </label>

        <button type="submit" className={styles.submitBtn}>
          {editandoId ? "Atualizar Mesa" : "Salvar Mesa"}
        </button>
      </form>

      <h3 className={styles.subtitle}>Mesas Cadastradas</h3>
      <ul className={styles.lista}>
        {mesas.map((mesa) => (
          <li key={mesa.id} className={styles.item}>
            <div>
              <strong>Número:</strong> {mesa.numero} |{" "}
              <strong>Capacidade:</strong> {mesa.capacidade}
            </div>

            <div className={styles.btnGroup}>
              <button
                onClick={() => handleEditar(mesa)}
                className={styles.editBtn}
              >
                Editar
              </button>

              <button
                onClick={() => handleExcluir(mesa.id)}
                className={styles.deleteBtn}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CadastroMesa;
