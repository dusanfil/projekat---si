import React, { useState, useMemo, useEffect } from "react";
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, ImageBackground, StyleSheet, Dimensions, Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

import { API } from "../../services/api";
import { router } from 'expo-router';
import { Korisnik } from "@/types/dogadjaj";
import * as SecureStore from 'expo-secure-store'
import Loading from "@/components/Loading";
import { Picker } from "@react-native-picker/picker";
import { Button } from "@react-navigation/elements";
import DrawerButton from "@/components/DrawerButton";
const { width, height } = Dimensions.get('window');

export default function Kredit(){
    const [user, setUser] = useState<Korisnik>();
    const [userLoading, setUserLoading] = useState(true);

    const [userId, setUserId] = useState<string>('');
    const [userIdLoading, setUserIdLoading] = useState(true);
    const [selectedValue, setSelectedValue] = useState(500);
    const [credit, setCredit] = useState(0);
    const [creditLoading, setCreditLoading] = useState(true);
    const handleAddValue = async() =>{
        if(!user?.balans || !selectedValue) return;
        const newBalance = user?.balans + selectedValue;
        const response = await API.post('api/korisnici/balans',{
          korisnikId: userId,
          balans: selectedValue
            
        })
        console.log('lala');
        const response2 = await API.get(`api/korisnici/${userId}`);
        console.log(response2.data);
        setUser(response2.data);
        setCredit(response2.data.balans);
        setCreditLoading(false);
        setUserLoading(false);
    }
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
       
        const ucitajKorisnika = async() =>{
            
            const response = await API.get(`api/korisnici/${userId}`);
            console.log(response.data);
            setUser(response.data);
            setCredit(response.data.balans);
            setCreditLoading(false);
            setUserLoading(false);
        }
        ucitajKorisnika();
    },[userId])

    return(
        userLoading||creditLoading?
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
      <DrawerButton></DrawerButton>
      <Text style={styles.balanceText}>Balans: RSD{credit}</Text>

      {/* Dropdown */}
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}

      >
        <Picker.Item label="500RSD" value="500" />
        <Picker.Item label="1000RSD" value="1000" />
        <Picker.Item label="2000RSD" value="2000" />
        <Picker.Item label="5000RSD" value="5000" />
      </Picker>

     
      <TouchableOpacity style={styles.button} onPress={handleAddValue}>
        <Text style={styles.buttonText}>Dodaj {selectedValue}</Text>
      </TouchableOpacity>
    </View>
        )
    )
}

const styles=StyleSheet.create({
    button: {
    backgroundColor: "#F51E63",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",

  },
    container: {
        backgroundColor:'#000A25',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
  },
  balanceText: {
    fontSize: 24,
    color:'white',
    fontWeight: "bold",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
    color:'#F51E63',
    backgroundColor:'white',
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