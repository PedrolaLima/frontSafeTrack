import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function AppFooter() {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <Icon name="user" size={24} />
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={24} />
      </TouchableOpacity>
      <Icon name="bell" size={24} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});