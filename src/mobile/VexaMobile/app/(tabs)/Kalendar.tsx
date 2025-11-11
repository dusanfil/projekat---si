import React, { useState, useMemo, useEffect } from "react";
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, ImageBackground, StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

import { API } from "../../services/api";
import { router } from 'expo-router';
import { DanDogadjaja, Dogadjaj } from "@/types/dogadjaj";

import { Calendar } from "react-native-calendars"
import DrawerButton from "@/components/DrawerButton";
import * as SecureStore from 'expo-secure-store';



export default function Kalendar(){

    const [dogadjaji, setDogadjaji] = useState<Dogadjaj[]>([])
    const [dogdadjajiLoading, setDogadjajiLoading] = useState(true);

    const [dani, setDani] = useState<DanDogadjaja[]>([]);
    const [daniLoading, setDaniLoading] = useState(true);

    const [eventsByDate, setEventsByDate] = useState<{ [key: string]: Dogadjaj[] }>({});
    const [eventByDateLoading, setEventsByDateLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    function formatirajDatum(datumInput: string){
      
    const datumOd = new Date(datumInput);
    
    const dan = datumOd.getUTCDate().toString().padStart(2, "0");
    const mesec = naziviMeseca[datumOd.getUTCMonth()];
    const god = datumOd.getUTCFullYear();
    const sat = datumOd.getUTCHours().toString().padStart(2, "0");
    const min = datumOd.getUTCMinutes().toString().padStart(2, "0");
      
    return `${dan}. ${mesec} ${god}.`;
    }
    const naziviMeseca: string[] = [
        "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
    ]
  // Group events by date

    useEffect(() => {
      const checkAuth = async () => {
        const token = await SecureStore.getItemAsync('jwtToken');
        if (!token) {
          router.replace('/Login'); // redirect if no token
        }
      };
      checkAuth();
    }, []);

    useEffect(()=>{
      console.log('lalal');
        const ucitajDogadjaje = async()=>{
            const response = await API.get('api/dogadjaj/prikaz');
            setDogadjaji(response.data);
            console.log('lala')
            setDogadjajiLoading(false)
        }
        ucitajDogadjaje();
    },[])

    useEffect(()=>{
  if(!dogadjaji) return;   // now correct
  const ucitajDaneDogadjaja = async()=>{
    console.log('ucitavanje dana')
    const daniIds = dogadjaji.flatMap(d => d.dani);
    console.log(daniIds);

    const promises = daniIds.map(d=>
      API.get(`api/dani/${d}`).then(res=>res.data)
    )
    
    const response = await Promise.all(promises);
    setDani(response);
    setDaniLoading(false);
  }
  ucitajDaneDogadjaja();
},[dogadjaji])
    useEffect(()=>{
        if(daniLoading) return;


        const temp = dogadjaji.reduce<{ [key: string]: Dogadjaj[] }>((acc, e) => {
            const dateStr = e.datumPocetka.split('T')[0]; // YYYY-MM-DD
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(e);
            console.log(dateStr);
            console.log(e.datumPocetka);
            return acc;
            }, {});
        setEventsByDate(temp);
    },[dani])
  const renderEventItem = ({ item }: { item: Dogadjaj }) => (
  <Link
    href={{ pathname: "/(tabs)/PrikaziDogadjaj/[dogadjajId]", params: { dogadjajId: item.id } }}
    asChild
  >
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <ImageBackground
        source={{ uri: `http://softeng.pmf.kg.ac.rs:11071/${item.urLalbuma}` }}
        style={styles.cardImage}
      >
        <View style={styles.cardInfo}>
          <View style={styles.rowCenter}>
            <Ionicons name="calendar" size={16} color="#fff" />
            <Text style={styles.cardDate}>
              {formatirajDatum(item.datumPocetka)}
            </Text>
          </View>
          <View style={[styles.rowCenter, { marginTop: 4 }]}>
            <Ionicons name="location" size={16} color="#fff" />
            <Text style={styles.cardLocation}>Lokacija</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.cardTitleWrapper}>
        <Text style={styles.cardTitle}>{item.naziv}</Text>
      </View>
    </TouchableOpacity>
  </Link>
);
  if(daniLoading) {
return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#020d2c' }}>
      <Text style={{color:'white'}}>Loading...</Text>
    </View>
  )
  }
  return (
    <View style={styles.container}>
      <DrawerButton></DrawerButton>
      <Calendar style={{borderRadius:16, height:470}}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        dayComponent={({ date, state }) => {
          const dateStr:string = date?.dateString;
          const count = eventsByDate[dateStr]?.length || 0;
          const isSelected = selectedDate === dateStr;

          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(dateStr)}
              style={[
                styles.dayContainer,
                isSelected && styles.selectedDay
              ]}
            >
              <Text style={[styles.dayText, state === "disabled" && { color: "#ccc" }]}>
                {date?.day}
              </Text>
              {count > 0 && (
                <Text style={styles.countText}>{count}</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.eventsTitle}>
        Dogadjaji za: {formatirajDatum(selectedDate) || "..."}
      </Text>

      <FlatList
        data={selectedDate ? eventsByDate[selectedDate] || [] : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderEventItem}
      />
    </View>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#020d2c", padding: 16, paddingTop:55},
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
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 48,
  },
  selectedDay: {
    backgroundColor: "#87ceeb",
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
  },
  countText: {
    fontSize: 12,
    color: "red",
  },
  eventsTitle: {
    fontSize: 18,
    marginVertical: 10,
    color:'white',
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});