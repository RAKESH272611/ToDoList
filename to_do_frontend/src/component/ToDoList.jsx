import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Assets/css/ToDoList.css';

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  // Fetch todos from backend on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.log('Error fetching todos:', error);
    }
  };

  // Add a new todo
  const addTodo = async (e) => {
      e.preventDefault();
      if (newTodo.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:5000/api/todos', { text: newTodo });
        setTodos([...todos, response.data]);
        setNewTodo('');
      } catch (error) {
        console.log('Error adding todo:', error);
      }
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.log('Error deleting todo:', error);
    }
  };

  const editTodo = (todo) => {
    setEditingTodo(todo._id);
  };

  const updateTodo = async (id, updatedText) => {
    try {
      await axios.patch(`http://localhost:5000/api/todos/${id}`, { text: updatedText });
      const updatedTodos = todos.map((todo) =>
        todo._id === id ? { ...todo, text: updatedText } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.log('Error updating todo:', error);
    }
  };


  
  

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <form onSubmit={addTodo}>
        <div className="input-container">
          <input
            type="text"
            className="todo-input"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button className="add-button" type="submit">
            Add Todo
          </button>
        </div>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            {editingTodo === todo._id ? (
              <input className='todo-item-text'
                type="text"
                value={todo.text}
                onChange={(e) => updateTodo(todo._id, e.target.value)}
              />
            ) : (
              <span className='todo-item-text'>{todo.text}</span>
            )}
            {editingTodo===todo._id ? <button
              className='edit-button'
              onClick={()=>setEditingTodo(null)}>Done</button>:
              <button
              className='edit-button'
             onClick={() => editTodo(todo)}>Edit</button> }
            <button
              className="delete-button"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
