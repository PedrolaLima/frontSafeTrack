import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function PickerSelectBairro({ 
  value, 
  onValueChange, 
  items, 
  placeholder 
}) {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");

  React.useEffect(() => {
    const selected = items.find(item => item.value === value);
    setSelectedLabel(selected?.label || placeholder?.label || "");
  }, [value, items, placeholder]);

  if (Platform.OS === "ios") {
    // Para iOS, use um Modal customizado
    const isPlaceholder = !value;
    
    return (
      <>
        <TouchableOpacity 
          style={styles.iosPicker}
          onPress={() => setShowModal(true)}
        >
          <Text style={[styles.iosPickerText, isPlaceholder && styles.iosPickerPlaceholder]}>
            {selectedLabel || placeholder?.label}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Selecione um Bairro</Text>
                <View style={{ width: 60 }} />
              </View>

              <FlatList
                data={items}
                keyExtractor={(item) => String(item.value)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      value === item.value && styles.modalItemSelected
                    ]}
                    onPress={() => {
                      onValueChange(item.value);
                      setShowModal(false);
                    }}
                  >
                    <Text 
                      style={[
                        styles.modalItemText,
                        value === item.value && styles.modalItemTextSelected
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  } else {
    // Para Android, use RNPickerSelect
    return (
      <RNPickerSelect
        onValueChange={onValueChange}
        value={value}
        placeholder={placeholder}
        items={items}
        style={pickerSelectStyles}
        useNativeDriver={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  // iOS Picker Styles
  iosPicker: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
  },
  iosPickerText: {
    fontSize: 16,
    color: "#333",
  },
  iosPickerPlaceholder: {
    color: "#aaa",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },

  // Modal Items
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemSelected: {
    backgroundColor: "#f0f0f0",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalItemTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    marginBottom: 15,
    backgroundColor: "#fff",
    height: 50,
  },
});