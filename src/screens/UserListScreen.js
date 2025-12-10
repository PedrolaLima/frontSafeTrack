import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../hooks/useUser';
import { getAllUsers, getUsersByBairro, activateOrDeactivateUser } from '../api';

const UserListItem = React.memo(({ item, onActivateDeactivate }) => {
  const statusColor = item.active ? '#388E3C' : '#D32F2F';
  const statusText = item.active ? 'ATIVO' : 'INATIVO';
  const buttonText = item.active ? 'Desativar' : 'Ativar';
  
  const bairroName = item.bairro ? item.bairro.name : 'N/A';

  return (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        
        <Text style={styles.userRole}>Função: {item.role}</Text>
        <Text style={styles.userRole}>Bairro: {bairroName}</Text> 
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: item.active ? '#D32F2F' : '#388E3C' }]}
        onPress={() => onActivateDeactivate(item.id, item.active)}
      >
        <Text style={styles.actionButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
});


export default function UserListScreen() {
  const navigation = useNavigation();
  const { user } = useUser();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchData = useCallback(async () => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'REPRESENTANTE')) return;

    setLoading(true);
    try {
      let data = [];
      if (user.role === 'ADMIN') {
        data = await getAllUsers();
      } else if (user.role === 'REPRESENTANTE') {
        data = await getUsersByBairro();
      }
      const loggedUserId = user.id;

      const filteredData = data.filter(u => u.id !== loggedUserId);

      setUsers(filteredData);
      setFilteredUsers(filteredData);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar a lista de usuários.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // when list changes
  useEffect(() => {
    const lowercasedSearch = searchText.toLowerCase();
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(lowercasedSearch) ||
      u.email.toLowerCase().includes(lowercasedSearch) ||
      u.role.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);


  const handleActivateDeactivate = async (userId, isActive) => {
    const action = isActive ? 'desativar' : 'ativar';
    
    Alert.alert(
      `Confirmação`,
      `Você realmente deseja ${action} este usuário?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: 'destructive',
          onPress: async () => {
            try {
              await activateOrDeactivateUser(userId);
              
              Alert.alert('Sucesso', `Usuário ${action}do com sucesso.`);
              
              // update list
              setUsers(prevUsers => 
                prevUsers.map(u => 
                  u.id === userId ? { ...u, active: !isActive } : u
                )
              );

            } catch (error) {
              Alert.alert('Erro', error.message || `Não foi possível ${action} o usuário.`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && users.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#111" style={styles.loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciamento de Usuários</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FILTERS */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome, email ou função..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserListItem item={item} onActivateDeactivate={handleActivateDeactivate} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="users" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
            {user?.role === 'ADMIN' && <Text style={styles.emptyTextHint}>Verifique o filtro de busca.</Text>}
            {user?.role === 'REPRESENTANTE' && <Text style={styles.emptyTextHint}>Verifique os usuários cadastrados no seu bairro.</Text>}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 5 },
  title: { fontWeight: 'bold', fontSize: 18, textAlign: 'center', flex: 1 },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  
  listContent: { paddingHorizontal: 16, paddingBottom: 30 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  userInfo: { flex: 1, marginRight: 10 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  userEmail: { fontSize: 14, color: '#555' },
  userRole: { fontSize: 13, color: '#888', marginTop: 2 },
  
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#aaa',
    marginTop: 10,
  },
  emptyTextHint: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  }
});