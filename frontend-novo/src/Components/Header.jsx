import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Reserva de Mesas</div>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>Login</Link>
        <Link to="/perfil" className={styles.link}>Perfil</Link>
        <Link to="/" className={styles.link}>Sair</Link>
      </nav>
    </header>
  );
}

export default Header;
