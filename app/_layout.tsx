// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="book-selection" />
      <Stack.Screen name="recommendations" />
      <Stack.Screen name="final" />
    </Stack>
  );
}