import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import styles from "../styles/ListaPerfis.module.css";

function ListaPerfis() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.usuarios && res.data.usuarios.length > 0) {
          setUsuarios(res.data.usuarios);
        } else {
          setMensagem("Nenhum perfil encontrado.");
        }
      } catch (err) {
        const simulados = [
          { id: 1, nome: "Perfil 1", email: "perfil1@exemplo.com" },
          { id: 2, nome: "Perfil 2", email: "perfil2@exemplo.com" },
          { id: 3, nome: "Perfil 3", email: "perfil3@exemplo.com" },
          { id: 4, nome: "Perfil 4", email: "perfil4@exemplo.com" },
          { id: 5, nome: "Perfil 5", email: "perfil5@exemplo.com" },
          { id: 6, nome: "Perfil 6", email: "perfil6@exemplo.com" },
        ];
        setUsuarios(simulados);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Perfis</h2>

      <Link to="/area-logada" className={styles.btnVoltar}>
        ← Voltar para o início
      </Link>

      {mensagem && <p className={styles.message}>{mensagem}</p>}

      <div className={styles.lista}>
        {usuarios.map((usuario) => (
          <div key={usuario.id} className={styles.card}>
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>

            <div className={styles.actions}>
              <Link to={`/perfil`} className={styles.viewBtn}>
                👁 Ver
              </Link>
              <Link to={`/perfil`} className={styles.editBtn}>
                ✏ Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaPerfis;