import React from "react";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import NotFound from "./pages/NotFound";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/task/:id" element={<TaskPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
