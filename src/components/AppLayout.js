import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppFooter from './AppFooter';

export default function AppLayout({ children }) {
  return (
    <View style={styles.container}>
      {children}
      <AppFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
});