import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AppLayout from '../components/AppLayout';
import HamburgerMenu from '../components/HamburgerMenu';

export default function ProfileViewScreen({ navigation }) {
  // Dados fictícios
  const user = {
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    firstName: 'John',
    lastName: 'Doe',
    dob: '25-09-1990',
    email: 'john.doe@mail.com',
  };

  return (
    <AppLayout>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <HamburgerMenu />
          <Text style={styles.logo}>SafeTrack</Text>
          <View style={{ width: 28 }} />
        </View>
        {/* Espaço maior entre header e título */}
        <View style={{ height: 28 }} />
        <Text style={styles.profileTitle}>Meu Perfil</Text>
        {/* Espaço maior abaixo do título */}
        <View style={{ height: 18 }} />
        <View style={styles.centered}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.info}>Nascimento: {user.dob}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ProfileEdit')}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {/* lógica de remoção do perfil */}}
          >
            <Text style={styles.removeButtonText}>Remover Perfil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f6f6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    position: 'relative', 
  },
  logo: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#111',
    zIndex: 0,
  },
  profileTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    color: '#222',
    marginTop: 70,
  },
  centered: {
    alignItems: 'center',
    marginBottom: 36,
    width: '100%', // garante centralização em telas largas
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 18,
    marginTop: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  buttonsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 10,
    width: '100%',
  },
  editButton: {
    backgroundColor: '#111',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginBottom: 10,
    minWidth: 120,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  removeButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d32f2f',
    minWidth: 120,
  },
  removeButtonText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 15,
  },
});