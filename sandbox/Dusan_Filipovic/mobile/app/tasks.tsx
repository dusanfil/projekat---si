import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

// Tipiziranje Task objekta
interface Task {
  id: string;
  name: string;
  description: string;
}

// API URL
const API_URL = 'http://192.168.0.133:5076/api/task';

// Tip za navigaciju
type RootStackParamList = {
  Home: undefined;
  Tasks: undefined;
};

// Početni ekran sa navigacijom
function HomeScreen({ navigation }: { navigation: StackNavigationProp<RootStackParamList, 'Home'> }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Task Manager</Text>
      <Button
        title="Go to Tasks"
        onPress={() => navigation.navigate('Tasks')} // Navigacija na ekran sa zadacima
      />
    </View>
  );
}

// Ekran sa zadacima
function Tasks() {
  // Tipiziranje useState
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editId, setEditId] = useState<string | null>(null);

  // Funkcija za preuzimanje zadataka sa API-a
  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Funkcija za dodavanje i ažuriranje zadataka
  const handleSave = async () => {
    if (!name || !description) return;
    try {
      if (editId) {
        // Ažuriranje postojećeg zadatka
        await axios.put(`${API_URL}/${editId}`, { name, description });
        setEditId(null); // Resetovanje editId nakon ažuriranja
      } else {
        // Dodavanje novog zadatka
        await axios.post(API_URL, { name, description });
      }
      setName(""); // Resetovanje input polja
      setDescription("");
      fetchTasks(); // Ponovno učitavanje zadataka
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // Funkcija za brisanje zadatka
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks(); // Ponovno učitavanje zadataka nakon brisanja
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // Funkcija za unos podataka u input polja (Edit)
  const handleEdit = (task: Task) => {
    setName(task.name);
    setDescription(task.description);
    setEditId(task.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task CRUD</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title={editId ? "Update" : "Add Task"} onPress={handleSave} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.name}</Text>
            <Text>{item.description}</Text>
            <View style={styles.buttonRow}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
}

// Kreiranje Stack Navigator-a
const Stack = createStackNavigator();

// Glavni App komponent
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tasks" component={Tasks} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, marginTop: 50 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  taskText: { fontSize: 18, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
