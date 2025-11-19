import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useUser } from '../hooks/useUser';
import { createMarker, getUserProfile } from '../api/index';

// Enum crimeType
const CRIME_TYPES_OPTIONS = [
  { label: 'Roubo', value: 'ROUBO' },
  { label: 'Furto', value: 'FURTO' },
  { label: 'Assalto à Mão Armada', value: 'ASSALTO' },
  { label: 'Vandalismo', value: 'VANDALISMO' },
  { label: 'Outro', value: 'OUTRO' },
];

export default function ReportFormScreen({ navigation, route }) {
  const { latitude, longitude } = route.params; 
  const { user } = useUser();
  const [loadingUserBairro, setLoadingUserBairro] = useState(true);

  // form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: null,
    dateTime: new Date(),
  });
  
  const [userBairroId, setUserBairroId] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    async function loadUserBairroId() {
        try {
            const profile = user?.bairroId ? user : await getUserProfile();
            
            if (profile?.bairroId) {
                setUserBairroId(profile.bairroId);
            } else {
                Alert.alert("Erro", "Não foi possível identificar seu bairro. Relatório negado.");
                navigation.goBack();
            }
        } catch (error) {
            console.error("Erro ao buscar bairro do usuário:", error);
            Alert.alert("Erro", "Falha ao carregar dados do usuário.");
            navigation.goBack();
        } finally {
            setLoadingUserBairro(false);
        }
    }

    loadUserBairroId();
  }, [user, navigation]);

  // handlers
  
  const handlePickerChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      const currentTime = form.dateTime;
      newDate.setHours(currentTime.getHours());
      newDate.setMinutes(currentTime.getMinutes());
      handlePickerChange('dateTime', newDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newTime = new Date(selectedTime);
      const currentDate = form.dateTime;
      currentDate.setHours(newTime.getHours());
      currentDate.setMinutes(newTime.getMinutes());
      handlePickerChange('dateTime', currentDate); 
    }
  };

  const handleReport = async () => {
    if (!form.title.trim() || !form.category || !form.description.trim()) {
      Alert.alert('Campos Obrigatórios', 'Preencha o tipo de crime, descrição e o Título/Endereço.'); 
      return;
    }

    if (form.description.trim().length < 10) {
      Alert.alert('Descrição Incompleta', 'A descrição deve ter pelo menos 10 caracteres.');
      return;
    }

    if (!user?.id || !userBairroId) {
      Alert.alert("Erro de Dados", "Dados de usuário/bairro não encontrados.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      dateTime: form.dateTime.toISOString(),
      latitude,
      longitude,
      userId: user.id,
      bairroId: userBairroId,
    };
    
    try {
      await createMarker(payload);
      Alert.alert("Sucesso", "Ocorrência registrada!");
      
      navigation.navigate("Map", { newMarker: { latitude, longitude, reload: true } }); 
      
    } catch (err) {
      const message = err.message || "Ocorreu um erro ao registrar.";
      Alert.alert("Erro no Registro", message);
    }
  };

  const selectedCategoryLabel = useMemo(() => {
    return CRIME_TYPES_OPTIONS.find(c => c.value === form.category)?.label;
  }, [form.category]);

  if (loadingUserBairro) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d32f2f" />
            <Text style={{ marginTop: 10 }}>Validando seu bairro...</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportar Ocorrência</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* SUBTÍTULO */}
        {selectedCategoryLabel && (
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>{selectedCategoryLabel}</Text>
          </View>
        )}

        {/* Tipo de Crime */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>* Tipo de Crime</Text>
          <RNPickerSelect
            onValueChange={(value) => handlePickerChange('category', value)}
            value={form.category}
            items={CRIME_TYPES_OPTIONS}
            placeholder={{ label: 'Selecione o tipo de crime...', value: null }}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>* Título (Ex: Vandalismo...)</Text>
          <TextInput
            style={styles.input}
            value={form.title}
            onChangeText={(text) => handlePickerChange('title', text)}
            placeholder="Digite o título para a ocorrência"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>* Data da Ocorrência</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{form.dateTime.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>* Horário Aproximado</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
            <Text>{form.dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>* Descrição (mín. 10, máx. 250 caracteres)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(text) => handlePickerChange('description', text)}
            multiline
            maxLength={250}
            placeholder="Descreva a ocorrência em detalhes (o que, quando, como, quem estava envolvido)."
            placeholderTextColor="#aaa"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleReport}
          disabled={!form.category || form.description.trim().length < 10 || !form.title.trim()} 
        >
          <Text style={styles.submitButtonText}>Confirmar e Enviar</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={form.dateTime}
          mode="date"
          maximumDate={new Date()} // denies future datas
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={form.dateTime}
          mode="time"
          is24Hour
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' },
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff'
  },
  backButton: { padding: 5 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  scrollContainer: { padding: 20, paddingBottom: 90 },
  subtitleContainer: { marginBottom: 25, alignItems: 'center' },
  subtitleText: { fontSize: 20, fontWeight: '700', color: '#d32f2f' },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
    color: '#333'
  },
  textArea: { height: 120, paddingTop: 12, textAlignVertical: 'top' },
  footer: { padding: 15, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  submitButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

const pickerSelectStyles = {
  inputIOS: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    color: '#333'
  },
  inputAndroid: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    color: '#333'
  }
};