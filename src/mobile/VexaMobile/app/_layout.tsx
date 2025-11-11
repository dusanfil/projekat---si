import { Drawer } from 'expo-router/drawer';
// @ts-ignore
import CustomDrawerContent from '../components/CustomDrawerContent';
import React = require('react');
import { HeaderShownContext } from '@react-navigation/elements';
export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#000A25' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#f06',
        drawerInactiveTintColor: '#ccc',
        
      }}
      >
      <Drawer.Screen name="index" options={{ drawerLabel: 'Pocetna' }} />
      <Drawer.Screen name="Login" options={{ drawerLabel: 'Login' }} />
      <Drawer.Screen name="Register" options={{ drawerLabel: 'Register' }} />
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Glavni Tabovi' }} />
    </Drawer>
  );
}