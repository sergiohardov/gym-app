import { TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";

export default function ExercisesTabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Тренировки",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("create")}>
              <Ionicons name="add-circle-outline" size={30} color={Colors.secondary} />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Редактировать",
          headerBackButtonDisplayMode: "generic",
        }}
      />

      <Stack.Screen
        name="session/[id]"
        options={{
          title: "Тренировка",
          headerBackButtonDisplayMode: "generic",
        }}
      />
    </Stack>
  );
}
