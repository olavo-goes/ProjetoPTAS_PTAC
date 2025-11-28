import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/ReservaMesa.module.css";

function ReservaMesa() {
  const [mesas, setMesas] = useState([]);
  const [form, setForm] = useState({
    data: "",
    horario: "",
    mesaId: "",
    n_pessoas: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [reservaFeita, setReservaFeita] = useState(null);
  const location = useLocation();

  const mesasFixas = [
    { id: "p1", numero: "101", capacidade: 4 },
    { id: "p2", numero: "102", capacidade: 6 },
    { id: "p3", numero: "103", capacidade: 2 },
    { id: "p4", numero: "104", capacidade: 8 },
    { id: "p5", numero: "105", capacidade: 3 },
    { id: "p6", numero: "106", capacidade: 5 },
    { id: "p7", numero: "107", capacidade: 4 },
    { id: "p8", numero: "108", capacidade: 6 },
    { id: "p9", numero: "109", capacidade: 2 },
    { id: "p10", numero: "110", capacidade: 3 }
  ];

  // Pegar mesaId da URL (quando vem do card)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mesaId = params.get("mesaId");
    if (mesaId) {
      setForm((prev) => ({ ...prev, mesaId }));
    }
  }, [location]);

  // Buscar mesas do banco + fixas
  useEffect(() => {
    const fetchMesas = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/mesas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mesasBanco = res.data.mesas || [];

        const numerosBanco = new Set(mesasBanco.map((m) => String(m.numero)));
        const fixasNaoDuplicadas = mesasFixas.filter(
          (m) => !numerosBanco.has(String(m.numero))
        );

        setMesas([...mesasBanco, ...fixasNaoDuplicadas]);
      } catch (err) {
        console.error("Erro ao carregar mesas:", err);
        setMesas(mesasFixas);
      }
    };
    fetchMesas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await api.post("/reservas/novo", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensagem("Reserva realizada com sucesso!");
      setReservaFeita(res.data.reserva); // guarda a reserva retornada pelo backend
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao fazer reserva.");
    }
  };

  // função auxiliar para pegar info da mesa
  const getMesaInfo = (mesaId) => {
    const mesa = mesas.find((m) => m.id === mesaId);
    if (mesa) return mesa;
    return mesasFixas.find((m) => m.id === mesaId) || { numero: mesaId, capacidade: null };
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reserva Mesa</h1>
      {mensagem && <p className={styles.message}>{mensagem}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Data da Reserva:
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
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
            required
          />
        </label>

        <label>
          Mesa:
          <select
            name="mesaId"
            value={form.mesaId}
            onChange={handleChange}
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

        <button type="submit" className={styles.btnReserva}>
          Confirmar Reserva
        </button>
      </form>

      {/* Card da reserva recém-criada */}
      {reservaFeita && (
        <div className={styles.card}>
          <h3>
            Mesa {getMesaInfo(reservaFeita.mesaId || reservaFeita.mesaFixa).numero}
          </h3>
          <p><strong>Data:</strong> {new Date(reservaFeita.data).toLocaleDateString()}</p>
          <p><strong>Horário:</strong> {new Date(reservaFeita.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          <p><strong>Pessoas:</strong> {reservaFeita.n_pessoas}</p>
        </div>
      )}
    </div>
  );
}

export default ReservaMesa;