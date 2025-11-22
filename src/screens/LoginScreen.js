import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { login } from '../api';
import { saveToken } from "../utils/secureStore";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
        const checkTokenAndRedirect = async () => {
            const token = await getToken();
            
            if (token) {
                navigation.goBack(); 
            }
        };

        checkTokenAndRedirect();
    }, [navigation]);

  const validate = () => {
    setError('');
    if (!email.includes("@") || !email.includes(".")) {
      setError("Email inválido.");
      return false;
    }

    if (!password || password.length < 4 || password.length > 20) {
      setError("Senha deve ter entre 4 a 20 caracteres.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setError(''); 
      
      const data = await login(email, password);

      await saveToken(data.access_token);

      console.log("Token salvo!");

      if (data.message) {
        navigation.navigate('Welcome', { firstLoginMessage: data.message });
      } 
      else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }

    } catch (err) {
      console.log('Erro de Login:', err.message);
      setError(err.message || "Falha desconhecida ao tentar logar.");
    } finally {
      setLoading(false);
    }
};

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logos/logo.png')} style={styles.logo} />
      <Text style={styles.brand}>SafeTrack</Text>
      <Text style={styles.title}>Login</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Logar</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
        </TouchableOpacity>
        
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Logar</Text>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>© 2023 SafeTrack. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  brand: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  forgotPassword: {
    color: '#007BFF',
    textAlign: 'right',
    marginBottom: 15,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  registerButtonText: {
    color: '#000',
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: '#aaa',
  },
});