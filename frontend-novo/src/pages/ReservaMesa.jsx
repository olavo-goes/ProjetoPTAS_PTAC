import React, { useState, useEffect } from "react";
import api from "../services/api";
import styles from "../styles/ReservaMesa.module.css";

function ReservaMesa() {
  const [form, setForm] = useState({
    data: "",
    horario: "",
    mesaId: "",
    n_pessoas: ""
  });

  const [mensagem, setMensagem] = useState("");
  const [mesas, setMesas] = useState([]);

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

      const reservas = responseReservas.data.reservas || [];

      const reservasAtivas = reservas.filter(
        (reserva) =>
          reserva.status !== "cancelada" && reserva.status !== "finalizada"
      );

      const mesas = responseMesas.data.mesas || [];

      const mesasLivres = mesas.filter(
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
      await api.post(
        "/reservas/novo",
        {
          mesaId: Number(form.mesaId),
          data: form.data,
          horario: form.horario,
          n_pessoas: Number(form.n_pessoas),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMensagem("Reserva confirmada com sucesso!");

      setForm({
        data: "",
        horario: "",
        mesaId: "",
        n_pessoas: "",
      });

      buscarMesasDisponiveis();
    } catch (err) {
      console.error("Erro ao reservar:", err);

      if (err.response) {
        setMensagem(err.response.data.mensagem || "Erro ao confirmar reserva.");
      } else {
        setMensagem("Erro inesperado ao reservar.");
      }
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
          Nº de Pessoas:
          <input
            type="number"
            name="n_pessoas"
            value={form.n_pessoas}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label>
          Mesa:
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
