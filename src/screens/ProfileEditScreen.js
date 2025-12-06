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
  Alert,  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import DatePickerModal from '../components/DatePickerModal';
import { useUser } from '../hooks/useUser';

export default function ProfileEditScreen({ navigation }) {
  const { user, loading: userLoading } = useUser();

  const roleImages = {
    ADMIN: require("../../assets/images/icons/admin.png"),
    REPRESENTANTE: require("../../assets/images/icons/leader.png"),
    USER: require("../../assets/images/icons/user.png"),
  };
  const imageSource = user?.photo ? { uri: user.photo } : roleImages[user?.role];

  const [avatarSource, setAvatarSource] = useState(imageSource);
  const [name, setName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarSource(imageSource);
    }
  }, [user, imageSource]);

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

  const handleSaveChanges = async () => {
    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      Alert.alert(
        'Campos de senha incompletos',
        'Para alterar a senha, você deve preencher tanto a senha atual como a nova senha.'
      );
      return;
    }

    setIsSaving(true);

    const updateData = {
      name: name,
      email: email,
    };

    if (currentPassword && newPassword) {
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }

    try {
      // TODO: Implementar a chamada da API para o backend aqui
      console.log('Salvando dados:', updateData);
      // Simular uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // A lógica de verificação da senha atual será feita no backend.
      // Se a chamada for bem-sucedida:
      Alert.alert('Sucesso', 'Seu perfil foi atualizado.');
      navigation.goBack();

    } catch (error) {
      // Se o backend retornar um erro (ex: senha atual incorreta)
      Alert.alert('Erro ao Salvar', error.message || 'Não foi possível atualizar o perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const onDateChange = (selectedDate) => {
    setDob(selectedDate);
    setDatePickerVisible(false);
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
            source={avatarSource || roleImages[user?.role]}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text style={styles.label}>Data de Nascimento</Text>
          <TouchableOpacity style={styles.input} onPress={() => setDatePickerVisible(true)}>
            <Text>{dob.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Email de Contato</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={styles.label}>Senha Atual</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="Deixe em branco para não alterar"
          />
          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Deixe em branco para não alterar"
          />

          <TouchableOpacity style={styles.button} onPress={handleSaveChanges} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isDatePickerVisible && (
        <DatePickerModal
          visible={isDatePickerVisible}
          onClose={() => setDatePickerVisible(false)}
          value={dob}
          onDateChange={onDateChange}
          title="Selecione sua data de nascimento"
          maximumDate={new Date()}
          mode="date"
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