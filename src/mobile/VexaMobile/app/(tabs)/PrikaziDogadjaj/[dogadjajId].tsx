import { useFocusEffect, useRouter } from 'expo-router';
import { View, Text, Button,ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,Image, 
  Platform,
  Modal,
  ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import { useLocalSearchParams } from 'expo-router';
import { Dogadjaj, DanDogadjaja, TipKarte, Karta, Tacka, TipTackeEnum, Podrucje, Aktivnost, Lokacija } from '@/types/dogadjaj';
import  { useState, useEffect, useRef, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store'
import React from 'react'
import { API } from '@/services/api';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import Loading from '@/components/Loading';
import ViewHTML from '@/components/ViewHTML'
import { Polygon } from 'react-native-maps';
import DrawerButton from "@/components/DrawerButton";
import { useNormalizedUrl } from 'react-native-render-html';

import {WebView} from "react-native-webview"
import MapWebView from '../../../components/MapWebView'
const { width, height } = Dimensions.get('window');
import {Tabs} from 'expo-router'
import { useNavigation } from '@react-navigation/native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { BackHandler } from 'react-native';

const router = useRouter();

export default function PrikaziDogadjaj() {
  const navigation = useNavigation();
  useEffect(()=>{
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      // restore tab bar when leaving
      navigation.getParent()?.setOptions({ tabBarStyle: undefined });
    };
  })
  useEffect(() => {
        const checkAuth = async () => {
          const token = await SecureStore.getItemAsync('jwtToken');
          if (!token) {
            router.replace('/Login'); // redirect if no token
          }
        };
        checkAuth();
      }, []);

  const [refreshKey, setRefreshKey] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const {dogadjajId} = useLocalSearchParams();
  const [dogadjaj, setDogadjaj] = useState<Dogadjaj | null>(null)
  const [odabranDanIndex, setOdabranDanIndex] = useState(0); //Prvi dan po defaultu
  const [dani, setDani] = useState<DanDogadjaja[] | null>(null)
  const [omiljeniDogadjaji, setOmiljeniDogadjaji] = useState<string[]>([]);
  const [jeOmiljeni, setJeOmiljeni] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState<number>(-1);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [datumPocetka, setDatumPocetka] = useState<string | null>(null)
  const [datumZavrsetka, setDatumZavrsetka] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [aktivnosti, setAktivnosti] = useState<Aktivnost[]>([]);
  const [lokacije, setLokacije] = useState<Lokacija[]>([]);
  const [selectedLokacije, setSelectedLokacije] = useState<Lokacija[]>([]);
  const [karte, setKarte] = useState<Karta[]>([]);
  const [korisnikId, setKorisnikId] = useState<string | null>(null);
  const [kupljenaKarta, setKupljenaKarta] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [podrucja, setPodrucja] = useState<Podrucje[]>([]);
  const [podrucjeLoading, setPodrucjeLoadin] = useState(true);
  const [mainLokacijePodrucja, setMainLokacijePodrucja] = useState<Lokacija[]>([])
  const [mainLokacijePodrucjaLoading, setMainLokacijePodrucjaLoading] = useState(true)
  const [showKupiKartuModal, setShowKupiKartuModal] = useState(false);
  const [kupiKartuId, setKupiKartuId] = useState('');
  const [kupiKolicinu, setKupiKolicinu] = useState(1);
      useFocusEffect(() => {
    const onBackPress = () => {
      router.push("/(tabs)/EventList"); // or router.replace(...)
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    // cleanup
    return () => subscription.remove();
  });
  useFocusEffect(
    useCallback(() => {
      setDani(null);
      setDogadjaj(null);
      setAktivnosti([]);
      setPodrucja([]);
      setOdabranDanIndex(0);
      setKarte([]);
      setRefreshKey(prev => prev + 1);
    }, [])
  );
  async function zapratiDogadjaj(){
    console.log('lala');
    const response = await fetch('api/dogadjaj/zaprati', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        korisnikId: korisnikId,
        dogadjajId: dogadjajId
      }),
    });
    console.log('Zapraceno!');
    console.log(response);
  }
  function formatirajDatum(datumInput: string){
    const datumOd = new Date(datumInput);
    
    const dan = datumOd.getUTCDate().toString().padStart(2, "0");
    const mesec = naziviMeseca[datumOd.getUTCMonth()];
    const god = datumOd.getUTCFullYear();
    const sat = datumOd.getUTCHours().toString().padStart(2, "0");
    const min = datumOd.getUTCMinutes().toString().padStart(2, "0");
    
    return `${dan}. ${mesec} ${god}. ${sat}:${min}`;
  }
  const naziviMeseca: string[] = [
    "Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
  ]
  
  const filterFix = () => {
    setFilter(-1);
  }
  const enumEntries = Object.keys(TipTackeEnum)
    .filter(key => isNaN(Number(key)))
    .map(name=>({
      label:name,
      value: TipTackeEnum[name as keyof typeof TipTackeEnum]
    }));
    const pickerItems = [{label:"Prikazi sve", value: -1}, ...enumEntries];
  const handlePress = async () =>{
    try{
      // const response = await fetch(process.env.EXPO_PUBLIC_API_URL +"api/korisnici/omiljeni-dodaj/" + dogadjajId, {
      //   method:'POST',
      //   headers:{
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type":"application/json",
      //   },
      // });
      setJeOmiljeni(true);
    } catch(error){
      console.error(error);
    }
  }
  
  useEffect(()=>{
    const loadToken = async ()=>{
        const tokenTemp = await SecureStore.getItemAsync('jwtToken');
        const idTemp = await SecureStore.getItemAsync('korisnikId');
        setKorisnikId(idTemp);
        if(tokenTemp != null) setToken(tokenTemp);
    
    }
    loadToken();
  },[])
  useEffect(() => {
    if(!token) return;
      async function fetchData(){
        try {
          const response = await API.get(`api/dogadjaj/${dogadjajId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          const data: Dogadjaj = response.data;


          setDogadjaj(data);
          setDatumPocetka(formatirajDatum(data.datumPocetka))
          setDatumZavrsetka(formatirajDatum(data.datumKraja))
        } catch (error: any) {
          console.error(error);
          setDogadjaj(null);
          setDani(null);
        }
      }
    fetchData();

  },[dogadjajId, token, refreshKey])
  function getLocationsForDay(dayId: string) {
    console.log('Test');
    const locations = []
    let br = 0;
    console.log(podrucja);
    console.log(lokacije)
    for(let i = 0; i < lokacije?.length; i++){
      for(let j = 0; j < podrucja.length; j++){
        if(podrucja[j].danId == dayId && lokacije[i].id == podrucja[j].lokacije[0]) locations[br++] = lokacije[i];
      }
    }
    console.log(locations);
    setSelectedLokacije(locations);
  return locations;
}
  useEffect(()=>{
    if(!dogadjaj || dogadjaj == null || dogadjaj.dani ==null) return;
    async function fetchDani(){
      try{
        if(dogadjaj == null) return;
        const promises = dogadjaj.dani.map(danId =>
          API.get(`api/dani/${danId}`).then(res => res.data)
        );

        const allDaniData = await Promise.all(promises);

        setDani(allDaniData);
        console.log(allDaniData);
      }catch(error){
        console.log(error);
      }
    }
    fetchDani();
  },[dogadjaj])
  // useEffect(()=>{
  //   if(dani?.length == 0 || !dani) return;
  //   const fetchActivities = async () => {
  //     try {
  //       const allActivityIds = Array.from(
  //         new Set(dani?.flatMap(dan => dan.aktivnosti))
  //       );

  //       const promises = allActivityIds.map(id =>
  //         API.get(`api/aktivnosti/${id}`).then(res => res.data)
  //       );
  //       const allActivitiesData = await Promise.all(promises);

  //       setAktivnosti(allActivitiesData);
  //     } catch (error) {
  //       console.error('Failed to fetch activities:', error);
  //     }
  //   };

  //   fetchActivities();
  // },[dani])
  useEffect(() =>{
    if(podrucja?.length == 0 || !podrucja) return;
    const fetchLokacije = async() =>{
        try{
        const allLocationIds = Array.from(
          new Set(podrucja?.flatMap(podrucje => podrucje.lokacije))
        )

        const promises = allLocationIds.map(id =>
          API.get(`api/lokacije/${id}`).then(res=>res.data)
        );
        const allLocationsData = await Promise.all(promises);
        let temp:[] = [];

        setLokacije(allLocationsData);
        const arr:Location[] = []
        arr[0]= allLocationsData[0];
        setSelectedLokacije(allLocationsData);
        setSelectedLocationIndex(0);
        console.log(allLocationsData);
      } catch(error){
        console.error('greska:', error);
      }
    }
    fetchLokacije();
  },[podrucja])
  useEffect(()=>{
    const fetchKarte = async () => {
      if(dogadjaj == null || !dogadjaj) return;
      const allCardIds = Array.from(new Set(dogadjaj?.karte || []));
      
      const promises = allCardIds.map(id => 
        API.get(`api/Karta/${id}`).then(res => res.data)
      )

      const allCardsData = await Promise.all(promises)
      setKarte(allCardsData)
      setLoading(false);
    }
    fetchKarte();
  },[dogadjaj])
  useEffect(() => {
    if(!dani) return;
    const fetchPodrucja = async()=>{
      try{
        console.log("Ucitavanje podrucja...")
        const allPodrucjeIds = [
          ...new Set(dani?.flatMap(dan => dan.podrucja)),
        ];
        const podrucjaResponses = await Promise.all(
          allPodrucjeIds.map(id =>API.get(`/api/podrucja/${id}`))
        );
        const podrucjeList: Podrucje[] = await Promise.all(
          podrucjaResponses.map(res => res.data)
        );
        setPodrucja(podrucjeList);
        setPodrucjeLoadin(false);
        
      } catch(error){
        console.error(error);
      }
    };
    fetchPodrucja();
  },[dani])
  useEffect(()=>{
    if(!podrucja) return;
    const fetchMainLokacijePodrucja = async()=>{
      try{
        console.log("Ucitavanje tacaka na podrucjima.")
        const allLokacijeIds =[
          ...new Set(podrucja?.flatMap(podr => podr.lokacije))
        ]
        const lokacijeResponses = await Promise.all(
          allLokacijeIds.map(id => API.get(`/api/lokacije/${id}`))
        );
        const lokList: Lokacija[] = await Promise.all(
          lokacijeResponses.map(res => res.data)
        );

        setMainLokacijePodrucja(lokList);
        setMainLokacijePodrucjaLoading(false);
        
      } catch(error){
        console.error(error);
      }
    }
    fetchMainLokacijePodrucja();
  },[podrucja])
  // useEffect(()=>{
  //   if(!selectedLokacije || !podrucja) return;
  //   console.log('Podrucja:')
  //   console.log(podrucja);
  //   console.log('Karte:')
  //   console.log(karte);
  //   console.log('Dani:')
  //   console.log(dani);
  //   console.log('Lokacije:');
  //   console.log(lokacije);
  //   console.log('Dogadjaj')
  //   console.log(dogadjaj);
  //   console.log('SelectedLokacije:')
  //   console.log(selectedLokacije[0])
  // },[podrucja,selectedLokacije])
  const kupiKartu = async (idKarte: string) => {
    
    const response = await API.post(
      'api/korisnici/kupi-kartu',
        {
          kartaId: idKarte,
          korisnikId: korisnikId,
          kolicina:kupiKolicinu
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
        }
    
  ); 
    if(response.data){
      setShowKupiKartuModal(false);
      setKupljenaKarta(true);
    }
  }

  return (dogadjaj ? 
    (<ScrollView style={styles.container}>
      <DrawerButton></DrawerButton>
      <Image
        source={{uri:`http://softeng.pmf.kg.ac.rs:11071${dogadjaj.urLalbuma}`}} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
      
      </Image>
      <View style={styles.likeCnt}>
        <TouchableOpacity onPress={zapratiDogadjaj} style={[styles.heartButton]}>
          <Ionicons name='heart' size={24} style={[jeOmiljeni ? styles.heartFavorite : styles.heartNormal]}>

          </Ionicons>
        </TouchableOpacity>
      </View>
      <View style={styles.roundedContainer}>
        <Text style={styles.title}>{dogadjaj.naziv}</Text>

        <View style={styles.miniCnt}>
          <Image style={styles.miniIcon} source={require('../../../assets/images/contact.png')}></Image>
          <View style={styles.miniCntText}>
            <Text style={styles.miniTitle}>Organizator</Text>
            <Text style={styles.miniSubtitle}>organizatoor</Text>
          </View>
      </View>

      <View style={styles.miniCnt}>
        <Image style={styles.miniIcon} source={require('../../../assets/images/time.png')}></Image>
        <View style={styles.miniCntText}>
          <Text style={styles.miniTitle}>Datum i vreme</Text>
          <Text style={styles.miniSubtitle}>Od: {datumPocetka }</Text>
          <Text style={styles.miniSubtitle}>Do: {datumZavrsetka }</Text>
        </View>
      </View>

      <View style={styles.miniCnt}>
        <Image style={styles.miniIcon} source={require('../../../assets/images/location.png')}></Image>
        <View style={styles.miniCntText}>
          <Text style={styles.miniTitle}>Lokacija</Text>
          <Text style={styles.miniSubtitle}>{dogadjaj.lokacija}</Text>
        </View>
      </View>
        
      </View>
      <View style={styles.infoSection}>
        <ViewHTML description={dogadjaj.opis}></ViewHTML>
      </View>

      {dani && (
      <View style={styles.mapContainer}>
  <MapWebView
    selectedLokacije={selectedLokacije}   // can be [] if no data
    podrucja={podrucja}
    dani={dani}
    odabranDanIndex={odabranDanIndex}
    mainLokacijePodrucja={mainLokacijePodrucja}
  />

  {selectedLokacije.length === 0 && (
    <Text style={{ textAlign: "center", margin: 10 }}>
      Nema lokacija za ovaj dan
    </Text>
  )}

  <View style={styles.pickerContainer}>
    <Button
      title="Odaberi tip"
      onPress={() => setShowPicker((prev) => !prev)}
      color="#F51E63"
    />
    {showPicker && (
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={filter !== null ? filter : -1}
          onValueChange={(value) => setFilter(value)}
        >
          {pickerItems.map(({ label, value }) => (
            <Picker.Item
              color="#693173"
              key={value}
              label={label}
              value={value}
            />
          ))}
        </Picker>
      </View>
    )}
  </View>
</View>
    )}
      <View style={styles.daysSelector}>
          {
            
          dani?.map((dan:DanDogadjaja, index:number) =>{ 

            return (
            <TouchableOpacity  style={[styles.dayButton, index==0 && styles.firstDayButton, index == dani.length - 1 && styles.lastDayButton,index === odabranDanIndex && styles.selectedDayButton]} key={dan.id} onPress={() => {
              setOdabranDanIndex(index);  
              const l = getLocationsForDay(dani[index].id);
              if(l.length > 0) setSelectedLokacije(l)
              else setSelectedLokacije(lokacije);
              }}>
            
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.dayText}>{"Dan " + (index + 1)}</Text>
              </View>
              
            </TouchableOpacity>
            
          )})}
        </View>
{dani&&
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Informacije:</Text>
        <Text style={styles.infoLabel}>Datum i Vreme Pocetka:</Text>
        <Text style={styles.date}>{formatirajDatum(dani[odabranDanIndex].datumOdrzavanja)}</Text>
        <Text style={styles.infoLabel}>Lokacija:</Text>
        <Text style={styles.date}>{dogadjaj.lokacija}</Text>
        <Text style={styles.infoLabel}>Opis Dana:</Text>
         <ViewHTML description={ dani[odabranDanIndex].opis}>
         
        </ViewHTML> 
        <View style={styles.cardContainer}>
          <Text style={styles.infoTitle}>Karte</Text>
          {karte&&
            karte?.map((karta) => {
              if(karta.brojDana>0 || karta.danId == dani[odabranDanIndex].id){
                return (  
                  <View key={karta.id} style={styles.ticketCard}>
                    <Text>{karta.naziv}</Text>
                    <Text>{karta.brojDana> 0?('Ceo dogadjaj'):('')}</Text>
                    <Text>{karta.cena}RSD</Text>
                    <Text>{TipKarte[karta.tip]}</Text>
                    <TouchableOpacity style={styles.kupiKartu} onPress={() => {
                      setKupiKartuId(karta.id);
                      setShowKupiKartuModal(true)}
                    }

                      >
                      <Text style={styles.kupiKartuText}>Kupi</Text>
                    </TouchableOpacity>
                  </View>
              )
              }
              
            })
          }
        </View>
      </View>
      }
      <Modal
        transparent
        animationType='fade'
        visible={showKupiKartuModal}
        onRequestClose={() => {
          setKupiKartuId('');
          setShowKupiKartuModal(false);
        }}
      >
          <View style={styles.overlayKModal}>
            <View style={styles.modalContainerKModal}>
              <Text>Odaberi kolicinu:</Text>
              <Picker
                selectedValue={kupiKolicinu}
                onValueChange={(itemValue) => setKupiKolicinu(itemValue)}
                style={{width: 150}}
              >
                {[1, 2, 3, 4, 5].map((num)=>(
                  <Picker.Item key={num} label={String(num)} value={num}/>
                ))}
              </Picker>
              <TouchableOpacity onPress={()=>kupiKartu(kupiKartuId)}>
                <Text>Kupi</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>

      <Modal
      transparent
      animationType="fade"
      visible={kupljenaKarta}
      onRequestClose={() => setKupljenaKarta(false)} // Android back button
    >
      <View style={styles.overlayKModal}>
        <View style={styles.modalContainerKModal}>
          <Text style={styles.titleKModal}>Uspesna kupovina!</Text>
          <Text style={styles.messageKModal}>Cesittamo kupili ste kartu!!!</Text>
          <TouchableOpacity style={styles.buttonKModal} onPress={() => setKupljenaKarta(false)}>
            <Text style={styles.buttonTextKModal}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </ScrollView>):
    (
    <View style={styles.loadingWrapper}>
      <View style={styles.loadingScreen}>
        <Image style={{marginTop:175}} source={require('../../../assets/images/vexaLogoLogin.png')}></Image>
      </View>
      <Loading text='dogadjaja'></Loading>
    </View>
  )
  );
}


const styles = StyleSheet.create({
  overlayKModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerKModal: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    elevation: 5, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  titleKModal: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  messageKModal: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonKModal: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  buttonTextKModal: {
    color: 'white',
    fontSize: 18,
  },
  mapLoading:{
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
  infoLabel:{
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    marginTop: 8,
  },
  date:{
    fontSize: 16,
    color: 'white',
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
  pickerWrapper:{
    
    marginTop: 10,
    backgroundColor: 'white',
    //borderRadius: 8,
    elevation: 3,
    zIndex:999,
  },
  pickerContainer:{
    zIndex:999,
    backgroundColor: 'white',
   // borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
  },
  textTacka:{
    fontSize:25,
    fontWeight:400,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
  },
    closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#888',
  },
  kupiKartu:{
    backgroundColor: '#F51E63',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent:'center',
  },
  kupiKartuText:{
    color:'white',
    fontWeight:'bold',
  },
  levo:{
    flex:1,
  },
  ticketCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
    flexDirection:'row',
    justifyContent:'space-between',
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  buyCard:{
    color:'white',
    backgroundColor:'rgba(0, 0, 0, 0.4)',
    padding:15,
    borderRadius:15,
  },
  cardContainer:{
    marginTop:10,
    marginBottom:30,
  },
  card:{
    borderRadius:15,
    backgroundColor:'#F51E63',
    padding:5,
    borderColor:'white',
    borderWidth:0.6,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  heartFavorite:{
    color:'pink',
  },
  heartNormal:{
    color:'grey',
  },
  container: {
    flex: 1,
    backgroundColor:'#000A25',
  },
  roudnedSub:{
    fontWeight:200,
    color:'white',
    fontStyle:'italic',
  },
  backgroundImage: {
    width: width,
    height: height * 0.35,
    justifyContent: 'flex-start',
  },
  miniCnt:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  miniIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  miniCntText: {
    flexDirection: 'column',
  },
  miniTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white', 
  },
  miniSubtitle: {
    fontSize: 14,
    color: 'white', 
  },
  selectedDayButton:{
    backgroundColor: "#693173",
    
    transform: [{ scale: 0.97 }], 
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    //shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#fff',
    //borderRadius: 6,
  },
  heartButton:{
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    elevation: 3, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  likeCnt:{
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
  },
  likeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 24,
    width: 40, // realistic value
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start', // <-- this is important if parent uses flex
    overflow: 'hidden',  
  },
  roundedContainer: {
    backgroundColor: '#F51E63',
    marginHorizontal: 16,
    marginTop: -40, // overlap a bit on the image
    marginBottom:-40,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    position:'relative',
    bottom:50
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white', // Or your primary text color
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFCFC',
    marginTop: 8,
  },
  daysSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,

  },
  dayButton: {
    width:68,
    height:41,
    justifyContent:'center',
    fontSize:20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems:'center',
    //borderColor: '#ccc',
    marginRight: 0,
    backgroundColor:'#B52956'
  },
  firstDayButton:{
    width:68,
    height:41,
    fontSize:20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
    alignItems:'center',
    justifyContent:'center',
    //borderColor: '#ccc',
    marginRight: 0,
    backgroundColor:'#B52956',
  },
  lastDayButton:{
    justifyContent:'center',
    alignItems:'center',
    width:68,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomRightRadius: 12,
    
    ///borderColor: '#ccc',
    marginRight: 0,
    backgroundColor:'#B52956',
  },
  dayButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayText: {
    color: 'white',
    includeFontPadding:false,
    textAlign:'center',
    textAlignVertical:'center',
    fontSize:16, // Ne moze ista velicina kao u figmi jer nije 
  },
  dayTextSelected: {
    color: 'white',
  },
  infoSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
    color:'white',
  },
  infoText: {
    fontSize: 14,
    color: 'white',

  },
  mapContainer: {
    marginTop: 16,
    width: width - 32,
    height: 250,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom:-12,
    borderBottomLeftRadius:0,
    overflow: 'hidden', 
  },
  map: {
    flex: 1,
  },
});
