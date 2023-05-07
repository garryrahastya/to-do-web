export const API_URL = "http://localhost:3000";
export const TODOS = {
  GET_ALL: `${API_URL}/todos`,
  POST: `${API_URL}/todos`,
  PUT: (id) => `${API_URL}/todos/${id}`,
  DELETE: (id) => `http://localhost:3000/todos/${id}`
};
