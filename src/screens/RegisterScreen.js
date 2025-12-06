import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert 
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { createUser, getAllBairros } from "../api/index";
import { useUser } from "../hooks/useUser";
import PickerSelectBairro from "../components/PickerSelectBairro";

export default function RegisterScreen({ navigation }) {
  const { user } = useUser(); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bairroId, setBairroId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bairrosList, setBairrosList] = useState([]);

  const isAdmin = user?.role === "ADMIN";
  
  useEffect(() => {
    async function loadBairros() {
      try {
        const bairros = await getAllBairros();
        
        // sort
        bairros.sort((a, b) => {
            const cidadeCompare = a.cidade.localeCompare(b.cidade);
            if (cidadeCompare !== 0) {
                return cidadeCompare;
            }
            return a.name.localeCompare(b.name);
        });

        const bairroOptions = bairros.map(b => ({ 
            label: `${b.name} - ${b.cidade}`, 
            value: b.id 
        }));

        setBairrosList(bairroOptions);
      } catch (error) {
        console.error("Erro ao carregar bairros:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de bairros.");
      }
    }

    loadBairros();
  }, []);
  
  const validate = () => {

    if (!name || name.length < 3) {
      Alert.alert("Erro","Nome deve ter ao menos 3 caracteres.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      return Alert.alert("Erro","E-mail inválido.");
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const dto = {
      name,
      email,
      password,
      role: isAdmin ? "REPRESENTANTE" : undefined,
      bairroId: isAdmin ? Number(bairroId) : undefined
    };

    try {
      await createUser(dto, user.role);
      Alert.alert("Sucesso!", "Usuário cadastrado com sucesso!");
      
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setBairroId("");

      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao cadastrar usuário.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logos/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>
        {isAdmin ? "Cadastrar Representante" : "Cadastrar Morador"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          {isAdmin ? "Representante" : "Morador"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {isAdmin && (
          <>
            <PickerSelectBairro
              value={bairroId}
              onValueChange={setBairroId}
              items={bairrosList}
              placeholder={{ label: "Selecione um bairro...", value: null }}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, styles.loginButtonText]}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>© 2023 SafeTrack. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 20 },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loginButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#000" },
  loginButtonText: { color: "#000" },
  footer: { marginTop: 20, fontSize: 12, color: "#aaa" },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: "gray", borderRadius: 4, color: "black", paddingRight: 30, marginBottom: 15 },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 0.5, borderColor: "purple", borderRadius: 8, color: "black", paddingRight: 30, marginBottom: 15 },
});
