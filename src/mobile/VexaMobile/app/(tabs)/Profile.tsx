import React, { useState, useMemo, useEffect } from "react";
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, ImageBackground, StyleSheet, Dimensions, Image,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {useNavigation} from '@react-navigation/native'
import { API } from "../../services/api";
import { router } from 'expo-router';
import { Korisnik } from "@/types/dogadjaj";
import * as SecureStore from 'expo-secure-store'
import Loading from "@/components/Loading";
import { Picker } from "@react-native-picker/picker";
import { Button } from "@react-navigation/elements";
import { useSortedScreens } from "expo-router/build/useScreens";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import DrawerButton from "@/components/DrawerButton";
const { width, height } = Dimensions.get('window');

type DrawerNav = DrawerNavigationProp<any>
export default function Profil(){
    const [token, setToken] = useState('');
    const [tokenLoading, setTokenLoading] = useState(true);

    const [userId, setUserId] = useState('');
    const [userIdLoading, setUserIdLoading] = useState(true);

    const [user, setUser] = useState<Korisnik | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [brojTelefona, setBrojTelefona] = useState('');
    const [novaSifra, setNovaSifra] = useState('');
    const [potvrdaSifre, setPotvrdaSifre] = useState('');

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
        const ucitajToken = async()=>{
            const idTemp = await SecureStore.getItemAsync('korisnikId');
            if(idTemp) {
                setUserId(idTemp);
                
                setUserIdLoading(false);
            }
        }
        ucitajToken();
    },[])
    useEffect(()=>{
        if(userIdLoading) return;
        const ucitajUsera = async() =>{
            const response = await API.get(`api/korisnici/${userId}`)
            setUser(response.data);
            setEmail(response.data.email);
            setBrojTelefona(response.data.brojTelefona);
            setUserLoading(false);
        }
        
        ucitajUsera();
    },[userId])
    const handleSubmit = async()=>{
        const updateUserDto = {
            id: userId,
            korisnickoIme: user?.korisnickoIme,
            email: email,
            brojTelefona: brojTelefona,
            uloga: user?.uloga,
            verifikovanEmail: user?.verifikovanEmail,
            kartica: user?.kartica
        }
        const response = await API.put(`api/korisnici/azuriraj`,
            updateUserDto
        )
        setUser(response.data);
        Alert.alert("Uspešno!","Vaši podaci su uspesno promenjeni");
    }
    const navigation = useNavigation<DrawerNav>();
//      React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => (
        
//       ),
//     });
//   }, [navigation]);
    return (
        userLoading?
        (
            <View style={styles.loadingWrapper}>
                <View style={styles.loadingScreen}>
                    <Image style={{marginTop:175}} source={require('../../assets/images/vexaLogoLogin.png')}></Image>
                </View>
                <Loading text='kredita'></Loading>
            </View>
        )
        :
        (
            <View style={styles.container}>
                 <View style={styles.circle} />

      {/* Input fields */}
      <DrawerButton></DrawerButton>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        value={brojTelefona}
        onChangeText={setBrojTelefona}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova lozinka"
        placeholderTextColor="#999"
        secureTextEntry
        value={novaSifra}
        onChangeText={setNovaSifra}
      />
      <TextInput
        style={styles.input}
        placeholder="Potvrdi novu lozinku"
        placeholderTextColor="#999"
        secureTextEntry
        value={potvrdaSifre}
        onChangeText={setPotvrdaSifre}
      />

      {/* Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Azuriraj</Text>
      </TouchableOpacity>
            </View>
        )
    )
}

const styles = StyleSheet.create({
    circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    marginBottom: 30,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color:'white',
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#F51E63",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
    container: { 
        padding: 24, 
        flex: 1, 
        backgroundColor:'#000A25',
        alignItems:'center',
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
})