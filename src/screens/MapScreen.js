import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Keyboard, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import RNPickerSelect from "react-native-picker-select";
import HamburgerMenu from "../components/HamburgerMenu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

// Dados de exemplo para os crimes
const crimesData = [
  { id: "1", type: "roubo", location: { latitude: -23.55052, longitude: -46.633308 }, date: "2023-10-01" },
  { id: "2", type: "furto", location: { latitude: -23.5611, longitude: -46.6425 }, date: "2023-10-05" },
  { id: "3", type: "assalto", location: { latitude: -23.5489, longitude: -46.6388 }, date: "2023-10-10" },
];

const crimeTypes = {
  roubo: { label: "Roubo", color: "yellow" },
  furto: { label: "Furto", color: "orange" },
  assalto: { label: "Assalto à mão armada", color: "red" },
};

const GOOGLE_MAPS_API_KEY = "SUA_CHAVE_DE_API_AQUI"; // <-- SUBSTITUA PELA SUA CHAVE

export default function MapScreen({ navigation }) {
  const insets = useSafeAreaInsets(); // Hook para obter as áreas seguras
  const [selectedCrime, setSelectedCrime] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState(crimesData);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const mapRef = useRef(null); // Referência para o MapView

  const handleCrimeChange = (value) => {
    setSelectedCrime(value);
    if (value) {
      setFilteredMarkers(crimesData.filter((crime) => crime.type === value));
    } else {
      setFilteredMarkers(crimesData); // Mostra todos se nenhum filtro for selecionado
    }
  };

  const handleLocationSearch = async () => {
    if (!location.trim()) return;
    Keyboard.dismiss(); // Fecha o teclado

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.02, // Zoom mais próximo
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(newRegion, 1000); // Anima o mapa para a nova região
      } else {
        Alert.alert("Erro", "Não foi possível encontrar o local. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na busca de geocodificação:", error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar o local.");
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <HamburgerMenu />
        <Text style={styles.headerTitle}>SafeTrack</Text>
        {/* View vazia para balancear o espaço do header */}
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* O mapa agora ocupa o espaço flexível disponível */}
        <View style={styles.mapWrapper}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
            latitude: -23.55052,
            longitude: -46.633308,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {filteredMarkers.map((crime) => (
            <Marker
              key={crime.id}
              coordinate={crime.location}
              title={crimeTypes[crime.type].label}
              pinColor={crimeTypes[crime.type].color}
            />
          ))}
        </MapView>
        </View>

        {/* Container dos filtros logo abaixo do mapa */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Local:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite um endereço ou bairro..."
            placeholderTextColor="#aaa"
            value={location}
            onChangeText={setLocation}
            onSubmitEditing={handleLocationSearch} // Aciona a busca ao confirmar
          />

          <Text style={styles.filterTitle}>Filtrar por tipo de crime</Text>
        <RNPickerSelect
          onValueChange={handleCrimeChange}
          placeholder={{ label: "Selecione um tipo de crime...", value: null }}
          items={Object.keys(crimeTypes).map((key) => ({ label: crimeTypes[key].label, value: key }))}
          style={pickerSelectStyles}
        />

          <Text style={[styles.filterTitle, { marginBottom: 5, marginTop: -15}]}>Intervalo de tempo</Text>
        <View style={styles.dateFilterRow}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Início</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setStartDatePickerVisible(true)}>
              <Text style={styles.dateButtonText}>{startDate ? startDate.toLocaleDateString('pt-BR') : 'Selecione'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Fim</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setEndDatePickerVisible(true)}>
              <Text style={styles.dateButtonText}>{endDate ? endDate.toLocaleDateString('pt-BR') : 'Selecione'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </View>

      {isStartDatePickerVisible && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()} // Não permite selecionar datas futuras
          onChange={(event, selectedDate) => {
            setStartDatePickerVisible(false); // Fecha o seletor em ambas as plataformas
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      {isEndDatePickerVisible && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          minimumDate={startDate || undefined} // Não permite selecionar data anterior ao início
          onChange={(event, selectedDate) => {
            setEndDatePickerVisible(false); // Fecha o seletor em ambas as plataformas
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.bottomButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Report')}>
          <Text style={styles.bottomButtonText}>Reportar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  mapContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  filterContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    marginTop: 15, // Espaço entre o mapa e os filtros
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: 'center',
  },
  mapWrapper: {
    width: "100%",
    height: 280, // Diminuí a altura do mapa
    borderRadius: 15,
    overflow: "hidden", // Garante que o mapa fique dentro das bordas arredondadas
    borderWidth: 1,
    borderColor: '#ddd',
  },
  content: {
    flex: 1,
    padding: 15,
    paddingBottom: 10,
  },  
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateFilterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateColumn: {
    width: "48%",
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dateButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  input: {
    width: '100%',
    height: 40, // Diminuí a altura do input
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
  },
  bottomButtonsContainer: {
    position: 'absolute', // Fixa o container na tela
    bottom: 80, // 80dp acima da parte inferior
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bottomButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1, // Faz os botões ocuparem o espaço disponível
    marginHorizontal: 5, // Adiciona uma pequena margem entre eles
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    marginBottom: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    marginBottom: 20,
  },
});