import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUser } from '../hooks/useUser';

export default function ProfileEditScreen({ navigation }) {
  const { user, loading: userLoading } = useUser();

  const [avatarSource, setAvatarSource] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [email, setEmail] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (user) {
      // O backend retorna 'name', vamos dividi-lo
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      // Se o usuário tiver uma foto, use-a
      if (user.photo) {
        setAvatarSource({ uri: user.photo });
      }
    }
  }, [user]);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setAvatarSource(source);
      }
    });
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setDatePickerVisible(Platform.OS === 'ios');
    setDob(currentDate);
  };

  if (userLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.centered} onPress={handleChoosePhoto}>
          <Image
            source={
              avatarSource
                ? avatarSource
                : require('../../assets/images/guy_example.jpg')
            }
            style={styles.avatar} />
          <Text style={styles.updatePicText}>Alterar foto de perfil</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
          <Text style={styles.label}>Sobrenome</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
          <Text style={styles.label}>Data de Nascimento</Text>
          <TouchableOpacity style={styles.input} onPress={() => setDatePickerVisible(true)}>
            <Text>{dob.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Email de Contato</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isDatePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dob}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()} // Não permite selecionar datas futuras
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  scroll: { padding: 20, paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 30 },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 5,
  },
  centered: { alignItems: 'center', marginVertical: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  updatePicText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#007bff',
    marginBottom: 20,
  },
  form: { marginTop: 10, paddingHorizontal: 10 },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    justifyContent: 'center', // Para o TouchableOpacity da data
  },
  button: { backgroundColor: '#111', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});