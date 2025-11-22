import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useUser } from '../hooks/useUser';
import { getBairroDetails, getUserById } from '../api';

const SCREEN_STATUS = {
    LOADING: 'LOADING',
    LOADED: 'LOADED',
    NOT_ASSOCIATED: 'NOT_ASSOCIATED',
    ERROR: 'ERROR',
};

export default function MyNeighborhoodScreen({ navigation }) {
    const { user, loading: userLoading } = useUser();

    const [screenStatus, setScreenStatus] = useState(SCREEN_STATUS.LOADING);
    const [bairroData, setBairroData] = useState(null);
    const [representativeData, setRepresentativeData] = useState(null);

    useEffect(() => {
        if (userLoading) return; 

        if (!user || !user.bairroId) {
            setScreenStatus(SCREEN_STATUS.NOT_ASSOCIATED);
            return;
        }

        async function loadBairroData() {
            setScreenStatus(SCREEN_STATUS.LOADING);
            try {
                const bairro = await getBairroDetails(user.bairroId);
                
                const representative = await getUserById(bairro.adminId);
                
                setBairroData(bairro);

                setRepresentativeData(representative); 
                setScreenStatus(SCREEN_STATUS.LOADED);

            } catch (error) {
                console.error("Erro ao carregar dados do bairro:", error);
                setScreenStatus(SCREEN_STATUS.ERROR);
                Alert.alert("Erro", "Não foi possível carregar as informações do seu bairro.");
            }
        }

        loadBairroData();
    }, [user, userLoading]);

    const renderStatusSection = () => {
        switch (screenStatus) {
            case SCREEN_STATUS.LOADING:
                return (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1D4ED8" />
                        <Text style={styles.statusText}>Carregando informações do seu bairro...</Text>
                    </View>
                );
            
            case SCREEN_STATUS.NOT_ASSOCIATED:
                return (
                    <View style={[styles.statusCard, styles.defaultStatus]}>
                         <Icon name="map-pin" size={24} color="#3B82F6" />
                        <Text style={styles.statusTitle}>Você não está associado a um bairro.</Text>
                        <Text style={styles.statusTextSmall}>
                            Procure o Representante do seu Bairro para receber acesso à rede colaborativa.
                        </Text>
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={() => Alert.alert("Ação", "Navegar para tela de busca/cadastro de bairro.")}
                        >
                        </TouchableOpacity>
                    </View>
                );

            case SCREEN_STATUS.LOADED:
                if (!bairroData || !representativeData) return null; 

                return (
                    <View style={[styles.statusCard, styles.approvedStatus]}>
                        <Icon name="check-circle" size={24} color="#10B981" />
                        <Text style={styles.statusTitle}>Você está associado a:</Text>
                        <Text style={styles.bairroName}>{bairroData.name}</Text>
                        
                        <View style={styles.bairroDetails}>
                            <Text style={styles.detailText}><Icon name="map" size={14} color="#555" /> Cidade: {bairroData.cidade}</Text>
                            
                            <Text style={styles.detailText}><Icon name="user" size={14} color="#555" /> Representante: {representativeData.name}</Text>

                            <Text style={styles.detailText}><Icon name="mail" size={14} color="#555" /> Contato: {representativeData.email}</Text>
                        </View>

                        <Text style={styles.contactInstructionText}>
                            Para solicitar mudanças de bairro associado, entre em contato diretamente com o Representante pelo email acima.
                        </Text>
                    </View>
                );

            case SCREEN_STATUS.ERROR:
                return (
                    <View style={[styles.statusCard, styles.rejectedStatus]}>
                        <Icon name="alert-triangle" size={24} color="#EF4444" />
                        <Text style={styles.statusTitle}>Falha ao Carregar Dados</Text>
                        <Text style={styles.statusTextSmall}>
                            Não foi possível conectar ao servidor. Tente novamente mais tarde.
                        </Text>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meu Bairro</Text>
                <View style={{ width: 24 }} />
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Status de Associação</Text>
                {renderStatusSection()}

                <Text style={styles.sectionTitle}>Benefícios da Associação</Text>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        <Text style={{fontWeight: 'bold'}}>Rede Colaborativa:</Text>
                        {'\n'}Tenha uma rede colaborativa, na qual as possíveis ocorrências são marcadas pelos próprios moradores do bairro.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5', },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, paddingTop: 45, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', },
    headerButton: { padding: 5, },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', flex: 1, textAlign: 'center', },
    scrollContainer: { padding: 20, },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10, },
    loadingContainer: { alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: '#fff', borderRadius: 12, },

    statusCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', },
    defaultStatus: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' }, // Não Associado
    approvedStatus: { borderColor: '#10B981', backgroundColor: '#ECFDF5' }, // Associado

    statusTitle: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 5, color: '#333', },
    statusText: { fontSize: 15, textAlign: 'center', marginBottom: 10, color: '#555', },
    statusTextSmall: { fontSize: 13, textAlign: 'center', color: '#777', marginBottom: 10, },
    bairroName: { fontSize: 28, fontWeight: '900', color: '#047857', marginBottom: 15, textAlign: 'center' },
    bairroDetails: { alignItems: 'flex-start', marginBottom: 15, width: '100%' },
    detailText: { fontSize: 15, color: '#555', marginBottom: 5, flexDirection: 'row', alignItems: 'center' },

    primaryButton: { backgroundColor: '#1D4ED8', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, marginTop: 10, elevation: 3, shadowColor: '#000', },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', },

    contactInstructionText: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 15,
        paddingHorizontal: 10,
        color: '#777',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
    },

    infoBox: { backgroundColor: '#fff', borderRadius: 8, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
    infoText: { fontSize: 14, lineHeight: 20, color: '#555' },
    
    rejectedStatus: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
});