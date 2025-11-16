import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ route, navigation }) {
  const firstLoginMessage = route?.params?.firstLoginMessage;
  const handleContinue = () => {
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/backgrounds/city.png')} 
        style={styles.image}
      />
      {firstLoginMessage && (
        <Text style={styles.messageBox}>
          {firstLoginMessage}
        </Text>
      )}

      <Text style={styles.title}>Bem-vindo ao SafeTrack!</Text>

      <Text style={styles.description}>
        <Text style={styles.bold}>🌟 Reporte crimes</Text> e ajude a tornar sua comunidade mais segura.{"\n"}
        <Text style={styles.bold}>🛡️ Compartilhe informações confiáveis</Text> com outros usuários.{"\n"}
        <Text style={styles.bold}>🗺️ Descubra locais seguros</Text> no mapa e planeje seus trajetos com tranquilidade.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
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
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 10,
  },

  messageBox: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
