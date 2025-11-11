import React from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type FaqItem = { q: string; a: string };

const DATA: FaqItem[] = [
  {
    q: "Kako uneti kredite?",
    a: "Unesite broj kartice koji se nalazi na poleđini kredit kartice koju ste dobili na događaju.",
  },
  {
    q: "Kako se prijaviti na događaj?",
    a: "Klikom na dugme „Kupi“ otvara vam se prozor u kojem unosite količinu željenih karata.",
  },
  {
    q: "Kako da dobijem QR kod u aplikaciji?",
    a: "QR kod se kreira klikom na jednu od dostupnih karata.",
  },
];

export default function FAQ() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      {/* Naslov */}
      <Text style={styles.title}>Često postavljana pitanja</Text>

      {/* „Karton“ sa okvirom */}
      <View style={styles.card}>
        <FlatList
          data={DATA}
          keyExtractor={(item, idx) => `${idx}`}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.question}>{item.q}</Text>
              <Text style={styles.answer}>{item.a}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Back dugme */}
      <Pressable style={styles.backBtn} onPress={() => router.back()} android_ripple={{ borderless: true }}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const COLORS = {
  bg: "#0B1230",
  border: "#B52956",
  text: "#E8ECF1",
  subtext: "rgba(232,236,241,0.75)",
  separator: "rgba(255,255,255,0.18)",
  pink: "#B52956",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    minHeight: 520,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 12,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  question: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  answer: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.subtext,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.separator,
    marginVertical: 8,
  },
  backBtn: {
    position: "absolute",
    left: 22,
    top: 22,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.pink,
    elevation: 3,
  },
});
