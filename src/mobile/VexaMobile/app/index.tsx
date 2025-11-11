import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import React = require('react');
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function HomeScreen() {
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dobrodošli na našu aplikaciju!</Text>

      <TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/Login')} // Navigacija na Login ekran
>
  <Text style={styles.buttonText}>Prijavi se</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/Register')} // Navigacija na Register ekran
>
  <Text style={styles.buttonText}>Registruj se</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000A25', // Svetla pozadina, usklađeno sa ostalim ekranima
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#f06', // Koristi istu boju kao na dugmićima
    alignContent:'center',
    alignItems:'center',
    justifyContent:'center',
    textAlign:'center',
  },
  button: {
    backgroundColor: '#f06', // Ista boja kao na dugmićima na loginu i registraciji
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
