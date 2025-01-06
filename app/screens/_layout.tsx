import { Stack } from 'expo-router';

export default function ScreensLayout() {
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
      animation: 'slide_from_right',
    }}>
      <Stack.Screen
        name="QuizQuestions"
        options={{
          title: "Quiz",
        }}
      />
      <Stack.Screen
        name="CategoryScreen"
        options={{
          title: "Categories",
        }}
      />
      <Stack.Screen
        name="CategoryQuizCount"
        options={{
          title: "Available Questions",
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
