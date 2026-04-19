import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchTodos, addTodo } from "../api/todo";
import TodoForm from "../components/TodoForm";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import styles from "./HomePage.module.css";

function HomePage() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    let result = [...todos];
    if (searchQuery.trim()) {
      result = result.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (sortAlphabetically) {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    setFilteredTodos(result);
  }, [todos, searchQuery, sortAlphabetically]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError("Не удалось загрузить задачи");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (title) => {
    try {
      const newTodo = await addTodo(title);
      setTodos([...todos, newTodo]);
      return true;
    } catch {
      setError("Не удалось добавить задачу");
      return false;
    }
  };

  const handleTaskClick = (id) => {
    navigate(`/task/${id}`);
  };

  const completedCount = filteredTodos.filter((t) => t.completed).length;

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>📝 Мои задачи</h1>
        <p className={styles.subtitle}>Главная страница</p>
      </header>

      <div className={styles.controls}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button
          className={`${styles.sortButton} ${sortAlphabetically ? styles.active : ""}`}
          onClick={() => setSortAlphabetically(!sortAlphabetically)}
        >
          {sortAlphabetically
            ? "📖 Отменить сортировку"
            : "🔤 Сортировать по алфавиту"}
        </button>
      </div>

      <TodoForm onAdd={handleAdd} />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={loadTodos} />}

      {!loading && !error && (
        <>
          <div className={styles.stats}>
            <span>📊 Всего: {filteredTodos.length}</span>
            <span>✅ Выполнено: {completedCount}</span>
            <span>⏳ Осталось: {filteredTodos.length - completedCount}</span>
          </div>
          <div className={styles.todoList}>
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`${styles.todoCard} ${todo.completed ? styles.completed : ""}`}
                onClick={() => handleTaskClick(todo.id)}
              >
                <div className={styles.todoTitle}>
                  {todo.title.length > 60
                    ? todo.title.slice(0, 57) + "..."
                    : todo.title}
                </div>
                <div className={styles.todoStatus}>
                  {todo.completed ? "✓ Выполнено" : "○ В процессе"}
                </div>
              </div>
            ))}
            {filteredTodos.length === 0 && (
              <div className={styles.empty}>Нет задач. Добавьте первую!</div>
            )}
          </div>
        </>
      )}

      <footer className={styles.footer}>
        <p>JSON Server API | Всего задач: {todos.length}</p>
      </footer>
    </div>
  );
}

export default HomePage;
