import React, { useState, useEffect } from "react";
import styles from "../styles/ListarReservas.module.css";
import Header from "../Components/Header";
import { Link } from "react-router-dom";
import api from "../services/api";

function ListarReservas() {
  const [reservas, setReservas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novaData, setNovaData] = useState("");
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      const token = localStorage.getItem("token");

      // Dados simulados fixos
      const reservasSimuladas = [
        { id: "r1", mesaNumero: "101", data: "2025-10-30", numeroReserva: "R001" },
        { id: "r2", mesaNumero: "102", data: "2025-11-01", numeroReserva: "R002" },
        { id: "r3", mesaNumero: "103", data: "2025-11-05", numeroReserva: "R003" },
      ];

      try {
        const res = await api.get("/reservas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reservasReais = (res.data.reservas || []).map((r) => ({
          id: r.id,
          mesaNumero: String(r.mesaNumero),
          data: new Date(r.data).toISOString().split("T")[0],
          numeroReserva: `R${String(r.id).padStart(3, "0")}`,
        }));

        // Combina simuladas + reais
        setReservas([...reservasSimuladas, ...reservasReais]);
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
        setReservas(reservasSimuladas); // fallback só com simuladas
      }
    };

    fetchReservas();
  }, []);

  const cancelarReserva = (id) => {
    if (window.confirm("Deseja cancelar esta reserva?")) {
      setReservas((prev) => prev.filter((reserva) => reserva.id !== id));
      // Opcional: chamar DELETE /reservas/:id no backend
    }
  };

  const iniciarEdicao = (id, dataAtual) => {
    setEditandoId(id);
    setNovaData(dataAtual);
  };

  const salvarEdicao = (id) => {
    setReservas((prev) =>
      prev.map((reserva) =>
        reserva.id === id ? { ...reserva, data: novaData } : reserva
      )
    );
    setEditandoId(null);
    setNovaData("");
    // Opcional: chamar PUT /reservas/:id no backend
  };

  const abrirModal = (reserva) => {
    setReservaSelecionada(reserva);
  };

  const fecharModal = () => {
    setReservaSelecionada(null);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Minhas Reservas</h1>
        <Link to="/area-logada" className={styles.btnVoltar}>
          ← Voltar para o início
        </Link>

        {reservas.length === 0 ? (
          <p className={styles.empty}>Você não possui reservas.</p>
        ) : (
          <div className={styles.grid}>
            {reservas.map((reserva) => (
              <div key={reserva.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Reserva {reserva.numeroReserva}</h3>
                  <span className={styles.mesa}>Mesa {reserva.mesaNumero}</span>
                </div>

                <div className={styles.cardBody}>
                  {editandoId === reserva.id ? (
                    <>
                      <label className={styles.label}>Nova data:</label>
                      <input
                        type="date"
                        value={novaData}
                        onChange={(e) => setNovaData(e.target.value)}
                        className={styles.input}
                      />
                      <button
                        className={styles.btnSalvar}
                        onClick={() => salvarEdicao(reserva.id)}
                      >
                        Salvar
                      </button>
                    </>
                  ) : (
                    <p>
                      <strong>Data:</strong> {reserva.data}
                    </p>
                  )}
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.btnCancelar}
                    onClick={() => cancelarReserva(reserva.id)}
                  >
                    Cancelar
                  </button>
                  <button
                    className={styles.btnEditar}
                    onClick={() => iniciarEdicao(reserva.id, reserva.data)}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.btnDetalhes}
                    onClick={() => abrirModal(reserva)}
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reservaSelecionada && (
        <div className={styles.modalOverlay} onClick={fecharModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Detalhes da Reserva</h2>
            <p>
              <strong>Número da Reserva:</strong>{" "}
              {reservaSelecionada.numeroReserva}
            </p>
            <p>
              <strong>Mesa:</strong> {reservaSelecionada.mesaNumero}
            </p>
            <p>
              <strong>Data:</strong> {reservaSelecionada.data}
            </p>
            <button className={styles.btnFechar} onClick={fecharModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ListarReservas;