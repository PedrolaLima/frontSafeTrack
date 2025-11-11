import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Keyboard, FlatList } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

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
  const [predictions, setPredictions] = useState([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const debounceTimeout = useRef(null);

  // Função para buscar sugestões de autocompletar
  const fetchPredictions = async (text) => {
    if (text.length < 3) {
      setPredictions([]);
      return;
    }
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${GOOGLE_MAPS_API_KEY}&language=pt_BR&components=country:BR`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        setPredictions(data.predictions);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
      setPredictions([]);
    }
  };

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
    setLocation("Buscando endereço...");
    setIsFetchingAddress(true);

    setPredictions([]); // Limpa as sugestões ao clicar no mapa
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        // Pega o primeiro resultado que geralmente é o mais específico
        const bestResult = data.results[0];
        setLocation(bestResult.formatted_address);
      } else {
        setLocation("Endereço não encontrado");
      }
    } catch (error) {
      console.error("Erro na geocodificação reversa:", error);
      setLocation("Erro ao buscar endereço");
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handleLocationSearch = async () => {
    if (!location.trim()) return;
    Keyboard.dismiss(); // Fecha o teclado

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
        setMarkerCoordinate({ latitude: lat, longitude: lng }); // Adiciona marcador
      } else {
        Alert.alert("Erro", "Não foi possível encontrar o local.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao buscar o local.");
    }
    setPredictions([]); // Limpa as sugestões após a busca
  };

  // Função para lidar com a seleção de uma sugestão
  const handlePredictionPress = async (prediction) => {
    Keyboard.dismiss();
    setLocation(prediction.description); // Atualiza o input com o endereço completo
    setPredictions([]); // Esconde a lista de sugestões

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${GOOGLE_MAPS_API_KEY}&fields=geometry`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01, // Zoom mais próximo
          longitudeDelta: 0.005,
        };
        mapRef.current?.animateToRegion(newRegion, 1000);
        setMarkerCoordinate({ latitude: lat, longitude: lng });
      } else {
        Alert.alert("Erro", "Não foi possível obter os detalhes do local.");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do local:", error);
      Alert.alert("Erro", "Ocorreu um erro ao selecionar o local.");
    }
  };

  // Efeito para acionar a busca com debounce
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (location && !isFetchingAddress) fetchPredictions(location);
    }, 500); // Atraso de 500ms para evitar muitas requisições
  }, [location, isFetchingAddress]);

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar endereço..."
          placeholderTextColor={isFetchingAddress ? "#ccc" : "#888"}
          value={location}
          onChangeText={(text) => {
            setLocation(text);
            if (isFetchingAddress) setIsFetchingAddress(false);
          }}
          onSubmitEditing={handleLocationSearch}
        />
        {predictions.length > 0 && (
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.predictionItem} onPress={() => handlePredictionPress(item)}>
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
            style={styles.predictionsList}
          />
        )}
      </View>
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
  searchContainer: {
    position: 'absolute',
    top: 110,
    left: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  reportButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: "#d32f2f",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    opacity: 0.95,
  },
  searchInput: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  predictionsList: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    elevation: 5,
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reportButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});