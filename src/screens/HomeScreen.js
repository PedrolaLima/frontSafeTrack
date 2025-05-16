import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, TextInput, FlatList } from 'react-native';
import AppLayout from '../components/AppLayout';
import HamburgerMenu from '../components/HamburgerMenu';
import Icon from 'react-native-vector-icons/Feather';

const DUMMY_POSTS = [
  {
    id: '1',
    user: 'Anonymous user',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    time: 'Just now',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    desc: 'Stay informed about your surroundings',
  },
  {
    id: '2',
    user: 'User B',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    time: '5 min ago',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    desc: 'Saw something suspicious near the park.',
  },
];

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState(DUMMY_POSTS);

  const renderPost = ({ item }) => (
    <View style={styles.feedCard}>
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
      <Image source={{ uri: item.image }} style={styles.feedImage} />
      <View style={styles.feedFooter}>
        <Text style={styles.feedDesc}>{item.desc}</Text>
        <TouchableOpacity>
          <Text style={styles.feedMore}>View more</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.feedActions}>
        <Icon name="heart" size={20} style={styles.feedIcon} />
        <Icon name="message-circle" size={20} style={styles.feedIcon} />
        <Icon name="share-2" size={20} style={styles.feedIcon} />
      </View>
    </View>
  );

  return (
    <AppLayout>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <HamburgerMenu />
          <Text style={styles.logo}>SafeTrack</Text>
          <TouchableOpacity>
            <Icon name="search" size={24} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Report input */}
        <View style={styles.reportRow}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileView')}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.reportInput}
            placeholder="Report a crime or share safety tips"
            placeholderTextColor="#888"
          />
        </View>

        {/* Feed posts */}
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        />
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
    position: 'relative', // necessário para o absolute do logo
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
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  reportInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  feedCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 0,
  },
  feedAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  feedUser: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  feedTime: {
    fontSize: 12,
    color: '#888',
  },
  feedImage: {
    width: '100%',
    height: 160,
    marginTop: 10,
    borderRadius: 8,
  },
  feedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ededed',
  },
  feedDesc: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    flex: 1,
    flexWrap: 'wrap',
  },
  feedMore: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 8,
  },
  feedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 4,
    backgroundColor: '#fff',
  },
  feedIcon: {
    marginRight: 18,
    color: '#222',
  },
});