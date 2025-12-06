import { Stack} from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='Login/index' options={{ headerShown: false }}/>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  )
}