// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import BookSelectionScreen from './screens/BookSelectionScreen';
import RecommendationsScreen from './screens/RecommendationsScreen';
import FinalScreen from './screens/FinalScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="BookSelection" component={BookSelectionScreen} />
        <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
        <Stack.Screen name="Final" component={FinalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}