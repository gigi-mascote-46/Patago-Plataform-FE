import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AnimalCard({ animal }) {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      {animal.photoUrl && (
        <Image source={{ uri: animal.photoUrl }} style={styles.image} />
      )}
      <Text style={styles.species}>{animal.species.toUpperCase()}</Text>
      <Text style={styles.description}>{animal.description}</Text>
      <Text>📍 {animal.location.lat}, {animal.location.lng}</Text>
      <Button
        title="Ver mais"
        onPress={() => navigation.navigate('AnimalDetail', { id: animal._id })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    height: 150,
    width: '100%',
    marginBottom: 10,
    borderRadius: 8,
  },
  species: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    marginBottom: 8,
  },
});
