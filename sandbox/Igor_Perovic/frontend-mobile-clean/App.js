import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { getUsers, addUser, deleteUser } from "./api";

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async () => {
    console.log("➡ Kliknuto na DODAJ");

    if (!form.name || !form.email) {
      console.log("⛔ Ime ili email nisu uneti");
      return;
    }

    console.log("📤 Šaljem korisnika:", form);

    try {
      await addUser(form);
      console.log("✅ Uspešno dodat");
      setForm({ name: "", email: "" });
      loadUsers();
    } catch (error) {
      console.log("❌ GREŠKA PRILIKOM DODAVANJA:", error.message);
    }
};


  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Korisnici</Text>

      <TextInput
        style={styles.input}
        placeholder="Ime"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
      />

      <Button title="Dodaj korisnika" onPress={handleSubmit} />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>{item.name} ({item.email})</Text>
            <Button title="Obriši" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, marginTop: 40 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10
  },
  userItem: {
    marginVertical: 10, padding: 10, borderWidth: 1, borderColor: "#ddd"
  }
});
