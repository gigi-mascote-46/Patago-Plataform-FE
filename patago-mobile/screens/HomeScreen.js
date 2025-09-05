import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
  Text,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import AnimalCard from "../components/AnimalCard";
import { removeToken } from "../utils/storage";
import { distanceInKm } from "../utils/geo";

let MapView;
let Marker;

if (Platform.OS !== "web") {
  MapView = require("react-native-maps").default;
  Marker = require("react-native-maps").Marker;
} else {
  // Provide fallback components for web to avoid errors
  MapView = (props) => <View style={[props.style, { backgroundColor: "#eee", justifyContent: "center", alignItems: "center" }]}><Text>Map is not supported on web</Text></View>;
  Marker = () => null;
}

export default function HomeScreen({ navigation }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchAnimalsNearby = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissão recusada", "Localização é necessária");
          setLoading(false);
          return;
        }

        const locationData = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = locationData.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const res = await axios.get("http://10.0.2.2:5000/api/animals");
        const nearby = res.data.filter((animal) =>
          distanceInKm(
            latitude,
            longitude,
            animal.location.lat,
            animal.location.lng
          ) <= 5
        );

        setAnimals(nearby);
        setLoading(false);
      } catch (err) {
        console.error("Erro:", err);
        setLoading(false);
      }
    };

    fetchAnimalsNearby();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.lat || 38.736946,
          longitude: userLocation?.lng || -9.142685,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {animals.map((animal) => (
          <Marker
            key={`marker-${animal._id}`}
            coordinate={{
              latitude: animal.location.lat,
              longitude: animal.location.lng,
            }}
            title={animal.species}
            description={animal.description}
          />
        ))}
      </MapView>

      <ScrollView style={styles.cardList}>
        {animals.map((animal) => (
          <AnimalCard key={`card-${animal._id}`} animal={animal} />
        ))}
      </ScrollView>

      <View style={styles.buttonGroup}>
        <Button
          title="➕ Adicionar Animal"
          onPress={() => navigation.navigate("ReportAnimal")}
        />
        <Button
          title="📃 Ver Todos"
          onPress={() => navigation.navigate("AnimalList")}
        />
        <Button title="👤 Ver Perfil" onPress={() => navigation.navigate('Profile')} />

        <Button title="🚪 Logout" onPress={handleLogout} color="#c00" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { height: 250 },
  cardList: { flex: 1, paddingHorizontal: 10 },
  buttonGroup: {
    padding: 10,
    gap: 10,
  },
});
