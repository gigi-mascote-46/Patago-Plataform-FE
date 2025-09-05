import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Avatar({ name, photoUrl }) {
  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    const initials =
      parts.length >= 2
        ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
        : parts[0][0].toUpperCase();
    return initials;
  };

  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={styles.image} />;
  }

  return (
    <View style={styles.placeholder}>
      <Text style={styles.initials}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
});
