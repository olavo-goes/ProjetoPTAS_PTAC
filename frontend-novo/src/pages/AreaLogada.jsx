import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/AreaLogada.module.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import api from "../services/api";

function AreaLogada() {
  const [mesas, setMesas] = useState([]);
  const [mensagem, setMensagem] = useState("");

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

  useEffect(() => {
    carregarMesas();
  }, []);

  async function carregarMesas() {
    const token = localStorage.getItem("token");

    try {
      const resMesas = await api.get("/mesas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mesasBanco = resMesas.data.mesas || [];

      const mesasCompletas = mesasBanco.map((mesa) => ({
        ...mesa,
        status: "disponível",
      }));

      const resReservas = await api.get("/reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reservas = resReservas.data.reservas || [];

      const mesasAtualizadas = mesasCompletas.map((mesa) => {
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
        .filter(
          (padrao) => !mesasAtualizadas.some((m) => m.numero === padrao.numero)
        )
        .map((m) => ({ ...m, status: "disponível", horario: null }));

      setMesas([...mesasAtualizadas, ...mesasFallback]);
    } catch (err) {
      console.error("Erro ao carregar mesas:", err);
      setMensagem("Erro ao carregar mesas.");
    }
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Mesas Disponíveis</h1>
        <p className={styles.text}>Selecione uma mesa para fazer uma reserva.</p>

        {mensagem && <p className={styles.message}>{mensagem}</p>}

        <div className={styles.grid}>
          {mesas.length === 0 ? (
            <p className={styles.empty}>Nenhuma mesa cadastrada.</p>
          ) : (
            mesas.map((mesa) => (
              <div key={mesa.id} className={styles.card}>
                <h3>Mesa {mesa.numero}</h3>
                <p>
                  <strong>Capacidade:</strong> {mesa.capacidade} lugares
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      mesa.status === "ocupada"
                        ? styles.statusOcupada
                        : styles.statusDisponivel
                    }
                  >
                    {mesa.status}
                  </span>
                  {mesa.horario && ` — Horário: ${mesa.horario}`}
                </p>

                {mesa.status === "disponível" ? (
                  <Link
                    to={`/reserva-mesas?mesaId=${mesa.id}`}
                    className={styles.btnReserva}
                  >
                    Fazer Reserva
                  </Link>
                ) : (
                  <button className={styles.btnReservaOcupada} disabled>
                    Ocupada
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer text="© 2025 Reserva de Mesas — Informações institucionais" />
    </>
  );
}

export default AreaLogada;
