import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import api from '../services/api';

export default function ReportAnimalScreen({ navigation }) {
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'A localização é necessária para reportar o animal');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
    });
    if (!result.cancelled) {
      const res = await fetch('https://api.cloudinary.com/v1_1/<dcpsjbchw>/image/upload', {
        method: 'POST',
        body: JSON.stringify({
          file: `data:image/jpeg;base64,${result.base64}`,
          upload_preset: '<preset>',
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setPhotoUrl(data.secure_url);
    }
  };

  const handleSubmit = async () => {
    if (!species || !description || !location) {
      Alert.alert('Erro', 'Preenche todos os campos!');
      return;
    }

    try {
      await api.post('/animals', {
        species,
        description,
        photoUrl,
        location,
        dateFound: new Date(),
      }, {
        headers: {
          'x-auth-token': await AsyncStorage.getItem('token'),
        },
      });
      Alert.alert('Sucesso', 'Animal reportado com sucesso!');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.msg || 'Não foi possível reportar o animal');
    }
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
      <Button title="Escolher imagem" onPress={pickImage} />
      {photoUrl && <Image source={{ uri: photoUrl }} style={styles.image} />}
      <Button title="Enviar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 },
  image: { height: 200, width: '100%', marginVertical: 10 },
});
