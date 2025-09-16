import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DrawerNavigator from './DrawerNavigator';
import ReportScreen from '../screens/ReportScreen';
import AlertScreen from '../screens/AlertScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Mapa" component={DrawerNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Reportar" component={ReportScreen} />
      <Tab.Screen name="Alertas" component={AlertScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}