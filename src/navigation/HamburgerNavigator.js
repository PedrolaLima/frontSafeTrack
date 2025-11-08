import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import HomeScreen from "../screens/HomeScreen";
import ProfileViewScreen from "../screens/ProfileViewScreen";
import MapScreen from "../screens/MapScreen";
import MyNeighborhoodScreen from "../screens/Neighborhood";

import { deleteToken } from "../utils/secureStore";
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const handleLogout = async () => {
    try {
      await deleteToken();

      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.log("Erro ao realizar logout:", e);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="log-out" size={22} color="#d32f2f" />
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"   
      screenOptions={{
        drawerStyle: 
        {
          paddingTop: 30
        },
      headerShown: false,
      }}

      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="ProfileView"
        component={ProfileViewScreen}
        options={{ title: "Meu Perfil" }}
      />
      <Drawer.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "Mapa" }}
      />
      <Drawer.Screen
        name="Neighborhood"
        component={MyNeighborhoodScreen}
        options={{ title: "Meu bairro" }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginTop: 10,
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#d32f2f",
  },  
});
