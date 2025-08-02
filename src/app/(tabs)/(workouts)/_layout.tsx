import { Stack } from "expo-router";

export default function ExercisesTabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Тренировки",
        }}
      />

      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Редактировать",
        }}
      />

      <Stack.Screen
        name="session/[id]"
        options={{
          title: "Тренировка",
        }}
      />
    </Stack>
  );
}
