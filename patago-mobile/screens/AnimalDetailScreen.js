import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import api from '../services/api';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AnimalDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchAnimal = async () => {
    try {
      const res = await api.get(`/animals/${id}`);
      setAnimal(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchAnimal();
  }, [id, isFocused]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (!animal) return <Text style={{ padding: 20 }}>Animal não encontrado.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {animal.photoUrl && (
        <Image source={{ uri: animal.photoUrl }} style={styles.image} />
      )}

      <Text style={styles.label}>Espécie:</Text>
      <Text>{animal.species}</Text>

      <Text style={styles.label}>Descrição:</Text>
      <Text>{animal.description}</Text>

      <Text style={styles.label}>Localização:</Text>
      <Text>
        📍 {animal.location.lat}, {animal.location.lng}
      </Text>

      <Text style={styles.label}>Confirmado por:</Text>
      <View style={styles.confirmBox}>
        <Icon name="paw" size={20} color="#c68" />
        <Text style={styles.confirmText}>
          {animal.confirmations?.length || 0}
        </Text>
      </View>

      <Button
        title="Confirmar Avistamento"
        onPress={() =>
          navigation.navigate('ConfirmSight', { animalId: animal._id })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 2,
  },
  confirmBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },
  confirmText: {
    fontSize: 16,
    color: '#333',
  },
});
