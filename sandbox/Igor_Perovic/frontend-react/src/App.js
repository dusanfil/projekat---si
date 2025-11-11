import React, { useEffect, useState } from "react";
import { getUsers, addUser, deleteUser, updateUser  } from "./UserService";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Greška prilikom učitavanja korisnika:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const [editingId, setEditingId] = useState(null);

/*
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    await addUser(form);
    setForm({ name: "", email: "" });
    loadUsers();
  };
*/

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email) return;

  if (editingId) {
    await updateUser(editingId, form);
    setEditingId(null);
  } else {
    await addUser(form);
  }

  setForm({ name: "", email: "" });
  loadUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user.id);
  };



  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Korisnici</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Ime"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">
          {editingId ? "Sačuvaj izmene" : "Dodaj korisnika"}
        </button>
      </form>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email})
            <button onClick={() => handleEdit(u)} style={{ marginLeft: "1rem" }}>
              Izmeni
            </button>
            <button onClick={() => handleDelete(u.id)} style={{ marginLeft: "0.5rem" }}>
              Obriši
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

