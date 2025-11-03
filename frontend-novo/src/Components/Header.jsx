import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Reserva de Mesas</div>
      <button className={styles.menuButton} onClick={toggleMenu}>
        ☰ Menu
      </button>

      {menuAberto && (
        <div className={styles.modalOverlay} onClick={fecharMenu}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Menu</h2>
            <nav className={styles.modalNav}>
              <Link to="/" className={styles.modalLink} onClick={fecharMenu}>Login</Link>
              <Link to="/perfil" className={styles.modalLink} onClick={fecharMenu}>Meu Perfil</Link>
              <Link to="/perfis" className={styles.modalLink} onClick={fecharMenu}>Usuarios</Link>
              <Link to="/cadastro-mesas" className={styles.modalLink} onClick={fecharMenu}>Cadastro Mesas</Link>
              <Link to="/area-logada" className={styles.modalLink} onClick={fecharMenu}>Área Logada</Link>
              <Link to="/" className={styles.modalLink} onClick={fecharMenu}>Sair</Link>
              <Link to="/listar-reservas" className={styles.modalLink} onClick={fecharMenu}>Minhas Reservas</Link>
            </nav>
            <button className={styles.btnFechar} onClick={fecharMenu}>Fechar</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;