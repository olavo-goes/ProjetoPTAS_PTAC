import React from "react";
import { Link } from "react-router-dom"; 
import styles from "./AreaLogada.module.css";
import Header from "../Components/Header";

function AreaLogada() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Área Logada</h1>
        <p className={styles.text}>Você realizou o login com sucesso!</p>
      </div>
    </>
  );
}

export default AreaLogada;