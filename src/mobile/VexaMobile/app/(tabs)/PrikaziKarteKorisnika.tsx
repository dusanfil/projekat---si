import React, { useEffect, useState, useMemo} from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Dimensions, StyleSheet, Image, ListRenderItem, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { router } from 'expo-router';
import { DanDogadjaja, Dogadjaj, Karta, Korisnik, KupljenaKarta } from '@/types/dogadjaj';
import * as SecureStore from 'expo-secure-store';
import { API } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Loading from '@/components/Loading';
import { useIsFocused } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import { useLocalSearchParams } from 'expo-router';
import { SvgUri, SvgXml } from 'react-native-svg';
import LoadingBox from '@/components/LoadingBox';
import DrawerButton from "@/components/DrawerButton";
type Ticket = {
    id: string;
    nazivDogadjaja: string;
    datumPocetka: string;
    qr: string;
    idDogadjaja: string;
};
const dummyTickets: Ticket[] = [
  { id: '1', nazivDogadjaja: 'Koncert', datumPocetka: '2025-08-12T00:00:00.000Z', qr: 'ticket-1-xyz', idDogadjaja:''},
  { id: '2', nazivDogadjaja: 'Konferencija', datumPocetka: '2025-08-15T00:00:00.000Z', qr: 'ticket-2-abc', idDogadjaja:''},
  { id: '3', nazivDogadjaja: 'Nesto', datumPocetka: '2025-08-20T00:00:00.000Z', qr: 'ticket-3-qwe', idDogadjaja:''},
  { id: '4', nazivDogadjaja: 'Jos Nesto', datumPocetka: '2025-03-20T00:00:00.000Z', qr: 'ticket-3-qwe', idDogadjaja:''}
]

