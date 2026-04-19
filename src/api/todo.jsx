const API_URL = "http://localhost:3001/todos";

export const fetchTodos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

export const fetchTodoById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch todo");
  return response.json();
};

export const addTodo = async (title) => {
  const newTodo = { title, completed: false };
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });
  if (!response.ok) throw new Error("Failed to add");
  return response.json();
};

export const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update");
  return response.json();
};

export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete");
  return true;
};
