import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function LoadingScreen({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.surface} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: Colors.surface,
  },
});
