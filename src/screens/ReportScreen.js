import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Keyboard,
  FlatList,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

import { getPlaceDetailsByApi } from "../api/index";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function ReportScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);

  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const initialRegion = {
    latitude: -23.63689,
    longitude: -46.5782,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const allowedCities = useMemo(
    () => ["São Caetano do Sul", "Santo André", "São Bernardo do Campo"],
    []
  );

  const getGoogleAutocomplete = async (text) => {
    if (!text || text.length < 3) return [];

    const locationBias = "location=-23.65,-46.55&radius=25000";

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      text
    )}&key=${GOOGLE_MAPS_API_KEY}&language=pt-BR&components=country:br&${locationBias}&sessiontoken=${Date.now()}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.status === "OK" ? data.predictions : [];
    } catch (err) {
      console.error("Erro no Autocomplete do Google:", err);
      return [];
    }
  };

  const fetchPredictions = async (text) => {
    if (text.length < 3) return setPredictions([]);

    try {
      const data = await getGoogleAutocomplete(text);
      setPredictions(data ? data.slice(0, 4) : []);
    } catch (err) {
      console.error("Erro ao buscar sugestões:", err);
      setPredictions([]);
    }
  };

  // get info from backend with placesId
  const fetchPlaceDetails = async (placeId) => {
    if (!placeId) return;

    setIsLoading(true);

    try {
      const { result } = await getPlaceDetailsByApi(placeId);

      if (!result) {
        Alert.alert("Erro", "Não foi possível obter detalhes do local.");
        return null;
      }

      const { formatted_address, geometry } = result;
      const lat = geometry.location.lat;
      const lng = geometry.location.lng;
      const coordinate = { latitude: lat, longitude: lng };

      if (!allowedCities.some((city) => formatted_address.includes(city))) {
        Alert.alert("Atenção", "Permitido apenas endereços no ABC.");
        setMarkerCoordinate(null);
        setFormattedAddress("");
        setSelectedPlaceId(null);
        return null;
      }

      setMarkerCoordinate(coordinate);
      setFormattedAddress(formatted_address);
      setLocationInput(formatted_address);
      setSelectedPlaceId(placeId);

      mapRef.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    } catch (error) {
      console.error("Erro ao buscar detalhes do local:", error);
      Alert.alert("Erro", "Não foi possível buscar os detalhes do local.");
    } finally {
      setIsLoading(false);
    }
  };

  // handlers
  const handleLocationSearch = () => {
    Keyboard.dismiss();
    setPredictions([]);

    if (!formattedAddress) {
      Alert.alert("Atenção", "Por favor, selecione um local da lista.");
    }
  };

  const handlePredictionPress = async (prediction) => {
    Keyboard.dismiss();
    setPredictions([]);
    await fetchPlaceDetails(prediction.place_id);
  };

  const handleClearSearch = () => {
    setLocationInput("");
    setPredictions([]);
    setMarkerCoordinate(null);
    setFormattedAddress("");
    setSelectedPlaceId(null);
    Keyboard.dismiss();
  };

  const handleReport = () => {
    if (!markerCoordinate || !formattedAddress || !selectedPlaceId) {
      Alert.alert("Erro", "Local inválido ou não selecionado.");
      return;
    }

    navigation.navigate("ReportForm", {
      latitude: markerCoordinate.latitude,
      longitude: markerCoordinate.longitude
    });
  };

  // disable button
  const isReportButtonDisabled =
    !markerCoordinate || !formattedAddress || isLoading || !locationInput;

  // debounce
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      locationInput ? fetchPredictions(locationInput) : setPredictions([]);
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [locationInput]);

  // UI
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Selecione o local</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Exemplo: Centro, Santo André"
            placeholderTextColor="#888"
            value={locationInput}
            onChangeText={(text) => {
              setLocationInput(text);
              if (selectedPlaceId) {
                setMarkerCoordinate(null);
                setFormattedAddress("");
                setSelectedPlaceId(null);
              }
            }}
            onSubmitEditing={handleLocationSearch}
          />

          {/* BUTTON RIGHT */}
          {locationInput.length > 0 && !isLoading ? (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Icon name="x-circle" size={22} color="#888" />
            </TouchableOpacity>
          ) : isLoading ? (
            <View style={styles.clearButton}>
              <Text style={{ color: "#888" }}>...</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleLocationSearch}
              style={styles.searchButton}
            >
              <Icon name="search" size={22} color="#555" />
            </TouchableOpacity>
          )}
        </View>

        {/* AUTOCOMPLETE LIST */}
        {predictions.length > 0 && (
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            style={styles.predictionsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.predictionItem}
                onPress={() => handlePredictionPress(item)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <MapView
        style={styles.map}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            title="Local selecionado"
            description={formattedAddress}
            pinColor="red"
          />
        )}
      </MapView>

      {/* BUTTON REPORT */}
      <TouchableOpacity
        style={[
          styles.reportButton,
          isReportButtonDisabled && styles.reportButtonDisabled,
        ]}
        onPress={handleReport}
        disabled={isReportButtonDisabled}
      >
        <Text style={styles.reportButtonText}>Reportar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  backButton: { padding: 5 },

  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    transform: [{ translateX: -15 }],
  },

  map: { flex: 1 },

  searchContainer: {
    position: "absolute",
    top: 110,
    left: 15,
    right: 15,
    zIndex: 1,
  },

  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  searchInput: {
    backgroundColor: "white",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingRight: 45,
    fontSize: 16,
    elevation: 5,
  },

  searchButton: {
    position: "absolute",
    right: 10,
    padding: 5,
  },

  clearButton: {
    position: "absolute",
    right: 10,
    padding: 5,
  },

  predictionsList: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 5,
    elevation: 5,
    maxHeight: 200,
  },

  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  reportButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#d32f2f",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
  },

  reportButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },

  reportButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});
