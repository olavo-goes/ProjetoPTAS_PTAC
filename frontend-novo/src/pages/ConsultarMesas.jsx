import React, { useState } from "react";
import styles from "../styles/ConsultarMesas.module.css";

export default function ConsultarMesas() {
  const [numeroMesa, setNumeroMesa] = useState("");
  const [statusMesa, setStatusMesa] = useState("");
  const [capacidadeMesa, setCapacidadeMesa] = useState("");
  const [resultado, setResultado] = useState([]);
  const [erro, setErro] = useState("");

  const mesas = [
    { numero: 1, status: "livre", capacidade: 4 },
    { numero: 2, status: "ocupada", capacidade: 6 },
    { numero: 3, status: "reservada", capacidade: 2 },
    { numero: 4, status: "livre", capacidade: 8 }
  ];

  const handleConsultar = () => {
    setErro("");
    setResultado([]);

    if (!numeroMesa && !statusMesa && !capacidadeMesa) {
      setErro("Informe pelo menos um filtro para consultar!");
      return;
    }

    const filtro = mesas.filter((m) => {
      if (numeroMesa && m.numero !== Number(numeroMesa)) return false;
      if (statusMesa && m.status !== statusMesa) return false;
      if (capacidadeMesa && m.capacidade !== Number(capacidadeMesa)) return false;
      return true;
    });

    if (filtro.length === 0) {
      setErro("Nenhuma mesa encontrada.");
    } else {
      setResultado(filtro);
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
            placeholder="Ex: 1"
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
            <option value="livre">Livre</option>
            <option value="ocupada">Ocupada</option>
            <option value="reservada">Reservada</option>
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
          <button type="button" className={styles["btn-consultar"]} onClick={handleConsultar}>
            Consultar
          </button>
          <button type="button" className={styles["btn-limpar"]} onClick={handleLimpar}>
            Limpar
          </button>
        </div>

        {erro && <p className={styles["message-error"]}>{erro}</p>}

        {resultado.length > 0 && (
          <div className={styles["resultado-box"]}>
            {resultado.map((m) => (
              <p key={m.numero} className={styles["message-success"]}>
                Mesa {m.numero} — {m.status} — {m.capacidade} lugares
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
