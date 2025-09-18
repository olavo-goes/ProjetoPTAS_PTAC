import React from "react";
import styles from "./AreaLogada.module.css"; // Importa o CSS Module

function AreaLogada() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Área Logada</h1>
      <p className={styles.text}>Você realizou o login com sucesso!</p>
    </div>
  );
}

export default AreaLogada;
