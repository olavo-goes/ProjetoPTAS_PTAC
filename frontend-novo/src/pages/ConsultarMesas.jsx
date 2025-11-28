import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ConsultarMesas.module.css";
import api from "../services/api";

export default function ConsultarMesas() {
  const [numeroMesa, setNumeroMesa] = useState("");
  const [statusMesa, setStatusMesa] = useState("");
  const [capacidadeMesa, setCapacidadeMesa] = useState("");
  const [resultado, setResultado] = useState([]);
  const [erro, setErro] = useState("");

  const mesasPadrao = [
    { id: "p1", numero: 101, capacidade: 4 },
    { id: "p2", numero: 102, capacidade: 6 },
    { id: "p3", numero: 103, capacidade: 2 },
    { id: "p4", numero: 104, capacidade: 8 },
    { id: "p5", numero: 105, capacidade: 3 },
    { id: "p6", numero: 106, capacidade: 5 },
    { id: "p7", numero: 107, capacidade: 4 },
    { id: "p8", numero: 108, capacidade: 6 },
    { id: "p9", numero: 109, capacidade: 2 },
    { id: "p10", numero: 110, capacidade: 3 }
  ];

  const handleConsultar = async () => {
    setErro("");
    setResultado([]);

    if (!numeroMesa && !statusMesa && !capacidadeMesa) {
      setErro("Informe pelo menos um filtro para consultar!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const resMesas = await api.get("/mesas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mesasBanco = resMesas.data.mesas || [];

      const resReservas = await api.get("/reservas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reservas = resReservas.data.reservas || [];

      const mesasAtualizadas = mesasBanco.map((mesa) => {
        const reservaAtiva = reservas.find(
          (r) =>
            r.mesaId === mesa.id &&
            r.status !== "cancelada" &&
            r.status !== "finalizada"
        );

        return {
          ...mesa,
          status: reservaAtiva ? "ocupada" : "disponível",
          horario: reservaAtiva
            ? `${String(new Date(reservaAtiva.data).getHours()).padStart(2, "0")}:${String(
                new Date(reservaAtiva.data).getMinutes()
              ).padStart(2, "0")}`
            : null
        };
      });

      const mesasFallback = mesasPadrao
        .filter((padrao) => !mesasAtualizadas.some((m) => m.numero === padrao.numero))
        .map((m) => ({ ...m, status: "disponível", horario: null }));

      const todasMesas = [...mesasAtualizadas, ...mesasFallback];

      const filtro = todasMesas.filter((m) => {
        if (numeroMesa && Number(m.numero) !== Number(numeroMesa)) return false;
        if (statusMesa && m.status.toLowerCase() !== statusMesa.toLowerCase()) return false;
        if (capacidadeMesa && Number(m.capacidade) !== Number(capacidadeMesa)) return false;
        return true;
      });

      if (filtro.length === 0) {
        setErro("Nenhuma mesa encontrada.");
      } else {
        setResultado(filtro);
      }
    } catch (error) {
      console.error(error);
      setErro("Erro ao consultar mesas.");
    }
  };

  const handleLimpar = () => {
    setNumeroMesa("");
    setStatusMesa("");
    setCapacidadeMesa("");
    setResultado([]);
    setErro("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Consulta de Mesas</h1>

      <div className={styles["consulta-box"]}>
        <div className={styles.campo}>
          <label>Número da mesa:</label>
          <input
            type="number"
            value={numeroMesa}
            onChange={(e) => setNumeroMesa(e.target.value)}
            placeholder="Ex: 101"
            className={styles.input}
          />
        </div>

        <div className={styles.campo}>
          <label>Status da mesa:</label>
          <select
            value={statusMesa}
            onChange={(e) => setStatusMesa(e.target.value)}
            className={styles.select}
          >
            <option value="">Selecione...</option>
            <option value="disponível">Disponível</option>
            <option value="ocupada">Ocupada</option>
          </select>
        </div>

        <div className={styles.campo}>
          <label>Capacidade (nº de lugares):</label>
          <input
            type="number"
            value={capacidadeMesa}
            onChange={(e) => setCapacidadeMesa(e.target.value)}
            placeholder="Ex: 4"
            className={styles.input}
          />
        </div>

        <div className={styles.botoes}>
          <button
            type="button"
            className={styles["btn-consultar"]}
            onClick={handleConsultar}
          >
            Consultar
          </button>
          <button
            type="button"
            className={styles["btn-limpar"]}
            onClick={handleLimpar}
          >
            Limpar
          </button>
        </div>

        {erro && <p className={styles["message-error"]}>{erro}</p>}

        {resultado.length > 0 && (
          <div className={styles["resultado-box"]}>
            {resultado.map((m) => (
              <p key={m.id || m.numero} className={styles["message-success"]}>
                Mesa {m.numero} — {m.status}{" "}
                {m.horario ? `— Horário: ${m.horario}` : ""} — {m.capacidade} lugares
              </p>
            ))}
          </div>
        )}
      </div>

      <Link to="/area-logada" className={styles.btnVoltar}>
        ← Voltar para o início
      </Link>
    </div>
  );
}