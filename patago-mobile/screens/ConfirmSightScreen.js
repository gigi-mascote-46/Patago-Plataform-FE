import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import { getToken } from '../utils/storage';

export default function ConfirmSightScreen({ route, navigation }) {
  const { animalId } = route.params;
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      // Envia para Cloudinary ou outro serviço configurado
      const res = await fetch('https://api.cloudinary.com/v1_1/<cloud-name>/image/upload', {
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

  const handleConfirm = async () => {
    try {
      const token = await getToken();
      await api.post(`/animals/${animalId}/confirm`, {
        photoUrl,
        comment,
      }, {
        headers: { 'x-auth-token': token }
      });

      Alert.alert('✅ Confirmação enviada com sucesso!');
      navigation.navigate('AnimalDetail', { id: animalId });
    } catch (err) {
      const msg = err.response?.data?.msg || 'Erro ao confirmar';
      Alert.alert('Erro', msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Comentário:</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Escreve o que viste..."
        multiline
        style={styles.input}
      />

      <Button title="Adicionar foto" onPress={pickImage} />
      {photoUrl && <Image source={{ uri: photoUrl }} style={styles.image} />}

      <Button title="Confirmar Avistamento" onPress={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  image: { height: 200, width: '100%', marginVertical: 10, borderRadius: 8 },
});
