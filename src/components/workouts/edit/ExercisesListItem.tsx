import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function ExercisesListItem({
  handlePress,
  icon,
  title,
  subtitle = "",
}: {
  handlePress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={Colors.secondary} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <Ionicons name="chevron-forward" size={18} color={Colors.surface} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 50,
    padding: 8,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.surface,
    fontSize: 14,
  },
});
