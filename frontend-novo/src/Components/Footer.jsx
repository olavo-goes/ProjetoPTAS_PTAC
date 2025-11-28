import React from "react";
import styles from "./Footer.module.css";

function Footer({ text }) {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>{text}</p>
    </footer>
  );
}

export default Footer;
