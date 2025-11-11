import React, { useState, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const crimeTypes = [
  { label: 'Roubo', value: 'roubo' },
  { label: 'Furto', value: 'furto' },
  { label: 'Assalto à mão armada', value: 'assalto' },
  { label: 'Vandalismo', value: 'vandalismo' },
  { label: 'Outro', value: 'outro' },
];

export default function ReportFormScreen({ navigation, route }) {
  const { coordinate } = route.params; // Recebe a coordenada da tela do mapa

  const [locationAddress, setLocationAddress] = useState('Carregando endereço...');
  const [neighborhood, setNeighborhood] = useState('');
  const [crimeType, setCrimeType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [description, setDescription] = useState('');

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!coordinate) return;

      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
          const best = data.results[0];
          const comp = best.address_components || [];

          const findByTypes = (types) => {
            const found = comp.find((c) => types.some((t) => c.types.includes(t)));
            return found ? found.long_name : null;
          };
          
          const foundNeighborhood = findByTypes(['sublocality_level_1', 'sublocality', 'neighborhood']);
          const city = findByTypes(['administrative_area_level_2', 'locality']);
          const streetNumber = findByTypes(['street_number']);
          const route = findByTypes(['route']);

          const parts = [];
          if (route) parts.push(route);
          if (streetNumber) parts.push(streetNumber);
          if (foundNeighborhood) parts.push(foundNeighborhood);
          if (city) parts.push(city);

          setNeighborhood(foundNeighborhood || city || '');
          const display = best.formatted_address || 'Endereço não encontrado';
          setLocationAddress(display);
        } else {
          setLocationAddress('Endereço não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        setLocationAddress('Erro ao buscar endereço');
      }
    };

    fetchAddress();
  }, [coordinate]);

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
      locationAddress,
    });
    Alert.alert('Sucesso', 'Seu reporte foi enviado com sucesso!');
    navigation.popToTop(); // Volta para a tela inicial da pilha
  };

  const getPageSubtitle = () => {
    if (!crimeType) {
      return null; // Não mostra nada se nenhum crime foi selecionado
    }
    const crimeLabel = crimeTypes.find(c => c.value === crimeType)?.label || 'Ocorrência';
    return `${crimeLabel} em ${neighborhood || '(Bairro)'}`;
  };

  const pageSubtitle = getPageSubtitle();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportar Ocorrência</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pageSubtitle && (
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>{pageSubtitle}</Text>
          </View>
        )}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de Crime</Text>
          <RNPickerSelect
            onValueChange={(value) => setCrimeType(value)}
            items={crimeTypes}
            placeholder={{ label: 'Selecione o tipo de ocorrência...', value: null }}
            style={pickerSelectStyles}
            Icon={() => {
              return <Icon name="chevron-down" size={20} color="gray" style={styles.pickerIcon} />;
            }}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Localização</Text>
          <View style={[styles.input, styles.disabledInput]}>
            <Text style={styles.locationText}>{locationAddress}</Text>
          </View>
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
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleReport}>
          <Text style={styles.submitButtonText}>Reportar</Text>
        </TouchableOpacity>
      </View>
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

      {isTimePickerVisible && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setTimePickerVisible(Platform.OS === 'ios');
            if (selectedTime) {
              setTime(selectedTime);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Alinha os itens nas extremidades e centro
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1, // Permite que o título ocupe o espaço central
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRightPlaceholder: {
    width: 24, // Garante que o título fique centralizado
    padding: 5,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10, // Reduz o padding superior para acomodar o subtítulo
    paddingBottom: 90, // Aumenta o padding inferior para não ser coberto pelo botão
  },
  subtitleContainer: {
    marginBottom: 25,
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
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
  disabledInput: {
    backgroundColor: '#f0f0f0', // Cor de fundo apagada
    borderColor: '#e0e0e0',
  },
  locationText: { fontSize: 16, color: '#666' }, // Cor de texto mais suave
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
  footer: {
    padding: 15,
    backgroundColor: '#f5f5f5', // Mesma cor de fundo para integrar
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerIcon: {
    top: 15,
    right: 15,
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

const pickerSelectStyles = {
  inputIOS: {
    ...styles.input,
  },
  inputAndroid: {
    ...styles.input,
    paddingRight: 30, // Garante que o texto não sobreponha o ícone
  },
};