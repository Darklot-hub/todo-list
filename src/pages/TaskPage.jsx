import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchTodoById, updateTodo, deleteTodo } from "../api/todo";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import styles from "./TaskPage.module.css";

function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const loadTodo = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTodoById(id);
      setTodo(data);
      setEditTitle(data.title);
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setError("Задача не найдена");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTodo();
  }, [loadTodo]);

  const handleToggleComplete = async () => {
    try {
      const updated = await updateTodo(id, { completed: !todo.completed });
      setTodo(updated);
    } catch (err) {
      console.error(err);
      setError("Не удалось обновить статус");
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      const updated = await updateTodo(id, { title: editTitle });
      setTodo(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Не удалось обновить задачу");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Удалить задачу?")) {
      try {
        await deleteTodo(id);
        navigate("/");
      } catch (err) {
        console.error(err);
        setError("Не удалось удалить задачу");
      }
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadTodo} />;
  if (!todo)
    return (
      <ErrorMessage message="Задача не найдена" onRetry={() => navigate("/")} />
    );

  return (
    <div className={styles.taskPage}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={goBack}>
          ← Назад
        </button>
        <h1>Задача #{todo.id}</h1>
      </div>

      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.editArea}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className={styles.editInput}
              autoFocus
            />
            <div className={styles.editActions}>
              <button onClick={handleSaveEdit} className={styles.saveButton}>
                Сохранить
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className={styles.fullTitle}>{todo.title}</p>
            <div className={styles.status}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={handleToggleComplete}
                />
                {todo.completed ? "Выполнено" : "Не выполнено"}
              </label>
            </div>
            <div className={styles.actions}>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                ✏️ Редактировать
              </button>
              <button onClick={handleDelete} className={styles.deleteButton}>
                🗑️ Удалить
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskPage;
