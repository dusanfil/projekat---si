import { router } from 'expo-router'; // Dodaj uvoz router-a
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { API } from '../../services/api';
import {useRef} from 'react'
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function RegisterScreen() {
  const [korisnickoIme, setKorisnickoIme] = useState('');
  const [email, setEmail] = useState('');
  const [sifra, setSifra] = useState('');
  const [potvrdaSifre, setPotvrdaSifre] = useState('');
  const [imeIPrezime, setImeIPrezime] = useState('');
  const [brojTelefon, setBrojTelefon] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleRegister = async () => {
    if (sifra !== potvrdaSifre) {
      alert('Šifre se ne poklapaju!');
      return;
    }

    try {
      const response = await API.post('api/auth/registracija/korisnik', {
        korisnickoIme: korisnickoIme,
        email: email,
        sifra: sifra,
        imeIPrezime: imeIPrezime,
        uloga:'Korisnik',
        adresa:'',
        brojTelefona:brojTelefon
      });
      console.log('Uspešna registracija:', response.data);

      // Zameni navigation.navigate sa router.push
      router.push('./Login'); // Navigira na login stranicu nakon uspešne registracije

    } catch (error: any) {
      console.log(error);
      
      if (error.response) {
        
        // Ako postoji response, loguj error.response.data
        console.error('Greška pri registraciji:', error.response.data);
      } else {
        // Ako nema response, loguj error.message
        console.error('Greška pri registraciji:', error.message);
      }
      
    }
  };
  <StatusBar backgroundColor='#000A25'></StatusBar>
  return (
  
    <KeyboardAvoidingView style={{flex:1, backgroundColor:'#000A25'}} behavior={Platform.OS === 'ios'? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{justifyContent:'center'}} ref={scrollRef} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Image style={{alignSelf:'center'}} source={require('../../assets/images/vexaLogoLogin.png')}>
          
          </Image>
          <Text style={styles.title}>Registracija</Text>
          <Text style={styles.labelText}>Korisničko ime:</Text>
          <TextInput style={styles.input} value={korisnickoIme} onChangeText={setKorisnickoIme} />
          <Text style={styles.labelText}>Email:</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} />
          <Text style={styles.labelText}>Šifra:</Text>
          <TextInput style={styles.input} secureTextEntry value={sifra} onChangeText={setSifra} />
          <Text style={styles.labelText}>Potvrdi šifru:</Text>
          <TextInput style={styles.input} secureTextEntry value={potvrdaSifre} onChangeText={setPotvrdaSifre} />
          <Text style={styles.labelText}>Ime i prezime:</Text>
          <TextInput style={styles.input} value={imeIPrezime} onChangeText={setImeIPrezime} />
          <Text style={styles.labelText}>Broj telefona:</Text>
          <TextInput style={styles.input} value={brojTelefon} onChangeText={setBrojTelefon} />
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Registracija</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, backgroundColor:'#000A25' },
  title: { fontSize: 24, marginBottom: 16, color: 'white' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6, color:'white' },
  button: { backgroundColor: '#f06', padding: 12, borderRadius: 6 },
  buttonText: { color: '#fff', textAlign: 'center' },
  labelText:{color:'white'},
});
