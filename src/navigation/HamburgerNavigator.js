import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import HomeScreen from "../screens/HomeScreen";
import ProfileViewScreen from "../screens/ProfileViewScreen";
import MapScreen from "../screens/MapScreen";
import MyNeighborhoodScreen from "../screens/Neighborhood";
import RegisterScreen from "../screens/RegisterScreen";

import { deleteToken } from "../utils/secureStore";
import { useUser } from "../hooks/useUser";
import UserListScreen from "../screens/UserListScreen";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { user } = useUser();

  const handleLogout = async () => {
    await deleteToken();
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleNavigateToRegister = () => {
    props.navigation.navigate("Register");
  };

  const handleNavigateToUserList = () => {
    props.navigation.navigate("UserList");
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {(user?.role === "ADMIN" || user?.role === "REPRESENTANTE") && (
        <TouchableOpacity onPress={handleNavigateToUserList} style={styles.registerButton}>
          <Icon name="users" size={22} color="#007bff" />
          <Text style={styles.registerButtonText}>Gerenciar Usuários</Text>
        </TouchableOpacity>
      )}

      {user?.role === "ADMIN" && (
        <TouchableOpacity onPress={handleNavigateToRegister} style={styles.registerButton}>
          <Icon name="user-plus" size={22} color="#1976d2" />
          <Text style={styles.registerButtonText}>Cadastrar Representante</Text>
        </TouchableOpacity>
      )}

      {user?.role === "REPRESENTANTE" && (
        <TouchableOpacity onPress={handleNavigateToRegister} style={styles.registerButton}>
          <Icon name="user-plus" size={22} color="#1976d2" />
          <Text style={styles.registerButtonText}>Cadastrar Morador</Text>
        </TouchableOpacity>
      )}

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
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="ProfileView" component={ProfileViewScreen} options={{ title: "Meu Perfil" }} />
      <Drawer.Screen name="Map" component={MapScreen} options={{ title: "Mapa" }} />
      <Drawer.Screen name="Neighborhood" component={MyNeighborhoodScreen} options={{ title: "Meu Bairro" }} />
      <Drawer.Screen name="UserList" component={UserListScreen} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="Register" component={RegisterScreen} options={{ drawerItemStyle: { display: "none" } }}/>
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
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginTop: 10,
  },
  registerButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
  },
});
