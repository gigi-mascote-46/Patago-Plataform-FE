import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function AddAnimalScreen({ navigation }) {
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleSubmit = () => {
    if (!species || !description || !lat || !lng) {
      Alert.alert('Erro', 'Por favor preencha todos os campos');
      return;
    }

    axios.post('http://localhost:5000/api/animals', {
      species,
      description,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      dateFound: new Date(),
    }).then(() => {
      Alert.alert('Sucesso', 'Animal adicionado!');
      navigation.goBack();
    }).catch(err => {
      Alert.alert('Erro', 'Não foi possível adicionar o animal');
      console.error(err);
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Espécie (dog, cat, bird, other)"
        style={styles.input}
        value={species}
        onChangeText={setSpecies}
      />
      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Latitude"
        style={styles.input}
        value={lat}
        onChangeText={setLat}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Longitude"
        style={styles.input}
        value={lng}
        onChangeText={setLng}
        keyboardType="numeric"
      />
      <Button title="Enviar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
});
