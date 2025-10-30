import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/AreaLogada.module.css";
import Header from "../Components/Header";
import api from "../services/api";

function AreaLogada() {
  const [mesas, setMesas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    buscarMesas();
  }, []);

  const buscarMesas = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/mesas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMesas(response.data);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao carregar mesas.");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Mesas Cadastradas</h1>
        <p className={styles.text}>
          Selecione uma mesa para fazer uma reserva.
        </p>

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
                    {mesa.status || "disponível"}
                  </span>
                </p>

                {/* 🔹 Link para a página de reserva */}
                <Link to={`/reserva/${mesa.id}`} className={styles.btnReserva}>
                  Fazer Reserva
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default AreaLogada;
