import React, { useState } from 'react';

const TaskForm = ({ onAdd }) => {
  const [task, setTask] = useState({
    name: '',          // Polje za ime taska
    description: '',   // Polje za opis taska
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name && task.description) {
      onAdd(task);  // Poziva onAdd funkciju iz App.js sa oba polja
      setTask({ name: '', description: '' }); // Resetuje polja nakon slanja
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Ime taska"
        value={task.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Opis taska"
        value={task.description}
        onChange={handleChange}
        required
      />
      <button type="submit">Dodaj</button>
    </form>
  );
};

export default TaskForm;
