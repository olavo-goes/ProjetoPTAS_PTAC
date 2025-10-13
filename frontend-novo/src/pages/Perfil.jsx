import React, { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./Perfil.module.css";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPerfil = async () => {
      try {
        const res = await api.get("/perfil", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuario(res.data.usuario);
      } catch (err) {
        setMensagem("Erro ao carregar perfil");
      }
    };

    fetchPerfil();
  }, []);

  if (!usuario) {
    return <p className={styles.loading}>Carregando perfil...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Meu Perfil</h2>
      <div className={styles.card}>
        <div className={styles.info}>
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
        </div>
      </div>
      {mensagem && <p className={styles.message}>{mensagem}</p>}
    </div>
  );
}

export default Perfil;