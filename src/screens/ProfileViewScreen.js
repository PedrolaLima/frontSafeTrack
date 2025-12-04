import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";

import AppLayout from "../components/AppLayout";
import HamburgerMenu from "../components/HamburgerMenu";

import { deleteToken } from "../utils/secureStore";
import { useUser } from "../hooks/useUser";

export default function ProfileViewScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    setLoading(userLoading);
  }, [userLoading]);

  const handleLogout = async () => {
    await deleteToken();
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <AppLayout>
        <SafeAreaView style={styles.safe}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </AppLayout>
    );
  }

  const roleImages = {
    ADMIN: require("../../assets/images/icons/admin.png"),
    REPRESENTANTE: require("../../assets/images/icons/leader.png"),
    USER: require("../../assets/images/icons/user.png"),
  };
  const imageSource = user?.photo ? { uri: user.photo } : roleImages[user?.role];

  return (
    <AppLayout>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <HamburgerMenu />
          <Text style={styles.logo}>SafeTrack</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={{ height: 30 }} />

        <Text style={styles.profileTitle}>Meu Perfil</Text>

        <View style={{ height: 20 }} />

        {user ? (
          <View style={styles.centered}>
            {imageSource && (
              <Image source={imageSource} style={styles.profileImage} />
            )}
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.info}>Email: {user.email}</Text>
            <Text style={styles.info}>
              Cargo:{" "}
              {
                {
                  ADMIN: "Administrador",
                  USER: "Morador",
                  REPRESENTANTE: "Representante",
                }[user.role]
              }
            </Text>
          </View>
        ) : (
          <Text style={{ textAlign: "center" }}>Usuário não encontrado</Text>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("ProfileEdit")}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f6f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
    backgroundColor: "#fff",
    position: "relative",
  },
  logo: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 20,
    color: "#111",
    zIndex: 0,
  },
  profileTitle: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    color: "#222",
    marginTop: 70,
  },
  centered: {
    alignItems: "center",
    marginBottom: 36,
    width: "100%",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: "#e0e0e0",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
  },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
    width: "100%",
  },
  editButton: {
    backgroundColor: "#111",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 28,
    alignItems: "center",
    marginBottom: 10,
    minWidth: 120,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d32f2f",
    minWidth: 120,
  },
  logoutButtonText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: 15,
  },
});
