import React, { useState, useEffect } from "react";
import styles from "../styles/CadastroMesa.module.css";
import api from "../services/api";

function CadastroMesa() {
  const [form, setForm] = useState({
    numero: "",
    capacidade: "",
    descricao: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [mesas, setMesas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    buscarMesas();
  }, []);

  const buscarMesas = async () => {
    const token = localStorage.getItem("token");

    try {
      const responseMesas = await api.get("/mesas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseReservas = await api.get("/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reservas = responseReservas.data.reservas;

      const mesasAtualizadas = responseMesas.data.mesas.map((mesa) => {
        const reservaAtiva = reservas.find(
          (reserva) =>
            reserva.mesaId === mesa.id &&
            reserva.status !== "cancelada" &&
            reserva.status !== "finalizada"
        );
        return {
          ...mesa,
          status: reservaAtiva ? "ocupada" : "disponível",
        };
      });

      setMesas(mesasAtualizadas);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao carregar mesas e reservas.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const payload = {
        numero: form.numero,
        capacidade: parseInt(form.capacidade),
        descricao: form.descricao,
      };

      if (editandoId) {
        await api.put(`/mesas/${editandoId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagem("Mesa atualizada com sucesso!");
      } else {
        await api.post("/mesas", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagem("Mesa cadastrada com sucesso!");
      }

      setForm({ numero: "", capacidade: "", descricao: "" });
      setEditandoId(null);
      buscarMesas();
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao salvar mesa.");
    }
  };

  const handleEditar = (mesa) => {
    setForm({
      numero: mesa.numero,
      capacidade: mesa.capacidade,
      descricao: mesa.descricao,
    });
    setEditandoId(mesa.id);
  };

  const handleExcluir = async (id) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Deseja realmente excluir esta mesa?")) {
      try {
        await api.delete(`/mesas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensagem("Mesa excluída com sucesso!");
        buscarMesas();
      } catch (err) {
        console.error(err);
        setMensagem("Erro ao excluir mesa.");
      }
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
              <strong>Capacidade:</strong> {mesa.capacidade} |{" "}
              <strong>Status:</strong> {mesa.status}
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