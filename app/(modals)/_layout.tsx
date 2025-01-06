import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#00679A',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      presentation: 'modal',
      animation: 'slide_from_bottom',
    }}>
      <Stack.Screen
        name="CategoryQuizCount"
        options={{
          title: "Available Questions",
        }}
      />
      <Stack.Screen
        name="QuizResults"
        options={{
          title: "Quiz Results",
          headerShown: false, // Hide header since we have our own close button
        }}
      />
    </Stack>
  );
}
