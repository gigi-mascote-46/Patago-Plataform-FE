import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ReportAnimalScreen from '../screens/ReportAnimalScreen';
import AnimalDetailScreen from '../screens/AnimalDetailScreen';
import AnimalListScreen from '../screens/AnimalListScreen';
import { getToken } from '../utils/storage';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setAuthenticated(!!token);
    };
    const unsubscribe = checkAuth();
    return () => unsubscribe;
  }, []);

  return (
    <Stack.Navigator>
      {authenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ReportAnimal" component={ReportAnimalScreen} />
          <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
          <Stack.Screen name="AnimalList" component={AnimalListScreen} />
          <Stack.Screen name="ConfirmSight" component={ConfirmSightScreen} />

        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
