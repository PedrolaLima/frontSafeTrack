import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import HamburgerMenu from "../components/HamburgerMenu";
import Icon from "react-native-vector-icons/Feather";

const DUMMY_POSTS = [
  {
    id: "1",
    user: "Anonymous user",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    time: "Just now",
    crimeType: "Roubo a mão armada",
    location: "Av. Paulista, 1578",
    date: "15/10/2023",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    desc: "Dois indivíduos em uma moto abordaram pedestres na calçada. Levaram celulares e carteiras. Aconteceu por volta das 22h.",
  },
  {
    id: "2",
    user: "User B",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    time: "5 min ago",
    crimeType: "Furto de veículo",
    location: "Rua Augusta, 900",
    date: "14/10/2023",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    desc: "Carro arrombado durante a madrugada. Levaram o estepe e outros pertences que estavam no interior do veículo.",
  },
];

export default function HomeScreen({ navigation }) {
  const [posts] = useState(DUMMY_POSTS);

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.feedCard} onPress={() => navigation.navigate('PostDetail', { post: item })}>
      <View style={styles.feedHeader}>
        <Image source={{ uri: item.avatar }} style={styles.feedAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.feedUser}>{item.user}</Text>
          <Text style={styles.feedTime}>{item.time}</Text>
        </View>
        <TouchableOpacity>
          <Icon name="more-vertical" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.crimeInfoContainer}>
        <Text style={styles.crimeType}>{item.crimeType}</Text>
        <Text style={styles.crimeDetails}><Icon name="map-pin" size={14} /> {item.location}</Text>
        <Text style={styles.crimeDetails}><Icon name="calendar" size={14} /> {item.date}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.feedImage} />
      <View style={styles.feedFooter}>
        <Text style={styles.feedDesc} numberOfLines={1} ellipsizeMode="tail">
          {item.desc}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { post: item })}>
          <Text style={styles.feedMore}>Ler mais</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.feedActions}>
        <Icon name="arrow-up" size={20} style={styles.feedIcon} />
        <Icon name="message-circle" size={20} style={styles.feedIcon} />
        <Icon name="share-2" size={20} style={styles.feedIcon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <HamburgerMenu />
        <Text style={styles.logo}>SafeTrack</Text>
        <TouchableOpacity>
          <Icon name="search" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Feed posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f6f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
    backgroundColor: "#fff",
    position: "relative",
  },
  logo: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingTop: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#111",
    zIndex: 0,
  },
  feedCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 1,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingBottom: 0,
  },
  feedAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  crimeInfoContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  crimeType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  crimeDetails: {
    fontSize: 14,
    color: '#555',
  },    
  feedUser: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
  },
  feedTime: {
    fontSize: 12,
    color: "#888",
  },
  feedImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  feedFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  feedDesc: {
    fontSize: 14,
    color: "#222",
    flex: 1, // Permite que a descrição ocupe o espaço disponível
    marginRight: 8, // Adiciona um espaço antes do "Ler mais"
  },
  feedMore: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 14,
  },
  feedActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 4,
    backgroundColor: "#fff",
  },
  feedIcon: {
    marginRight: 18,
    color: "#222",
  },
});
