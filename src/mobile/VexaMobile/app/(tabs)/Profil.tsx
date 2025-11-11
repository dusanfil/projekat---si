import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router, Router } from 'expo-router';
import DrawerButton from '@/components/DrawerButton';
export default function MenuPage() {
  return (
    <View style={styles.container}>
        <DrawerButton></DrawerButton>
      <TouchableOpacity style={styles.button} onPress={()=>{
        router.push('/Profile')
      }}>
        <View style={styles.circle}>
          <FontAwesome5 name="pen" size={24} color="white" />
        </View>
        <Text style={styles.text}>Izmeni podatke</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=>{
        router.push('/Notifikacije')
      }}>
        <View style={styles.circle}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>
        <Text style={styles.text}>Obavestenja</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <View style={styles.circle}>
          <FontAwesome5 name="lock" size={24} color="white" />
        </View>
        <Text style={styles.text}>Promeni lozinku</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=>{
        router.push('/LajkovaniDogadjaji');
      }}>
        <View style={styles.circle}>
          <FontAwesome5 name="heart" size={24} color="white" />
        </View>
        <Text style={styles.text}>Lajkovani događaji</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#020d2c',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row', // align circle and text horizontally
    alignItems: 'center',
    marginVertical: 15,
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 35,
    backgroundColor: '#e6007e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 25,
    fontWeight: '200',
    color:'white',
    marginLeft:15,
    marginTop: -10,
  },
});