import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Page</Text>
      <Link href="/GraficPage" style={{ marginTop: 20 }}>
        Go to Grafic Page
      </Link>
    </View>
  );
}
