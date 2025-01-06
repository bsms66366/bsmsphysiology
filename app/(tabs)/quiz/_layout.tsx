import { Stack } from 'expo-router';

export default function QuizLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Categories",
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="questions" 
        options={{ 
          title: "Available Questions",
          headerShown: true,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="take" 
        options={{ 
          title: "Quiz",
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
