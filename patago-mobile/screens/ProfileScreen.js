import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Avatar from '../components/Avatar';
import api from '../services/api';
import { getToken } from '../utils/storage';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        const res = await api.get('/auth/me', {
          headers: { 'x-auth-token': token },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (!user) return <Text style={{ padding: 20 }}>Utilizador não encontrado.</Text>;

  return (
    <View style={styles.container}>
      <Avatar name={user.name} photoUrl={user.photoUrl} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.stats}>
        <Text style={styles.title}>🏅 Título Solidário</Text>
        <Text style={styles.level}>Protetor de Patas</Text>

        <Text style={styles.title}>🐾 Avistamentos confirmados</Text>
        <Text style={styles.count}>{user.confirmations?.length || 0}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#fff',
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  stats: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  level: {
    fontSize: 18,
    color: '#444',
  },
  count: {
    fontSize: 22,
    color: '#c68',
    fontWeight: 'bold',
  },
});
