import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

const crimeTypes = [
  { label: 'Roubo', value: 'roubo' },
  { label: 'Furto', value: 'furto' },
  { label: 'Assalto à mão armada', value: 'assalto' },
  { label: 'Vandalismo', value: 'vandalismo' },
  { label: 'Outro', value: 'outro' },
];

export default function ReportFormScreen({ navigation, route }) {
  const { coordinate } = route.params; // Recebe a coordenada da tela do mapa
  const insets = useSafeAreaInsets();

  const [crimeType, setCrimeType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [description, setDescription] = useState('');

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const handleReport = () => {
    if (!crimeType || !description) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha o tipo de crime e a descrição.');
      return;
    }
    // Lógica para enviar o reporte para a API
    console.log({
      coordinate,
      crimeType,
      date,
      time,
      description,
    });
    Alert.alert('Sucesso', 'Seu reporte foi enviado com sucesso!');
    navigation.popToTop(); // Volta para a tela inicial da pilha
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de Crime</Text>
          <RNPickerSelect
            onValueChange={(value) => setCrimeType(value)}
            items={crimeTypes}
            placeholder={{ label: 'Selecione o tipo de ocorrência...', value: null }}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Data do Ocorrido</Text>
          <TouchableOpacity style={styles.input} onPress={() => setDatePickerVisible(true)}>
            <Text>{date.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Horário do Ocorrido</Text>
          <TouchableOpacity style={styles.input} onPress={() => setTimePickerVisible(true)}>
            <Text>{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva o que aconteceu..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Anexar Mídia (Opcional)</Text>
          <TouchableOpacity style={styles.mediaButton}>
            <Icon name="paperclip" size={20} color="#333" />
            <Text style={styles.mediaButtonText}>Adicionar foto ou vídeo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleReport}>
          <Text style={styles.submitButtonText}>Reportar</Text>
        </TouchableOpacity>
      </ScrollView>
      {isDatePickerVisible && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setDatePickerVisible(Platform.OS === 'ios');
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 5 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    transform: [{ translateX: -15 }],
  },
  scrollContainer: { padding: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
  },
  textArea: { height: 120, textAlignVertical: 'top', paddingTop: 15 },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9e9e9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
  },
  mediaButtonText: { marginLeft: 10, fontSize: 16, color: '#333' },
  submitButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

const pickerSelectStyles = {
  inputIOS: {
    ...styles.input,
  },
  inputAndroid: {
    ...styles.input,
  },
};