import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  FlatList, // Não será mais usado no corpo do Return, mas mantemos o import
} from "react-native";
import HamburgerMenu from "../components/HamburgerMenu";
import Icon from "react-native-vector-icons/Feather";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <HamburgerMenu />
        <Text style={styles.logo}>SafeTrack</Text>
        <TouchableOpacity>
          <Icon name="search" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Bem-vindo ao SafeTrack!</Text>
        <Text style={styles.subtitleText}>Escolha uma das opções abaixo:</Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Map")} // CORREÇÃO AQUI
        >
          <Icon name="map" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Visualizar Ocorrências</Text>
        </TouchableOpacity>
        {/* CORREÇÃO 2: Envolver navigation.navigate em uma função anônima */}
        <TouchableOpacity
          style={styles.navButtonSecondary}
          onPress={() => navigation.navigate("Report")} // CORREÇÃO AQUI
        >
          <Icon
            name="plus-circle"
            size={24}
            color="#007bff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonTextSecondary}>Reportar Novo Caso</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f6f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
    backgroundColor: "#fff",
    position: "relative",
  },
  logo: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: 30,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#111",
    zIndex: 0,
  },
  // NOVOS ESTILOS PARA O CONTEÚDO
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  navButton: {
    flexDirection: "row",
    backgroundColor: "#007bff", // Cor primária
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "80%",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  navButtonSecondary: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#007bff",
    borderWidth: 2,
    elevation: 1,
  },
  buttonTextSecondary: {
    color: "#007bff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },
  // Remova todos os estilos relacionados a 'feedCard', 'feedHeader', etc.
});
