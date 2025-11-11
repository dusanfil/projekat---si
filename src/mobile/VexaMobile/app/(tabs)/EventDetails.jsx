//app/auth/EventDetails.jsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { router } from 'expo-router';
// Ponovo koristimo iste mock podatke
const MOCK_EVENTS_DATA = [
  {
    id: "mock-1",
    title: "Digitalni Samit '25",
    opis: "Vodeći događaj o digitalnoj transformaciji i inovacijama.",
    location: "Beograd, Metropol Palace",
    date: "2025-09-10T09:00:00.000Z",
    image: "https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=DigitalniSamit",
    tags: ["edukacija", "tehnologija", "biznis"],
  },
  {
    id: "mock-2",
    title: "Veliki Humanitarni Koncert",
    opis: "Veče dobre muzike za plemenit cilj. Sva sredstva idu u dobrotvorne svrhe.",
    location: "Novi Sad, Spens",
    date: "2025-08-20T19:00:00.000Z",
    image: "https://via.placeholder.com/400x200/2196F3/FFFFFF?text=HumanitarniKoncert",
    tags: ["muzika", "koncert", "humanitarno"],
  },
  {
    id: "mock-3",
    title: "Maraton Kroz Grad",
    opis: "Godišnji maraton otvoren za sve trkače. Prijavite se na vreme!",
    location: "Niš, Glavni Trg",
    date: "2025-10-05T08:00:00.000Z",
    image: "https://via.placeholder.com/400x200/FF5722/FFFFFF?text=Maraton",
    tags: ["sport", "trcanje", "rekreacija"],
  },
  {
    id: "mock-4",
    title: "Radionica Keramike",
    opis: "Naučite osnove izrade keramike sa iskusnim majstorima.",
    location: "Kragujevac, Dom Omladine",
    date: "2025-11-15T10:00:00.000Z",
    image: "https://via.placeholder.com/400x200/9C27B0/FFFFFF?text=Keramika",
    tags: ["kultura", "edukacija", "umetnost"],
  },
  {
    id: "mock-5",
    title: "Festival Ulične Umetnosti",
    opis: "Prikaz murala, grafita i performansa umetnika iz regiona.",
    location: "Subotica, Centar",
    date: "2025-07-25T17:00:00.000Z",
    image: "https://via.placeholder.com/400x200/795548/FFFFFF?text=UlicnaUmetnost",
    tags: ["kultura", "umetnost", "festival"],
  },
];

export default function EventDetails() {
  const { id } = useLocalSearchParams();

  const event = MOCK_EVENTS_DATA.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Događaj nije pronađen.</Text>
      </View>
    );
  }

  return (
    
    <ScrollView style={styles.container}>

        <Image source={{ uri: event.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>
            📅 {new Date(event.date).toLocaleDateString("sr-RS")}
          </Text>
          <Text style={styles.location}>📍 {event.location}</Text>
          <Text style={styles.opis}>{event.opis}</Text>
          <View style={styles.tagsWrapper}>
            {event.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>
        </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020d2c" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020d2c",
  },
  image: { width: "100%", height: 200 },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  date: { fontSize: 14, color: "#ccc", marginBottom: 4 },
  location: { fontSize: 14, color: "#ccc", marginBottom: 12 },
  opis: { fontSize: 16, color: "#eee", marginBottom: 16 },
  tagsWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#e6007e",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 8,
    marginTop: 4,
  },
});
