import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const DUMMY_COMMENTS = [
  { id: 'c1', user: 'Jane Doe', text: 'Obrigado por compartilhar! Ficarei atento.' },
  { id: 'c2', user: 'Carlos', text: 'Isso é perto da minha casa, valeu pelo aviso.' },
];

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const [comments, setComments] = useState(DUMMY_COMMENTS);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentToAdd = { id: `c${comments.length + 1}`, user: 'Você', text: newComment };
      setComments([...comments, commentToAdd]);
      setNewComment('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{post.user}</Text>
            <Text style={styles.postTime}>{post.time}</Text>
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.crimeInfoContainer}>
          <Text style={styles.crimeType}>{post.crimeType || 'Roubo'}</Text>
          <Text style={styles.crimeDetails}><Icon name="map-pin" size={14} /> {post.location || 'Avenida Brasil, 123'}</Text>
          <Text style={styles.crimeDetails}><Icon name="calendar" size={14} /> {post.date || '01/01/2024'}</Text>
        </View>
        <Text style={styles.description}>{post.desc || 'Descrição do ocorrido não fornecida.'}</Text>
        <Image source={{ uri: post.image }} style={styles.postImage} />

        {/* Post Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="arrow-up" size={22} color="#555" />
            <Text style={styles.actionText}>Upvote</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="message-circle" size={22} color="#555" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share-2" size={22} color="#555" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comentários</Text>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentContainer}>
              <Text style={styles.commentUser}>{comment.user}:</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Comment Input */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Adicione um comentário..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 25, // Adiciona mais espaço no topo
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContainer: { padding: 15, paddingBottom: 80 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  postTime: { color: '#888', fontSize: 12 },
  crimeInfoContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  crimeType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  crimeDetails: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 15 },
  postImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15 },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginLeft: 8, fontSize: 14, color: '#555' },
  commentsSection: { marginTop: 20 },
  commentsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  commentContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentUser: { fontWeight: 'bold', marginBottom: 4 },
  commentText: {},
  commentInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 20,
  },
});