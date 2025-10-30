import React, { useEffect, useState } from "react";
import api from "../services/api";
import styles from "../styles/Perfil.module.css";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senhaAtual: "", novaSenha: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPerfil = async () => {
      try {
        const res = await api.get("/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuario(res.data.usuario);
        setForm({
          nome: res.data.usuario.nome,
          email: res.data.usuario.email,
          senhaAtual: "",
          novaSenha: "",
        });
      } catch (err) {
        setMensagem("Erro ao carregar perfil. Exibindo dados simulados.");
        const simulado = { nome: "Usuário Simulado", email: "simulado@exemplo.com" };
        setUsuario(simulado);
        setForm({ ...simulado, senhaAtual: "", novaSenha: "" });
      }
    };

    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      const token = localStorage.getItem("token");

      // Atualiza nome e e-mail
      const res = await api.put(
        "/perfil",
        { nome: form.nome, email: form.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Atualiza senha (se informada)
      if (form.senhaAtual && form.novaSenha) {
        await api.put(
          "/perfil/senha",
          { senhaAtual: form.senhaAtual, novaSenha: form.novaSenha },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setUsuario(res.data.usuario);
      setMensagem("Perfil atualizado com sucesso!");
      setEditando(false);
      setForm({ ...form, senhaAtual: "", novaSenha: "" });
    } catch (err) {
      setMensagem("Erro ao salvar alterações. Alterações locais mantidas.");
      setUsuario({ nome: form.nome, email: form.email });
      setEditando(false);
    }
  };

  if (!usuario) {
    return <p className={styles.loading}>Carregando perfil...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Meu Perfil</h2>

      <div className={styles.card}>
        {editando ? (
          <div className={styles.form}>
            <label>
              Nome:
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <div className={styles.senhaSection}>
              <h4>Alterar senha</h4>
              <label>
                Senha atual:
                <input
                  type="password"
                  name="senhaAtual"
                  value={form.senhaAtual}
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
              <label>
                Nova senha:
                <input
                  type="password"
                  name="novaSenha"
                  value={form.novaSenha}
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
            </div>

            <div className={styles.buttons}>
              <button onClick={handleSalvar} className={styles.saveBtn}>
                Salvar
              </button>
              <button
                onClick={() => {
                  setForm({ ...usuario, senhaAtual: "", novaSenha: "" });
                  setEditando(false);
                }}
                className={styles.cancelBtn}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.info}>
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <button onClick={() => setEditando(true)} className={styles.editBtn}>
              Editar Perfil
            </button>
          </div>
        )}
      </div>

      {mensagem && <p className={styles.message}>{mensagem}</p>}
    </div>
  );
}

export default Perfil;
