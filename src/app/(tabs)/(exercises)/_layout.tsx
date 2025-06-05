import { TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";

export default function ExercisesTabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Упражнения",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("create")}>
              <Ionicons
                name="add-circle-outline"
                size={30}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: "Новое Упражнение",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
