import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform 
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePickerModal({ 
  value, 
  onDateChange, 
  visible, 
  onClose,
  title = "Selecione a data",
  minimumDate,
  maximumDate,
  mode = "date"
}) {
  if (Platform.OS === "ios") {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.datePickerButton}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.datePickerTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.datePickerButton, { color: '#007AFF' }]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerWrapper}>
              <DateTimePicker
                value={value || new Date()}
                mode={mode}
                display="spinner"
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                textColor="#000"
                onChange={(event, date) => {
                  if (date) {
                    onDateChange(date);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  } else {
    return visible ? (
      <DateTimePicker
        value={value || new Date()}
        mode={mode}
        display="default"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={(event, date) => {
          onClose();
          if (date) {
            onDateChange(date);
          }
        }}
      />
    ) : null;
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  datePickerButton: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  datePickerWrapper: {
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
