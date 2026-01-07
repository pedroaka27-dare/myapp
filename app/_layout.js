import { Stack } from 'expo-router';
import { MovementProvider } from '../context/MovementContext';

export default function Layout() {
  return (
    <MovementProvider>
      <Stack>
        <Stack.Screen name='Login/index' options={{ headerShown: false }}/>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
    </MovementProvider>
  );
}