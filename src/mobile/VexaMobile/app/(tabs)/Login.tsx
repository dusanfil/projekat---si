import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import { API } from '../../services/api';
import * as SecureStore from 'expo-secure-store'

export default function LoginScreen({ navigation }: any) {
  const [korisnickoIme, setKorisnickoIme] = useState('');
  const [sifra, setSifra] = useState('');
  const [errorMsg, setErrorMsg] = useState("");
  const handleLogin = async () => {
    try {
      const response = await API.post('api/auth/login', { korisnickoIme: korisnickoIme, sifra: sifra });
      console.log('Uspešna prijava:', response.data);
      const data = response.data;
      await SecureStore.setItemAsync('jwtToken', data.token);
      await SecureStore.setItemAsync('korisnikId', data.id)
      const token = await SecureStore.getItemAsync('jwtToken');
      console.log(token);
      router.push({
        pathname:'(tabs)/EventList' as any,
        })
      // ovde ide redirect ako treba
    } catch (error: any) {
      if(error.response.data?.message?.toLowerCase().includes('podaci')){
        // Alert.alert("Neuspešna prijava", "Pogrešna lozinka ili korisničko ime!");
      }
      if (error.response) {
        // Ako postoji response, loguj error.response.data
        // Alert.alert("Neuspešna prijava", "Pogrešna lozinka ili korisničko ime!");
        setErrorMsg("Neuspešna prijava. Pogrešna lozinka ili korisničko ime!")

      } else {
        // Ako nema response, loguj error.message
        setErrorMsg("Neuspešna prijava. Neočekivana greška prilikom prijave.")
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image style={{alignSelf:'center'}} source={require('../../assets/images/vexaLogoLogin.png')}>

      </Image>
      <Text style={styles.title}>Dobrodošli!</Text>
      <Text style={styles.labelText}>Korisnicko ime:</Text>
      <TextInput style={styles.input} value={korisnickoIme} onChangeText={setKorisnickoIme} />
      <Text style={styles.labelText}>Šifra:</Text>
      <TextInput style={styles.input} secureTextEntry value={sifra} onChangeText={setSifra} />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Prijavi se</Text>
      </TouchableOpacity>
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <TouchableOpacity onPress={() => router.push('./Register')}>
        <Text style={styles.link}>Nemaš nalog? Registruj se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  labelText:{
    color:'white',
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  container: { padding: 24, flex: 1, backgroundColor:'#000A25'},
  title: { fontSize: 24, marginBottom: 16,color:'white' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6, color:'white' },
  button: { backgroundColor: '#f06', padding: 12, borderRadius: 6 },
  buttonText: { color: '#fff', textAlign: 'center' },
  link: { color: '#3366cc', marginTop: 10 },
});
