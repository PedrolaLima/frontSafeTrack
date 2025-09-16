import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import HamburgerMenu from "../components/HamburgerMenu";

const { width } = Dimensions.get("window");

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const markers = [
    { latitude: -23.55052, longitude: -46.633308 },
    { latitude: -23.56052, longitude: -46.643308 },
    { latitude: -23.54052, longitude: -46.623308 },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <HamburgerMenu />
        <Text style={styles.logo}>SafeTrack</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {markers.map((m, i) => (
            <Marker
              key={i}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              pinColor="red"
            />
          ))}
        </MapView>
      </View>
      {/* ...restante do seu layout... */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
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
    marginTop: 20,
    fontSize: 20,
    color: "#111",
    zIndex: 0,
  },
  mapContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 10,
    height: 300,
    backgroundColor: "#eee",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
