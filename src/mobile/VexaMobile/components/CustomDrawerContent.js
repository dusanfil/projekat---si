import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const menuItems = [
  { label: 'Početna', route: '/EventList' },
  { label: 'Kalendar', route: '/Kalendar' },
  { label: 'Notifikacije', route: '/Notifikacije' },
  { label: 'Moji dogadjaji', route: '/PrikaziKarteKorisnika' },
  { label: 'Moj profil', route: '/Profile' },
  { label: 'FAQ', route: '/FAQ' },
  { label: 'Kredit', route: '/Kredit' },
  { label: 'Profil', route: '/Profil' },
];

export default function CustomDrawerContent(props) {

  const handleNavigate = (route) => {
  router.push(`${route}?refresh=${Date.now()}`);
};
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('jwtToken');
    await SecureStore.deleteItemAsync('korisnikId');
    Alert.alert('Odjava', 'Da li ste sigurni da želite da se odjavite?', [
      { text: 'Otkaži', style: 'cancel' },
      {
        text: 'Odjavi se',
        style: 'destructive',
        onPress: () => {
          // Add your logout logic here
          Alert.alert('Uspešno ste se odjavili!');
          router.replace('/Login');
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/vexaLogoLogin.png')} style={styles.logo} />
        <Text style={styles.subtitle}>EVENT ORGANIZER</Text>
      </View>

      {menuItems.map(item => (
        <TouchableOpacity
          key={item.label}
          style={styles.menuItem}
          onPress={() => handleNavigate(item.route)}
        >
          <Text style={styles.menuItemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <Text style={[styles.menuItemText, { color: '#f66' }]}>Odjavi se</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8F123A',
  },
  logoContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff3',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    fontSize: 12,
    letterSpacing: 1,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#fff3',
  },
});