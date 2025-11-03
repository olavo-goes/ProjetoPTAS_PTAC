import React, { useState, useEffect } from "react";
import api from "../services/api";
import styles from "../styles/ReservaMesa.module.css";

function ReservaMesa() {
  const [form, setForm] = useState({
    data: "",
    horario: "",
    nomeCliente: "",
    contato: "",
    mesaId: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [mesas, setMesas] = useState([]);

  // 🔹 Carrega mesas disponíveis
  useEffect(() => {
    buscarMesasDisponiveis();
  }, []);

  const buscarMesasDisponiveis = async () => {
    const token = localStorage.getItem("token");

    try {
      const responseMesas = await api.get("/mesas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseReservas = await api.get("/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reservasAtivas = responseReservas.data.filter(
        (reserva) =>
          reserva.status !== "cancelada" && reserva.status !== "finalizada"
      );

      // 🔹 Filtra apenas mesas livres
      const mesasLivres = responseMesas.data.filter(
        (mesa) => !reservasAtivas.find((r) => r.mesaId === mesa.id)
      );

      setMesas(mesasLivres);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao carregar mesas disponíveis.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await api.post("/reservas", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensagem("Reserva confirmada com sucesso!");
      setForm({
        data: "",
        horario: "",
        nomeCliente: "",
        contato: "",
        mesaId: "",
      });

      buscarMesasDisponiveis(); // Atualiza lista de mesas
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao confirmar reserva. Tente novamente.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reserva Mesa</h2>

      {mensagem && <p className={styles.message}>{mensagem}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Data da Reserva:
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label>
          Horário:
          <input
            type="time"
            name="horario"
            value={form.horario}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label>
          Nome do Cliente:
          <input
            type="text"
            name="nomeCliente"
            value={form.nomeCliente}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label>
          Contato:
          <input
            type="text"
            name="contato"
            value={form.contato}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label>
          Seleção da Mesa:
          <select
            name="mesaId"
            value={form.mesaId}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Selecione uma mesa</option>
            {mesas.map((mesa) => (
              <option key={mesa.id} value={mesa.id}>
                Mesa {mesa.numero} — {mesa.capacidade} lugares
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className={styles.submitBtn}>
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
}

export default ReservaMesa;
