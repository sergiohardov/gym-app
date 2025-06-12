import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function Player() {
  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
        <Text style={styles.title}>Title</Text>
        <Text style={styles.subtitle}>Subtitle</Text>
      </View>

      <View style={styles.containerControls}>
        <TouchableOpacity onPress={() => {}} style={styles.controlButton} disabled={false}>
          <Ionicons name="play" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={styles.controlButton}>
          <Ionicons name="play-forward" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    margin: 8,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  containerText: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.primary,
    fontSize: 15,
  },
  containerControls: {
    flexDirection: "row",
  },
  controlButton: {
    marginLeft: 16,
    padding: 8,
  },
  completedButton: {
    opacity: 0.5,
  },
});
