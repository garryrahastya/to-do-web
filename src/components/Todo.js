import React, { useState, useEffect } from "react";
import axios from "axios";
import { TODOS } from "../constants";

import "./todo.css";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(TODOS.GET_ALL);
        setTodos(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  async function handleAddTodo() {
    const newTodoRegex = /^[a-zA-Z\s]*$/; 
    if (!newTodo) {
      alert("Input harus diisi!");
    } else if (!newTodoRegex.test(newTodo)) {
      alert("Input hanya boleh berupa huruf!");
    } else {
      try {
        const response = await axios.post(TODOS.POST, {
          content: newTodo,
          isFinished: false,
          priority: 3,
        });
        setTodos([...todos, response.data]);
        setNewTodo("");
      } catch (error) {
        console.error(error);
      }
    }
  }
  async function handleDelete(id) {
    try {
      await axios.delete(TODOS.DELETE(id));
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleToggleFinished(id) {
    try {
      const todo = todos.find((todo) => todo.id === id);
      const response = await axios.put(TODOS.PUT(id), {
        ...todo,
        isFinished: !todo.isFinished,
      });
      const updatedTodos = todos.map((todo) =>
        todo.id === response.data.id ? response.data : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  }

  function handleFilterChange(filter) {
    setFilter(filter);
  }

  function filteredTodos() {
    switch (filter) {
      case "finished":
        return todos.filter((todo) => todo.isFinished);
      case "unfinished":
        return todos.filter((todo) => !todo.isFinished);
      default:
        return todos;
    }
  }

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <div>
        <label>
          Filter:
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="finished">Finished</option>
            <option value="unfinished">Unfinished</option>
          </select>
        </label>
      </div>
      <ul>
        {filteredTodos().map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.isFinished}
              onChange={() => handleToggleFinished(todo.id)}
            />
            {todo.content}
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
