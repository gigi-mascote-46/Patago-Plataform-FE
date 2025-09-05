import React from 'react';
import { ScrollView } from 'react-native';
import AnimalCard from './AnimalCard';

export default function AnimalList({ animals }) {
  return (
    <ScrollView>
      {animals.map(animal => (
        <AnimalCard key={animal._id} animal={animal} />
      ))}
    </ScrollView>
  );
}
