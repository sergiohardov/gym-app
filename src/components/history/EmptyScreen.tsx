import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function EmptyScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="document-text-outline" size={64} color={Colors.surface} />
      <Text style={styles.title}>История пуста</Text>
      <Text style={styles.subtitle}>Завершите первую тренировку, чтобы увидеть её здесь</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.surface,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.surface,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
});
