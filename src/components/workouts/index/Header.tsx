import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function Header({
  setIsBottomSheetVisible,
}: {
  setIsBottomSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Stack.Screen
      options={{
        title: "Тренировки",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              setIsBottomSheetVisible(true);
            }}
          >
            <Ionicons name="add-circle-outline" size={30} color={Colors.secondary} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
