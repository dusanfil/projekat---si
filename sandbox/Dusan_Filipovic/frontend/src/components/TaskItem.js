
import { useState } from 'react';

function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(task.name);

  const handleUpdate = () => {
    onUpdate(task.id, { ...task, name: newName });
    setEditing(false);
  };

  return (
    <li>
      {editing ? (
        <>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
          <button onClick={handleUpdate}>Sačuvaj</button>
          <button onClick={() => setEditing(false)}>Otkaži</button>
        </>
      ) : (
        <>
          {task.name}
          <button onClick={() => setEditing(true)}>Izmeni</button>
          <button onClick={() => onDelete(task.id)}>Obriši</button>
        </>
      )}
    </li>
  );
}

export default TaskItem;
