import React, { useState } from "react";
import styles from "../styles/ConsultarMesas.module.css";

export default function ConsultarMesas() {
  const [numeroMesa, setNumeroMesa] = useState("");
  const [statusMesa, setStatusMesa] = useState("");
  const [capacidadeMesa, setCapacidadeMesa] = useState("");
  const [capacidade, setCapacidade] = useState(null);
  const [erro, setErro] = useState("");

  const mesas = [
    { numero: 1, status: "livre", capacidade: 4 },
    { numero: 2, status: "ocupada", capacidade: 6 },
    { numero: 3, status: "reservada", capacidade: 2 },
    { numero: 4, status: "livre", capacidade: 8 },
  ];

  const handleConsultar = () => {
    setErro("");
    setCapacidade(null);

    if (!numeroMesa && !statusMesa && !capacidadeMesa) {
      setErro("Informe pelo menos um filtro para consultar!");
      return;
    }

    const resultado = mesas.find((m) => {
      if (numeroMesa && statusMesa && capacidadeMesa) {
        return (
          m.numero === Number(numeroMesa) &&
          m.status === statusMesa &&
          m.capacidade === Number(capacidadeMesa)
        );
      } else if (numeroMesa && statusMesa) {
        return m.numero === Number(numeroMesa) && m.status === statusMesa;
      } else if (numeroMesa && capacidadeMesa) {
        return m.numero === Number(numeroMesa) && m.capacidade === Number(capacidadeMesa);
      } else if (statusMesa && capacidadeMesa) {
        return m.status === statusMesa && m.capacidade === Number(capacidadeMesa);
      } else if (numeroMesa) {
        return m.numero === Number(numeroMesa);
      } else if (statusMesa) {
        return m.status === statusMesa;
      } else if (capacidadeMesa) {
        return m.capacidade === Number(capacidadeMesa);
      }
      return false;
    });

    if (resultado) {
      setCapacidade(resultado.capacidade);
    } else {
      setErro("Mesa não encontrada.");
    }
  };

  const handleLimpar = () => {
    setNumeroMesa("");
    setStatusMesa("");
    setCapacidadeMesa("");
    setCapacidade(null);
    setErro("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Consulta de Mesas</h1>

      <div className={styles.consultaBox}>
        <div className={styles.campo}>
          <label>Número da mesa:</label>
          <input
            type="number"
            value={numeroMesa}
            onChange={(e) => setNumeroMesa(e.target.value)}
            placeholder="Ex: 1"
          />
        </div>

        <div className={styles.campo}>
          <label>Status da mesa:</label>
          <select
            value={statusMesa}
            onChange={(e) => setStatusMesa(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="livre">Livre</option>
            <option value="ocupada">Ocupada</option>
            <option value="reservada">Reservada</option>
          </select>
        </div>

        <div className={styles.campo}>
          <label>Capacidade da mesa:</label>
          <select
            value={capacidadeMesa}
            onChange={(e) => setCapacidadeMesa(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="2">2 pessoas</option>
            <option value="4">4 pessoas</option>
            <option value="6">6 pessoas</option>
            <option value="8">8 pessoas</option>
          </select>
        </div>

        <div className={styles.botoes}>
          <button className={styles.btnConsultar} onClick={handleConsultar}>
            Consultar
          </button>
          <button className={styles.btnLimpar} onClick={handleLimpar}>
            Limpar
          </button>
        </div>

        {erro && <p className={styles.mensagemErro}>{erro}</p>}

        {capacidade !== null && !erro && (
          <p className={styles.mensagemSucesso}>
            Capacidade da mesa: <strong>{capacidade} pessoas</strong>
          </p>
        )}
      </div>
    </div>
  );
}
