import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function HistoryTabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "История",
        }}
      />

    </Stack>
  );
}
