import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Keyboard } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

const GOOGLE_MAPS_API_KEY = "SUA_CHAVE_DE_API_AQUI"; // <-- SUBSTITUA PELA SUA CHAVE

export default function ReportScreen({ navigation }) {
  // Coordenadas iniciais para São Paulo
  const initialRegion = {
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [location, setLocation] = useState("");

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
  };

  const handleLocationSearch = async () => {
    if (!location.trim()) return;
    Keyboard.dismiss();

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      location
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(newRegion, 1000);
      } else {
        Alert.alert("Erro", "Não foi possível encontrar o local.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao buscar o local.");
    }
  };

  const handleReport = () => {
    if (!markerCoordinate) {
      Alert.alert("Atenção", "Por favor, selecione um local no mapa para reportar.");
      return;
    }
    // Navega para a tela do formulário, passando a coordenada como parâmetro
    navigation.navigate('ReportForm', { coordinate: markerCoordinate });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Selecione o local</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar endereço..."
        placeholderTextColor="#888"
        value={location}
        onChangeText={setLocation}
        onSubmitEditing={handleLocationSearch}
      />
      <MapView
        style={styles.map}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            title="Local do Reporte"
            description="Este é o local que você selecionou."
            pinColor="red" // Cor do marcador para destaque
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.reportButton} onPress={handleReport} disabled={!markerCoordinate}>
        <Text style={styles.reportButtonText}>Reportar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    // Ajuste para compensar o botão de voltar e centralizar o texto
    transform: [{ translateX: -15 }],
  },
  map: {
    flex: 1,
  },
  reportButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    position: 'absolute',
    top: 110, // Posição abaixo do header
    left: 15,
    right: 15,
    backgroundColor: 'white',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 1,
  },
  reportButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});