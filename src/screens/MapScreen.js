import React, { useState, useRef, useEffect} from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,  
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polygon } from "react-native-maps";
import RNPickerSelect from "react-native-picker-select";
import HamburgerMenu from "../components/HamburgerMenu"; 
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAllMarkers, getUserProfile, getBairroCentro, getBairroPolygon, getAllBairros } from "../api/index";

const DEFAULT_REGION = {
  latitude: -23.6329618,
  longitude: -46.5340334,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const crimeTypes = {
  ROUBO: { label: "Roubo", color: "yellow" },
  FURTO: { label: "Furto", color: "orange" },
  ASSALTO: { label: "Assalto à mão armada", color: "red" },
  VANDALISMO: { label: "Vandalismo", color: "blue" },
  OUTRO: { label: "Outro", color: "gray" },
};

export default function MapScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  // --- Map and Filter States ---
  const [mapRegion, setMapRegion] = useState(DEFAULT_REGION);
  const [allMarkers, setAllMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [selectedCrime, setSelectedCrime] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  // --- Neighbor States ---
  const [userBairroId, setUserBairroId] = useState(null);
  const [userBairroPolygon, setUserBairroPolygon] = useState([]);
  const [bairrosList, setBairrosList] = useState([]);
  const [selectedBairroId, setSelectedBairroId] = useState(null);


  async function loadMarkers() {
    try {
        const markers = await getAllMarkers();
        setAllMarkers(markers);
        setFilteredMarkers(markers);
    } catch(e) {
        Alert.alert("Erro", "Não foi possível carregar os marcadores de crime.");
    }
  }

  /**
   * @description Load user profile, bairro list, polygon and centroide
   */
  useEffect(() => {
    async function loadUserData() {
      try {
        const profile = await getUserProfile();
        const bairroId = profile.bairroId;
        
        if (bairroId) {
          setUserBairroId(bairroId);
          setSelectedBairroId(bairroId);
          
          // load centroide
          const centroide = await getBairroCentro(bairroId);
          const initialCenter = {
            latitude: centroide.lat,
            longitude: centroide.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.01,
          };
          setMapRegion(initialCenter);

          // load polygon
          const polygonData = await getBairroPolygon(bairroId);
          if (polygonData) {
            const coordinates = convertGeoJsonToMapCoordinates(polygonData);
            setUserBairroPolygon(coordinates);
          }
        }

        // load bairro combobox
        const bairros = await getAllBairros();
        
        // sort
        bairros.sort((a, b) => {
            const cidadeCompare = a.cidade.localeCompare(b.cidade);
            if (cidadeCompare !== 0) {
                return cidadeCompare;
            }
            return a.name.localeCompare(b.name);
        });

        const bairroOptions = bairros.map(b => ({ 
            label: `${b.name} - ${b.cidade}`, 
            value: b.id 
        }));

        setBairrosList(bairroOptions);

      } catch (error) {
        console.error("Erro ao carregar dados do usuário/bairro:", error);
        setMapRegion(DEFAULT_REGION);
      }
    }

    loadUserData();
    loadMarkers();
  }, []);

  // --- Load new marker ---
  useEffect(() => {
      if (route.params?.newMarker) {
          const { latitude, longitude, reload } = route.params.newMarker;
          
          mapRef.current?.animateToRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
          }, 1000);

          if (reload) {
            loadMarkers();
          }

          navigation.setParams({ newMarker: undefined });
      }
  }, [route.params?.newMarker]);


  // --- handlers and filters ---

  const handleBairroChange = async (bairroId) => {
    setSelectedBairroId(bairroId);
    if (!bairroId) {
        setMapRegion(DEFAULT_REGION);
        return;
    }

    try {
        const centroide = await getBairroCentro(bairroId);
        mapRef.current?.animateToRegion({
            latitude: centroide.lat,
            longitude: centroide.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.01,
        }, 1000);
    } catch (error) {
        Alert.alert("Erro", "Não foi possível centralizar o bairro.");
    }
  };


  const handleCrimeChange = (value) => {
    setSelectedCrime(value);
  };

  const handleDateChange = (type, event, selectedDate) => {
    type === 'start' ? setStartDatePickerVisible(false) : setEndDatePickerVisible(false);
    if (selectedDate) {
      type === 'start' ? setStartDate(selectedDate) : setEndDate(selectedDate);
    }
  };

  /**
   * @description Filters (Crimes and Datas).
   */
  useEffect(() => {
    let tempMarkers = allMarkers;

    if (selectedCrime) {
      tempMarkers = tempMarkers.filter((m) => m.category === selectedCrime);
    }

    if (startDate) {
      tempMarkers = tempMarkers.filter((m) => new Date(m.dateTime) >= startDate);
    }

    if (endDate) {
        const endDay = new Date(endDate);
        endDay.setDate(endDay.getDate() + 1);

        tempMarkers = tempMarkers.filter((m) => new Date(m.dateTime) <= endDay);
    }
    
    setFilteredMarkers(tempMarkers);
  }, [selectedCrime, startDate, endDate, allMarkers]);

  const convertGeoJsonToMapCoordinates = (geoJson) => {
    const coordinates = geoJson.coordinates;
    const allPolygonsCoordinates = [];

    if (geoJson.type === 'MultiPolygon') {
        for (const polygon of coordinates) {
            const outerRing = polygon[0]; 

            const mapCoordinates = outerRing.map(coord => ({
                latitude: coord[1],
                longitude: coord[0]
            }));
            allPolygonsCoordinates.push(mapCoordinates);
        }
    } else if (geoJson.type === 'Polygon') {
        const outerRing = coordinates[0];
        
        const mapCoordinates = outerRing.map(coord => ({
            latitude: coord[1],
            longitude: coord[0]
        }));
        allPolygonsCoordinates.push(mapCoordinates);
    }

    return allPolygonsCoordinates;
  };

  return (
    <View style={styles.screenContainer}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <HamburgerMenu />
        <Text style={styles.headerTitle}>SafeTrack</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.mapWrapper}>
          <MapView
            key={mapRegion.latitude}
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={mapRegion}
          >
            {/* MULTIPOLYGON */}
            {userBairroPolygon.map((polygonCoords, index) => (
                <Polygon
                    key={index}
                    coordinates={polygonCoords} // array {lat, lng}
                    strokeWidth={3}
                    strokeColor="rgba(211, 47, 47, 0.8)"
                    fillColor="rgba(211, 47, 47, 0.1)"
                />
            ))}

            {filteredMarkers.map((m) => (
              <Marker
                key={m.id}
                coordinate={{ latitude: m.latitude, longitude: m.longitude }}
                title={m.title}
                description={m.description}
                pinColor={crimeTypes[m.category]?.color || "red"}
              />
            ))}
          </MapView>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Bairro:</Text>
          <RNPickerSelect
            onValueChange={handleBairroChange}
            value={selectedBairroId}
            placeholder={{ label: "Selecione um bairro...", value: null }}
            items={bairrosList}
            style={pickerSelectStyles}
          />

          <Text style={styles.filterTitle}>Tipo de crime:</Text>
          <RNPickerSelect
            onValueChange={handleCrimeChange}
            value={selectedCrime}
            placeholder={{ label: "Selecione um tipo de crime...", value: null }}
            items={Object.keys(crimeTypes).map((key) => ({
              label: crimeTypes[key].label,
              value: key
            }))}
            style={pickerSelectStyles}
          />

          <Text style={[styles.filterTitle, { marginBottom: 5, marginTop: -15 }]}>Intervalo de tempo:</Text>
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

      {/* DATE PICKERS */}
      {isStartDatePickerVisible && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, date) => handleDateChange('start', event, date)}
        />
      )}
      {isEndDatePickerVisible && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          minimumDate={startDate || undefined}
          maximumDate={new Date()}
          onChange={(event, date) => handleDateChange('end', event, date)}
        />
      )}

      {/* BOTÕES INFERIORES */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: '#444' }]} onPress={() => navigation.navigate('Home')}>
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
  screenContainer: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingBottom: 8, backgroundColor: "#fff" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#000", textAlign: 'center' },
  content: { flex: 1, padding: 15, paddingBottom: 10 },
  mapWrapper: { width: "100%", height: 280, borderRadius: 15, overflow: "hidden", borderWidth: 1, borderColor: '#ddd' },
  map: { ...StyleSheet.absoluteFillObject },
  filterContainer: { backgroundColor: "white", padding: 15, borderRadius: 10, elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, marginTop: 15 },
  filterTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  dateFilterRow: { flexDirection: "row", justifyContent: "space-between" },
  dateColumn: { width: "48%" },
  dateLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  dateButton: { backgroundColor: "#e0e0e0", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
  dateButtonText: { color: "#333", fontWeight: "500" },
  bottomButtonsContainer: { bottom: 30, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  bottomButton: { backgroundColor: '#D32F2F', borderRadius: 8, paddingVertical: 12, alignItems: 'center', flex: 1, marginHorizontal: 5 },
  bottomButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: "gray", borderRadius: 4, color: "black", paddingRight: 30, marginBottom: 15 },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 0.5, borderColor: "purple", borderRadius: 8, color: "black", paddingRight: 30, marginBottom: 15 },
});