import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Status da Requisição: Simulação do backend
const REQUEST_STATUS = {
    NOT_ASSOCIATED: 'NOT_ASSOCIATED',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
};

// Dados fictícios para simular a informação do usuário e do bairro
const MOCK_USER_DATA = {
    neighborhoodId: 'BAIRRO_A',
    neighborhoodName: 'Jardim Paulista',
    requestStatus: REQUEST_STATUS.NOT_ASSOCIATED, // Pode ser alterado para testar
    requestData: {
        neighborhoodName: 'Vila Olímpia',
        timestamp: '20/09/2025 14:30',
    }
};

export default function MyNeighborhoodScreen({ navigation }) {
    const [userStatus, setUserStatus] = useState(MOCK_USER_DATA);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const [isMapVisible, setIsMapVisible] = useState(false); // Alternar para mostrar o mapa de seleção
    
    // Coordenadas iniciais (simulando a localização do usuário)
    const initialRegion = {
        latitude: -23.588, 
        longitude: -46.611,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    // Função para simular o envio da requisição (Ação Principal)
    const handleSendRequest = () => {
        if (!selectedNeighborhood) {
            Alert.alert("Erro", "Por favor, selecione um bairro no mapa antes de enviar a requisição.");
            return;
        }

        setIsRequesting(true);
        // Simulação de delay de API
        setTimeout(() => {
            setIsRequesting(false);
            setUserStatus({
                ...userStatus,
                requestStatus: REQUEST_STATUS.PENDING,
                requestData: {
                    neighborhoodName: selectedNeighborhood.name,
                    timestamp: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                }
            });
            Alert.alert("Sucesso!", `Requisição enviada para ${selectedNeighborhood.name}. Aguarde a aprovação do Representante.`);
            setIsMapVisible(false); // Esconde o mapa após o envio
        }, 1500);
    };

    // Função para renderizar a seção de status
    const renderStatusSection = () => {
        switch (userStatus.requestStatus) {
            case REQUEST_STATUS.PENDING:
                return (
                    <View style={[styles.statusCard, styles.pendingStatus]}>
                        <Icon name="clock" size={24} color="#F59E0B" />
                        <Text style={styles.statusTitle}>Requisição Pendente</Text>
                        <Text style={styles.statusText}>
                            Sua solicitação para se associar ao bairro **{userStatus.requestData.neighborhoodName}** foi enviada em {userStatus.requestData.timestamp}.
                        </Text>
                        <Text style={styles.statusTextSmall}>
                            Um Representante da área precisa verificar e aprovar sua associação.
                        </Text>
                    </View>
                );
            case REQUEST_STATUS.APPROVED:
                return (
                    <View style={[styles.statusCard, styles.approvedStatus]}>
                        <Icon name="check-circle" size={24} color="#10B981" />
                        <Text style={styles.statusTitle}>Requisição Aprovada!</Text>
                        <Text style={styles.statusText}>
                            Parabéns! Você está associado ao bairro **{userStatus.neighborhoodName}**.
                        </Text>
                        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Gerenciar", "Navegar para tela de detalhes do bairro.")}>
                            <Text style={styles.actionButtonText}>Ver Informações do Bairro</Text>
                        </TouchableOpacity>
                    </View>
                );
            case REQUEST_STATUS.REJECTED:
                return (
                    <View style={[styles.statusCard, styles.rejectedStatus]}>
                        <Icon name="x-octagon" size={24} color="#EF4444" />
                        <Text style={styles.statusTitle}>Requisição Rejeitada</Text>
                        <Text style={styles.statusText}>
                            Sua solicitação para **{userStatus.requestData.neighborhoodName}** foi rejeitada.
                        </Text>
                        <Text style={styles.statusTextSmall}>
                            Motivo: Endereço de cadastro fora da área. Por favor, tente novamente ou entre em contato com o suporte.
                        </Text>
                        <TouchableOpacity style={[styles.actionButton, styles.retryButton]} onPress={() => setUserStatus({...userStatus, requestStatus: REQUEST_STATUS.NOT_ASSOCIATED})}>
                            <Text style={styles.retryButtonText}>Fazer Nova Requisição</Text>
                        </TouchableOpacity>
                    </View>
                );
            case REQUEST_STATUS.NOT_ASSOCIATED:
            default:
                return (
                    <View style={[styles.statusCard, styles.defaultStatus]}>
                         <Icon name="map-pin" size={24} color="#3B82F6" />
                        <Text style={styles.statusTitle}>Você não está associado a um bairro.</Text>
                        <Text style={styles.statusTextSmall}>
                            Para ter acesso a alertas exclusivos da sua região, você deve se associar ao seu bairro.
                        </Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => setIsMapVisible(true)}>
                            <Text style={styles.primaryButtonText}>Solicitar Associação Agora</Text>
                        </TouchableOpacity>
                    </View>
                );
        }
    };

    // Conteúdo principal da tela
    const renderMainContent = () => {
        if (isMapVisible) {
            return (
                <View style={styles.mapContainer}>
                    <Text style={styles.mapInstruction}>
                        1. Selecione a área do seu bairro no mapa.
                    </Text>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        initialRegion={initialRegion}
                        style={styles.map}
                        onPress={(e) => {
                            // Mock de seleção de bairro
                            setSelectedNeighborhood({ 
                                name: 'Bairro Simulado', 
                                coord: e.nativeEvent.coordinate 
                            });
                        }}
                    >
                         {selectedNeighborhood && (
                            <Marker
                                coordinate={selectedNeighborhood.coord}
                                title={selectedNeighborhood.name}
                                description="Ponto de Referência"
                                pinColor="#1D4ED8"
                            />
                        )}
                    </MapView>

                    {selectedNeighborhood && (
                        <View style={styles.mapSelectionBar}>
                            <Text style={styles.selectedText}>
                                Bairro Escolhido: <Text style={{fontWeight: 'bold'}}>{selectedNeighborhood.name}</Text>
                            </Text>
                            <TouchableOpacity 
                                style={styles.submitButton} 
                                onPress={handleSendRequest}
                                disabled={isRequesting}
                            >
                                {isRequesting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Confirmar e Enviar Requisição</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                    <TouchableOpacity style={styles.backButton} onPress={() => setIsMapVisible(false)}>
                        <Icon name="x" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* 1. SEÇÃO DE STATUS */}
                <Text style={styles.sectionTitle}>Status de Associação</Text>
                {renderStatusSection()}

                {/* 2. DADOS ATUAIS (Só aparece se APROVADO) */}
                {userStatus.requestStatus === REQUEST_STATUS.APPROVED && (
                    <View style={styles.currentNeighborhoodCard}>
                        <Text style={styles.currentTitle}>Seu Bairro Atual</Text>
                        <Text style={styles.currentName}>{userStatus.neighborhoodName}</Text>
                        <Text style={styles.currentRepresentative}>Representante: Maria Silva</Text>
                        <TouchableOpacity style={styles.currentButton}>
                            <Text style={styles.currentButtonText}>Sair do Bairro</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 3. INFORMAÇÕES ADICIONAIS */}
                <Text style={styles.sectionTitle}>Sobre a Associação</Text>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        <Text style={{fontWeight: 'bold'}}>Por que se associar?</Text>
                        {'\n'}Ao se associar, você recebe apenas alertas e notícias verificadas e relevantes para a sua área, reduzindo o ruído.
                    </Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        <Text style={{fontWeight: 'bold'}}>Como é verificada?</Text>
                        {'\n'}O Representante do seu bairro irá cruzar o endereço do seu cadastro com o ponto de localização que você selecionar para aprovar sua requisição.
                    </Text>
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Mock de Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meu Bairro</Text>
                <View style={{ width: 24 }} />
            </View>
            
            {renderMainContent()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingTop: 45,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        flex: 1,
        textAlign: 'center',
    },
    scrollContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
        marginBottom: 10,
    },
    // --- Status Card Styles ---
    statusCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    defaultStatus: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
    pendingStatus: { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
    approvedStatus: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
    rejectedStatus: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },

    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 8,
        color: '#333',
    },
    statusText: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 10,
        color: '#555',
    },
    statusTextSmall: {
        fontSize: 13,
        textAlign: 'center',
        color: '#777',
        marginBottom: 10,
    },
    primaryButton: {
        backgroundColor: '#1D4ED8', // Azul forte
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        marginTop: 10,
        elevation: 3,
        shadowColor: '#000',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // --- Current Neighborhood Card Styles ---
    currentNeighborhoodCard: {
        backgroundColor: '#E0F7FA', 
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 5,
        borderColor: '#00BCD4',
        alignItems: 'center',
    },
    currentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00838F',
    },
    currentName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#005A62',
        marginVertical: 5,
    },
    currentRepresentative: {
        fontSize: 14,
        color: '#00838F',
        marginBottom: 15,
    },
    currentButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    currentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    
    // --- Map Section Styles ---
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    mapInstruction: {
        fontSize: 16,
        fontWeight: '600',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    map: {
        flex: 1,
    },
    mapSelectionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 15,
        borderTopWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    selectedText: {
        fontSize: 15,
        color: '#333',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#10B981', // Verde de sucesso para confirmação
        paddingVertical: 14,
        borderRadius: 8,
        marginBottom: 30,        
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        elevation: 5,
        shadowColor: '#000',
    },
    // Botão de Retentar (usado em Requisição Rejeitada)
    retryButton: {
        backgroundColor: '#9CA3AF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    actionButton: {
        backgroundColor: '#1D4ED8', 
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    }
});