import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/AreaLogada.module.css";
import Header from "../Components/Header";

function AreaLogada() {
  const [mesas, setMesas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    // Simulação de dados estáticos com horário para mesas ocupadas
    const mesasSimuladas = [
      { id: 1, numero: 101, capacidade: 4, status: "disponível" },
      { id: 2, numero: 102, capacidade: 6, status: "ocupada", horario: "12:00 - 13:30" },
      { id: 3, numero: 103, capacidade: 2, status: "disponível" },
      { id: 4, numero: 104, capacidade: 8, status: "ocupada", horario: "19:00 - 21:00" },
      { id: 5, numero: 105, capacidade: 3, status: "disponível" },
      { id: 6, numero: 106, capacidade: 5, status: "ocupada", horario: "11:30 - 12:30" },
      { id: 7, numero: 107, capacidade: 4, status: "disponível" },
      { id: 8, numero: 108, capacidade: 6, status: "ocupada", horario: "18:00 - 19:30" },
      { id: 9, numero: 109, capacidade: 2, status: "disponível" },
      { id: 10, numero: 110, capacidade: 3, status: "ocupada", horario: "13:00 - 14:00" },
      { id: 11, numero: 111, capacidade: 4, status: "disponível" },
      { id: 12, numero: 112, capacidade: 6, status: "ocupada", horario: "20:00 - 22:00" },
      { id: 13, numero: 113, capacidade: 2, status: "disponível" },
      { id: 14, numero: 114, capacidade: 8, status: "ocupada", horario: "17:00 - 18:30" },
      { id: 15, numero: 115, capacidade: 3, status: "disponível" },
    ];
    setMesas(mesasSimuladas);
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Mesas Disponiveis</h1>
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
                      mesa.status.toLowerCase() === "ocupada"
                        ? styles.statusOcupada
                        : styles.statusDisponivel
                    }
                  >
                    {mesa.status}
                  </span>
                </p>
                {mesa.status.toLowerCase() === "ocupada" && mesa.horario && (
                  <p>
                    <strong>Horário reservado:</strong> {mesa.horario}
                  </p>
                )}

                <Link
                  to={`/reserva-mesas`}
                  className={styles.btnReserva}
                >
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