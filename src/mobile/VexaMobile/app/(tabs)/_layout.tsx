import { Tabs } from 'expo-router';
import React = require('react');
export default function TabsLayout() {
  return (
    <Tabs initialRouteName="EventList" screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="EventDetails" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="EventList" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="PrikaziDogadjaj/[dogadjajId]" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="FAQ" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="Kalendar" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="Login" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="Register" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="Kredit" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="Profile" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="PrikaziKarteKorisnika" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="Notifikacije" 
        options={{tabBarStyle:{display:'none'}}}
      />
       <Tabs.Screen 
        name="Profil" 
        options={{tabBarStyle:{display:'none'}}}
      />
      <Tabs.Screen 
        name="LajkovaniDogadjaji" 
        options={{tabBarStyle:{display:'none'}}}
      />
      {/* <Tabs.Screen name="EventList" />
      <Tabs.Screen name="PrikazPrijavljenihDogadjaja" /> */}
    </Tabs>
  );
}