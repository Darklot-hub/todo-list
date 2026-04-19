import React from "react";
import { Link } from "react-router";
import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <h1>404</h1>
        <p>Страница не найдена</p>
        <p className={styles.path}>Адрес: /404</p>
        <Link to="/" className={styles.homeLink}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
