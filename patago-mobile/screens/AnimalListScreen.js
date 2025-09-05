import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AnimalList from '../components/AnimalList';
import api from '../services/api';

export default function AnimalListScreen() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/animals')
      .then(res => {
        setAnimals(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar animais:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator size="large" style={styles.loading} />;

  return (
    <View style={styles.container}>
      <AnimalList animals={animals} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
