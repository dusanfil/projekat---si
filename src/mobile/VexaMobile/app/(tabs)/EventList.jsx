// app/auth/EventList.jsx

import React, { useState, useMemo, useEffect } from "react";
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, ImageBackground, StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import DrawerButton from "@/components/DrawerButton";
import { API } from "../../services/api";
import { router } from 'expo-router';
// Mapa lokalnih slika
const localImages = {
  "digital.jpg": require("../../assets/images/digital.jpg"),
  "music.jpg": require("../../assets/images/music.jpg"),
  "run.jpg": require("../../assets/images/run.jpg"),
  "ceramic.jpg": require("../../assets/images/ceramic.jpg"),
  "street.jpg": require("../../assets/images/street.jpg"),
};

const TAGS = ["sve", "Konferencija", "Utakmica", "Protest", "Festival", "Zurka", "Vasar"];

export default function EventList() {
  const [query, setQuery] = useState("");
  const [selectedTag, setTag] = useState("sve");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('api/dogadjaj/prikaz')
        const data = response.data;
        console.log(data);
        setEvents(data);
      } catch (error) {
        console.error("Greška pri učitavanju mock događaja:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => Array.isArray(events) ? events.filter(ev => {
    const q = ev.naziv.toLowerCase().includes(query.toLowerCase());
    const t = selectedTag === "sve" || ev.kategorija?.includes(selectedTag);
    return q && t;
  }) : [], [events, query, selectedTag]);

  const renderTag = (tag) => (
    <TouchableOpacity
      key={tag}
      style={[styles.tagChip, selectedTag === tag && styles.tagChipActive]}
      onPress={() => setTag(tag)}
    >
      <Text style={[styles.tagText, selectedTag === tag && styles.tagTextActive]}>
        {tag[0].toUpperCase() + tag.slice(1)}
      </Text>
    </TouchableOpacity>

  );
  const renderItem = ({ item }) => ( //params: { dogadjajId: '686f8cf2e217ff839bef642d' }
    <Link href={{ pathname: "/(tabs)/PrikaziDogadjaj/[dogadjajId]", params: { dogadjajId: item.id }}} asChild>
      <TouchableOpacity activeOpacity={0.8} style={styles.card}>
        <ImageBackground
          source={{uri:`http://softeng.pmf.kg.ac.rs:11071${item.urLalbuma}`}} 
          style={styles.cardImage}
        >
          <View style={styles.cardInfo}>
            <View style={styles.rowCenter}>
              <Ionicons name="calendar" size={16} color="#fff" />
              <Text style={styles.cardDate}>{new Date(item.datumPocetka).toLocaleDateString("sr-RS")}</Text>
            </View>
            <View style={[styles.rowCenter, { marginTop: 4 }]}>
              <Ionicons name="location" size={16} color="#fff" />
              <Text style={styles.cardLocation}>{'Lokacija'}</Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.cardTitleWrapper}>
          <Text style={styles.cardTitle}>{item.naziv}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#fff" }}>Učitavanje događaja...</Text>
      </View>
    );
  }

  if (!loading && events.length == 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#fff" }}>Nema pronađenih događaja.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DrawerButton></DrawerButton>
      <FlatList
        data={filteredEvents}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={
          <>
            <View style={styles.searchWrapper}>
              <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Pretraga…"
                placeholderTextColor="#888"
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
              />
              <MaterialIcons name="filter-list" size={24} color="#888" />
            </View>
            <FlatList
              data={TAGS}
              horizontal
              keyExtractor={(t) => t}
              renderItem={({ item }) => renderTag(item)}
              contentContainerStyle={{ paddingVertical: 12, paddingLeft: 16, paddingRight: 16 }}
              style={{ marginBottom: 16 }}
              showsHorizontalScrollIndicator={false}
            />
          </>
        }
        ListFooterComponent={
          <Text style={{ color: "#fff", marginTop: 20, textAlign: "center" }}>
            Broj prikazanih događaja: {filteredEvents.length}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020d2c", padding: 16, paddingTop: 24 },
  searchWrapper: {
    
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 24,
    marginTop:30,
  },
  tagChip: {
    backgroundColor: "#111",
    borderColor: "#fff4",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tagText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  searchInput: { flex: 1, height: 40, color: "#000" },
  tagChipActive: { backgroundColor: "#e6007e", borderColor: "#e6007e" },
  tagTextActive: { color: "#fff", fontWeight: "700" },
  card: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  cardImage: {
  width: "100%",
  height: 180,
  justifyContent: "flex-end",
},
  cardInfo: { padding: 12 },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  cardDate: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  cardLocation: { color: "#fff", marginLeft: 6, fontSize: 12 },
  cardTitleWrapper: {
    backgroundColor: "#e6007e",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
