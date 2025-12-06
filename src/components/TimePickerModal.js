import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform,
  ScrollView
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TimePickerModal({ 
  value, 
  onTimeChange, 
  visible, 
  onClose,
  title = "Selecione a hora",
  is24Hour = true
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
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.timePickerButton}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.timePickerTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.timePickerButton, { color: '#007AFF' }]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.timePickerWrapper}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            >
              <DateTimePicker
                value={value || new Date()}
                mode="time"
                display="spinner"
                is24Hour={is24Hour}
                textColor="#000"
                onChange={(event, date) => {
                  if (date) {
                    onTimeChange(date);
                  }
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  } else {
    return visible ? (
      <DateTimePicker
        value={value || new Date()}
        mode="time"
        display="default"
        is24Hour={is24Hour}
        onChange={(event, date) => {
          onClose();
          if (date) {
            onTimeChange(date);
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
  timePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '90%',
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timePickerButton: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  timePickerWrapper: {
    backgroundColor: '#fff',
    minHeight: 250,
    maxHeight: 400,
  },
});