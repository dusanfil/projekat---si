import React, { useState, useMemo, useEffect, useActionState } from "react";
import {
  View, Text, TextInput, FlatList, Modal,
  TouchableOpacity, ImageBackground, StyleSheet, Image, Dimensions
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

import { API } from "../../services/api";
import { router } from 'expo-router';
import { DanDogadjaja, Dogadjaj } from "@/types/dogadjaj";
import { Notifikacija, TipNotifikacije } from "@/types/notifikacija";
import * as SecureStore from 'expo-secure-store'
import Loading from '@/components/Loading';
import DrawerButton from "@/components/DrawerButton";
const { width, height } = Dimensions.get('window');

function formatirajDatum(datumInput: string){
        const datumOd = new Date(datumInput);
        
        const dan = datumOd.getDate().toString().padStart(2, '0');
        const mesec = naziviMeseca[datumOd.getMonth()]
        const god = datumOd.getFullYear()

        const sat = datumOd.getHours().toString().padStart(2, '0');
        const min = datumOd.getMinutes().toString().padStart(2, '0');
        
        return `${dan}. ${mesec} ${god}. ${sat}:${min}`;
    }
    
    const naziviMeseca: string[] = [
        "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
    ]



const notifications: Notifikacija[] = [
  {
    id: '1',
    naziv: 'Dobrodošli!',
    sadrzaj: 'Vaša registracija je uspešna.',
    tip: TipNotifikacije['Informacija'],
    datumSlanja: new Date(),
    dogadjajId: '',
    korisniciIds: ['1', '2']
  },
  {
    id: '2',
    naziv: 'Upozorenje',
    sadrzaj: 'Vaš događaj počinje za 30 minuta.',
    tip: TipNotifikacije['Upozorenje'],
    datumSlanja: new Date(),
    dogadjajId: 'd1',
    korisniciIds: ['1']
  },
];

export default function Notifikacije(){

    const [token, setToken] = useState<string>();
    const [userId, setUserId] = useState<string>();
    const [userIdLoading, setUserIdLoading] = useState(true);

    const [notifikacije, setNotifikacije] = useState<Notifikacija[]>([]);
    const [notifikacijeLoading, setNotifikacijeLoading] = useState(true)
    
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotifikacija, setSelectedNotifikacija] = useState<Notifikacija | null>(null);
    const NotificationCard = ({ notification }: { notification: Notifikacija }) => (
    <TouchableOpacity 
        style={styles.card}
        onPress={()=>{
            setSelectedNotifikacija(notification);
            setModalVisible(true);
        }}
    >
        <Text style={styles.title}>{notification.naziv}</Text>
        <Text style={styles.content}>{TipNotifikacije[notification.tip]}</Text>
        <Text style={styles.date}>{formatirajDatum(notification.datumSlanja.toString())}</Text>
    </TouchableOpacity>
    );
    useEffect(()=>{
        const ucitajToken = async()=>{
            const tokenTemp = await SecureStore.getItemAsync('jwtToken');
            const idTemp = await SecureStore.getItemAsync('korisnikId');
            if(idTemp) {
                setUserId(idTemp);
                setUserIdLoading(false);
            }
            if(tokenTemp != null) setToken(tokenTemp);
        }
        ucitajToken();
    },[])

    useEffect(()=>{
        if(userIdLoading) return;
        const ucitajNotifikacije = async()=>{
            const response = await API.get(`api/notifikacija/korisnik/${userId}`);
            setNotifikacije(response.data);
            setNotifikacijeLoading(false);
        }
        ucitajNotifikacije();
    },[userId])

    return (
    notifikacijeLoading?
    (
        <View style={styles.loadingWrapper}>
        <View style={styles.loadingScreen}>
            <Image style={{marginTop:175}} source={require('../../assets/images/vexaLogoLogin.png')}></Image>
        </View>
        <Loading text='notifikacija'></Loading>
        </View>
    ):
    (
        <View style={styles.container}>
        <DrawerButton></DrawerButton>
            <FlatList
                data={notifikacije}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationCard notification={item} />}
                contentContainerStyle={{ padding: 16 }}
            />
            <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedNotifikacija?.naziv}</Text>
            <Text style={styles.modalType}>{TipNotifikacije[selectedNotifikacija?.tip || 0]}</Text>
            <Text style={styles.modalDate}>{selectedNotifikacija && formatirajDatum(selectedNotifikacija.datumSlanja.toString())}</Text>
            <Text style={styles.modalContent}>{selectedNotifikacija?.sadrzaj}</Text>
            <TouchableOpacity
                style={[styles.modalCloseBtn, { backgroundColor: "#F51E63", marginBottom: 8 }]}
                onPress={() => {
                    if (selectedNotifikacija?.dogadjajId) {
                    router.push(`/PrikaziDogadjaj/${selectedNotifikacija.dogadjajId}`);
                    setModalVisible(false);
                    }
                }}
                >
                <Text style={styles.modalCloseText}>Idi na događaj</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Zatvori</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        </View>
)       
    )
}

const styles = StyleSheet.create({
    loadingWrapper:{
    backgroundColor:'#000A25',
    height: height,
    width: width,
    //justifyContent:'center',
  },
  loadingText:{
    fontSize: 30,
    color:'#fff',
  },
  loadingScreen:{
    justifyContent:'center',
    alignItems:'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#020d2c',
    paddingTop:60,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // for Android shadow
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center"
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalType: { fontSize: 14, color: "#555", marginBottom: 4 },
  modalDate: { fontSize: 12, color: "#888", marginBottom: 12 },
  modalContent: { fontSize: 16, color: "#333", textAlign: "center", marginBottom: 16 },
  modalCloseBtn: {
    backgroundColor: "#020d2c",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8, 
    width:170,
    alignItems:'center',
  },
  modalCloseText: { color: "#fff", fontSize: 14, fontWeight: "bold" }
});