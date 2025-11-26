import React, { useEffect, useState } from "react";
import api from "../services/api";
import styles from "../styles/Perfil.module.css";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    senhaAtual: "",
    novaSenha: ""
  });

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
          sobrenome: res.data.usuario.sobrenome,
          email: res.data.usuario.email,
          rua: res.data.usuario.rua,
          numero: res.data.usuario.numero,
          bairro: res.data.usuario.bairro,
          cidade: res.data.usuario.cidade,
          uf: res.data.usuario.uf,
          senhaAtual: "",
          novaSenha: "",
        });
      } catch (err) {
        const simulado = {
          nome: "Usuário 1",
          sobrenome: "Sobrenome",
          email: "usuario1@exemplo.com",
          rua: "Rua A",
          numero: "123",
          bairro: "Centro",
          cidade: "Cidade",
          uf: "MS"
        };
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
      const res = await api.patch(
        "/perfil",
        { usuario: { 
            nome: form.nome,
            sobrenome: form.sobrenome,
            email: form.email,
            rua: form.rua,
            numero: form.numero,
            bairro: form.bairro,
            cidade: form.cidade,
            uf: form.uf
          } 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (form.senhaAtual && form.novaSenha) {
        await api.patch(
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
      setUsuario({ 
        nome: form.nome,
        sobrenome: form.sobrenome,
        email: form.email,
        rua: form.rua,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.cidade,
        uf: form.uf
      });
      setEditando(false);
    }
  };

  if (!usuario) {
    return <p className={styles.loading}>Carregando perfil...</p>;
  }

  return (
    <div className={styles.container}>
    <button 
  onClick={() => window.location.href = "/area-logada"} 
  className={styles.backBtn}
>
  Voltar para a Página Inicial
</button>

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
              Sobrenome:
              <input
                type="text"
                name="sobrenome"
                value={form.sobrenome}
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
            <label>
              Rua:
              <input
                type="text"
                name="rua"
                value={form.rua}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              Número:
              <input
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              Bairro:
              <input
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              Cidade:
              <input
                type="text"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
            <label>
              UF:
              <input
                type="text"
                name="uf"
                value={form.uf}
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
            <p><strong>Sobrenome:</strong> {usuario.sobrenome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Rua:</strong> {usuario.rua}</p>
            <p><strong>Número:</strong> {usuario.numero}</p>
            <p><strong>Bairro:</strong> {usuario.bairro}</p>
            <p><strong>Cidade:</strong> {usuario.cidade}</p>
            <p><strong>UF:</strong> {usuario.uf}</p>
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