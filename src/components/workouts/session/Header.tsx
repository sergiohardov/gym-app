import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function Header() {
  return (
    <Stack.Screen
      options={{
        headerTitle: () => (
          <View style={styles.container}>
            <Text style={styles.text}>Тренировка</Text>
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