export default function UserTicketsScreen() {

    const params= useLocalSearchParams();
    const isFocused = useIsFocused();
    const [refreshVersion, setRefreshVersion] = useState(0);
    const [kupljeneKarte, setKupljeneKarte] = useState<KupljenaKarta[]>([]);
    const [kupljeneKarteLoading, setKupljeneKarteLoading] = useState(true);
    
    const [qrCode, setQrCode] = useState(null);
    const [qrCodeLoading, setQrCodeLoading] = useState(true);

    const [karte, setKarte] = useState<Karta[]>([]);
    const [karteLoading, setKarteLoading] = useState(true);

    const [token, setToken] = useState("");
    const [korisnikId, setKorisnikId] = useState("");

    const [dogadjaji, setDogadjaji] = useState<Dogadjaj[]>([]);
    const [dogadjajiLoading, setDogadjajiLoading] = useState(true);

    const [dani, setDani] = useState<DanDogadjaja[]>([]);
    const [daniLoading, setDaniLoading] = useState(true);

    const [korisnik, setKorisnik] = useState<Korisnik | null>(null)
    const [selectedTicket, setSelectedTicket] = useState<KupljenaKarta | null>(null);
    const [showPast, setShowPast] = useState<boolean>(false);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ucitajQrCode = async(item: KupljenaKarta) =>{
        console.log('qrrr');
        const response = API.get(`api/qr-kod-generator/generisi/${item.id}`);
        const qr = (await response).data;
        setQrCode(qr);

        console.log(qr);
        setQrCodeLoading(false);
    }

    const filteredTickets = useMemo(()=>{
        if (!karte.length || !dani.length || karteLoading || kupljeneKarteLoading) return [];

        return kupljeneKarte.filter(ticket => {
        const karta : Karta[] = karte.filter(k => k.id == ticket.kartaId)
        if(!karta) return false;
        const dan = dani.find(d => d.id === karta[0].danId);
        if (!dan) return false;

        const datum = new Date(dan.datumOdrzavanja);
        datum.setHours(0, 0, 0, 0);
        console.log(ticket);
        return showPast ? datum < today : datum >= today;
        });
    },[karte, dani, showPast])
    const renderTicket: ListRenderItem<KupljenaKarta> = ({ item }) => (
        
        <TouchableOpacity   style={[styles.ticket,
                                    showPast?{borderColor:'red'}:{borderColor:'green'}]} 
                            onPress={() => {
                                setSelectedTicket(item)
                                ucitajQrCode(item);
                                }}>
        <Text style={[
            styles.eventName,
            


        ]}>{dogadjaji.filter(d => {
            const k = karte.filter(k => k.id == item.kartaId)
            return d.id == k[0].dogadjajId;
            
            })[0].naziv}</Text>
        <Text style={[
            styles.date,
            showPast?{color:'red'}:{color:'green'}

        ]}>{formatirajDatum(dani.filter(d=>{
            const k = karte.filter(k => k.id == item.kartaId);
            return d.id == k[0].danId})[0].datumOdrzavanja)}</Text>
        </TouchableOpacity>
    );
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

    useEffect(()=>{
        if(!params.refresh) return;
        setDaniLoading(true);
        setDogadjajiLoading(true);
        setKarteLoading(true);
        setKupljeneKarteLoading(true);
        console.log('refresh');
        console.log(params.refresh);
        const ucitajToken = async () => {
            const tokenTemp = await SecureStore.getItemAsync('jwtToken');
            const idTemp = await SecureStore.getItemAsync('korisnikId');
            if (idTemp) setKorisnikId(idTemp);
            if (tokenTemp) setToken(tokenTemp);
            setRefreshVersion(v=>v+1);
        };
            ucitajToken();
    },[params.refresh])
    // useFocusEffect(
    //     useCallback(() => {
    //         const ucitajToken = async () => {
    //         const tokenTemp = await SecureStore.getItemAsync('jwtToken');
    //         const idTemp = await SecureStore.getItemAsync('korisnikId');
    //         if (idTemp) setKorisnikId(idTemp);
    //         if (tokenTemp) setToken(tokenTemp);
    //         };
    //         ucitajToken();
    //     }, [])
    // );
    useEffect(()=>{ 
        if(korisnikId == "") return;
        const ucitajKorisnika = async() =>{
            const response = await API.get(`api/korisnici/${korisnikId}`);
            setKorisnik(response.data);

        }
        ucitajKorisnika();
    },[token,korisnikId,refreshVersion])
    useEffect(()=>{
        if(token == "" || korisnikId == "") return;
        const ucitajKupljeneKarte = async ()=>{
            const karteIds = korisnik?.karte;
            const promises = karteIds?.map(k=>
                API.get(`api/Karta/kupljene/${k}`).then(res=>res.data)
            )
            if(!promises) return;
            const response = await Promise.all(promises);
            setKupljeneKarte(response);
            setKupljeneKarteLoading(false)
            
        }
        ucitajKupljeneKarte();
    },[korisnik,refreshVersion])
    useEffect(()=>{
        if(kupljeneKarteLoading) return;
        const ucitajKarte = async()=>{
            const karteIds = kupljeneKarte.map(k => k.kartaId);
            
            const kartePromises = karteIds.map(k=>{
                if(k) return API.get(`api/Karta/${k}`).then(res=>res.data)
                })

            if(!kartePromises) return;
            const response = await Promise.all(kartePromises);
            const karte1 = response.filter(item => item !== undefined)
            setKarte(karte1);
            setKarteLoading(false);
            console.log('karte ucitane')

        }
        ucitajKarte();
    },[kupljeneKarte])
    useEffect(()=>{
        if(karteLoading) return;
        const ucitajDogadjaje = async()=>{
            const dogadjajIds = karte.map(k => k.dogadjajId);
            const temp = dogadjajIds.filter(d => d!==undefined)
            const promises = temp.map(d=>
                API.get(`api/dogadjaj/${d}`,{
                    headers: {
                    Authorization: `Bearer ${token}`,
                 },
                }).then(res => res.data)
            )
            const response = await Promise.all(promises);

            const dogadjaji1 = response.filter(d => d!==undefined);
            setDogadjaji(dogadjaji1);
            setDogadjajiLoading(false);
        }
        const ucitajDaneDogadjaja = async() =>{
            const daniIds = karte.map(k => k.danId).filter(d => d!==undefined);
            const promises = daniIds.map(d=>
                API.get(`api/dani/${d}`).then(res => res.data)
            )
            const response = await Promise.all(promises);
            const dani1 = response.filter(d=>d!==undefined);
            console.log(response)
            setDani(dani1);
            setDaniLoading(false)
            console.log("Ucitani da1nai")
        }
        ucitajDaneDogadjaja();
        ucitajDogadjaje();
    },[karte])

    return (
        !karteLoading && !daniLoading && !dogadjajiLoading && !kupljeneKarteLoading &&filteredTickets&&kupljeneKarte&&karte?
        (<View style={styles.container}>
            <DrawerButton></DrawerButton>
            <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => setShowPast(prev => !prev)}
            >
                <Text style={styles.toggleBtnText}>
                    {showPast ? 'Prikazi vazece karte' : 'Prikazi istekle karte'}
                </Text>
            </TouchableOpacity>
        <FlatList
            data={filteredTickets}
            keyExtractor={(item) => item.id}
            renderItem={renderTicket}
            contentContainerStyle={styles.list}
        />

        <Modal
            visible={selectedTicket !== null}
            transparent
            animationType="slide"
            onRequestClose={() => {setSelectedTicket(null)}}
        >
            <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => {setSelectedTicket(null);
                    setQrCode(null);
                    setQrCodeLoading(true);

                }} style={styles.closeBtn}>
                <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
                {selectedTicket&&<Text style={styles.modalTitle}>QR Kod za {dogadjaji.filter(d => {
                    const k = karte.filter(k => k.id == selectedTicket?.kartaId)
                    return d.id == k[0].dogadjajId;
                    })[0].naziv}</Text>}
                
                <View style={styles.qrArea}>
                    {qrCodeLoading?(<ActivityIndicator style={styles.qrLoading} size="large"></ActivityIndicator>):(<SvgXml xml={qrCode} width="250" height="250" />)}
                </View>
                
                
                
                

                {selectedTicket&&<TouchableOpacity onPress={() => {
                    const dogadjajId = dogadjaji.find(d => {
                        const karta = karte.find(k => k.id == selectedTicket.kartaId);
                        return d.id == karta?.dogadjajId;
                    })?.id;

                    if (dogadjajId) {
                        setSelectedTicket(null);
                        setQrCode(null);
                        setQrCodeLoading(true);
                        router.push({
                        pathname: '/(tabs)/PrikaziDogadjaj/[dogadjajId]',
                        params: { dogadjajId }
                        });
                    }
                    }}
                 style={styles.btnShowEvent}>
                    <Text style={{color:'white', fontWeight:'bold'}}>Prikazi dogadjaj</Text>
                </TouchableOpacity>}
            </View>
            </View>
        </Modal>
        </View>):
        (
            <View style={styles.loadingWrapper}>
      <View style={styles.loadingScreen}>
        <Image style={{marginTop:175}} source={require('../../assets/images/vexaLogoLogin.png')}></Image>
      </View>
      <Loading text='dogadjaja'></Loading>
    </View>
    
        )
        
    );
}

const styles = StyleSheet.create({
    qrLoading:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)', // optional white blur
        zIndex: 10,
},
    qrArea: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    btnShowEvent:{
        backgroundColor:'#F51E63',
        padding:5,
        marginTop:10,
        borderRadius:8,
    },
    toggleBtn: {
    backgroundColor: '#F51E63',
    padding: 12,
    margin: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#000A25',
    paddingTop:40,
},
  list: { padding: 20 },
  ticket: {
    borderWidth:3,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  eventName: { fontSize: 18, fontWeight: 'bold',color:'#e6007e' },
  date: { fontSize: 14, color: '#666' },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  closeBtn: {  },
  closeText: { color: 'blue' },
});