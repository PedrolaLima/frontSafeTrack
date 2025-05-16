import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AppLayout from '../components/AppLayout';

export default function ProfileScreen({ navigation }) {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [dob, setDob] = useState('25-09-1990');
  const [email, setEmail] = useState('john.doe@mail.com');

  return (
    <AppLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.title}>Safety Profile</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.centered}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256&facepad=2.5' }}
              style={styles.avatar}
            />
            <Text style={styles.updatePic}>Update profile picture</Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>First name</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
            <Text style={styles.label}>Last name</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
            <Text style={styles.label}>Date of birth</Text>
            <TextInput style={styles.input} value={dob} onChangeText={setDob} />
            <Text style={styles.label}>Contact email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Apply changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Icon name="user" size={24} />
          <Icon name="monitor" size={24} />
          <Icon name="bell" size={24} />
        </View>
      </SafeAreaView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  scroll: { padding: 20, paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 20 },
  backBtn: { backgroundColor: '#111', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 20 },
  backText: { color: '#fff', fontSize: 16 },
  centered: { alignItems: 'center', marginVertical: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  updatePic: { fontWeight: 'bold', fontSize: 14, marginBottom: 10 },
  form: { marginTop: 10 },
  label: { fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 4, padding: 10, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: '#111', borderRadius: 4, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, left: 0, right: 0 }
});