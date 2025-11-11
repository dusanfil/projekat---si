import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm from './components/TaskForm';  // Importuj TaskForm
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      console.error("Greška pri učitavanju taskova:", error);
    }
  };

  const handleAdd = async (task) => {
    await createTask(task);
    loadTasks();
  };

  const handleUpdate = async (id, updatedTask) => {
    await updateTask(id, updatedTask);
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista Taskova</h1>
      <TaskForm onAdd={handleAdd} /> {/* Ovdje pozivaš TaskForm */}
      <TaskList tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}

export default App;
