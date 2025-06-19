import { TouchableOpacity, View } from "react-native";
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <TouchableOpacity onPress={() => router.push("history")}>
                <Ionicons name="document-text-outline" size={30} color={Colors.secondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("create")}>
                <Ionicons name="add-circle-outline" size={30} color={Colors.secondary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="history"
        options={{
          title: "История тренировок",
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: "Новая Тренировка",
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
