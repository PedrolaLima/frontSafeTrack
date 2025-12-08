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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useUser } from '../hooks/useUser';
import { changePassword } from '../api/index';
const MIN_PASSWORD_LENGTH = 5;

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
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
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

  const isPasswordValid = newPassword.length >= MIN_PASSWORD_LENGTH;
  const isSameCurrentPassword = newPassword === currentPassword;
  const passwordsMatch = newPassword === confirmNewPassword;
  
  const validatePasswordFields = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        Alert.alert('Campos Incompletos', 'Para alterar a senha, preencha a Senha Atual, a Nova Senha e a Confirmação.');
        return false;
    }

    if(isSameCurrentPassword){
      Alert.alert('Erro de Senha', `A nova senha é a mesma que a atual.`);
      return false;
    }

    if (!isPasswordValid) {
      Alert.alert('Erro de Senha', `A nova senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
      return false;
    }

    if (!passwordsMatch) {
        Alert.alert('Erro de Senha', 'A Nova Senha e a Confirmação não coincidem.');
        return false;
    }

    
    return true;
  };

  const isSaveButtonEnabled = 
    isSaving === false && 
    !!currentPassword && 
    !!newPassword && 
    !!confirmNewPassword &&
    isPasswordValid &&
    passwordsMatch;


  const handleSaveChanges = async () => {
    
    const changingPassword = !!currentPassword || !!newPassword || !!confirmNewPassword;

    if (changingPassword && !validatePasswordFields()) {
      return; 
    }

    if (!changingPassword) {
        Alert.alert('Aviso', 'Nenhuma alteração de senha detectada. Voltando...');
        navigation.goBack();
        return;
    }

    setIsSaving(true);
    let passwordChangeSuccess = true;

    if (user) {
      try {
        await changePassword(email,currentPassword, newPassword);
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword(''); 

      } catch (error) {
        Alert.alert('Erro ao Alterar Senha', error.message || 'Não foi possível alterar a senha. Verifique sua senha atual.');
        passwordChangeSuccess = false;
      }
    }
    
    setIsSaving(false);
    
    if (passwordChangeSuccess) {
      Alert.alert('Sucesso', 'Sua senha foi atualizada.');
      navigation.goBack();
    }
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

  const readOnlyInputStyle = [styles.input, styles.readOnlyInput];

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
          <TextInput 
            style={readOnlyInputStyle} 
            value={name} 
            editable={false} // only read
            placeholder="Carregando nome..."
          />
          <Text style={styles.label}>Email de Contato</Text>
          <TextInput 
            style={readOnlyInputStyle} 
            value={email} 
            keyboardType="email-address"
            editable={false} // only read
            placeholder="Carregando email..."
          />
          
          <Text style={styles.passwordSectionTitle}>Alterar Senha</Text>

          <Text style={styles.label}>Senha Atual</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="Digite a senha atual"
          />
          
          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={[styles.input, (newPassword && !isPasswordValid) && styles.inputError]}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
          />
          {newPassword.length > 0 && !isPasswordValid && (
            <Text style={styles.errorText}>A nova senha deve ter no mínimo {MIN_PASSWORD_LENGTH} caracteres.</Text>
          )}

          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <TextInput
            style={[styles.input, (confirmNewPassword && !passwordsMatch) && styles.inputError]} // error
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry
            placeholder="Repita a nova senha"
          />
          {confirmNewPassword.length > 0 && !passwordsMatch && (
            <Text style={styles.errorText}>As senhas não coincidem.</Text>
          )}

          <TouchableOpacity 
            style={[styles.button, !isSaveButtonEnabled && styles.disabledButton]} 
            onPress={handleSaveChanges} 
            disabled={!isSaveButtonEnabled} 
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  
  form: { marginTop: 10, paddingHorizontal: 10 },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  passwordSectionTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#111',
      marginTop: 10,
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    justifyContent: 'center', 
  },
  readOnlyInput: { 
    backgroundColor: '#e9e9e9', 
    color: '#666',
    borderColor: '#ccc',
  },
  inputError: {
      borderColor: '#d32f2f',
      borderWidth: 2,
  },
  errorText: {
      color: '#d32f2f',
      fontSize: 13,
      marginTop: -15,
      marginBottom: 15,
      paddingHorizontal: 5,
  },
  button: { backgroundColor: '#111', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  disabledButton: {
      backgroundColor: '#aaa',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});