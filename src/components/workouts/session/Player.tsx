import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function Player({
  currentExercise,
  isWorkoutComplete,
  isResting,
  restTime,
  currentSetIndex,
  togglePlayPause,
  isPlaying,
  handleNextStep,
  formatTime,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{currentExercise.name || "Тренировка завершена"}</Text>

        {!isWorkoutComplete && (
          <Text style={styles.subtitle}>
            {isResting
              ? `Отдых: ${formatTime(restTime)}`
              : `Подход ${currentSetIndex + 1}/${currentExercise.sets?.length || 0}`}
          </Text>
        )}
      </View>

      <View style={styles.playerControls}>
        <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" />
        </TouchableOpacity>

        {!isWorkoutComplete && (
          <TouchableOpacity onPress={handleNextStep} style={styles.controlButton}>
            <Ionicons name="play-forward" size={24} color="white" />
          </TouchableOpacity>
        )}
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
  textContainer: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 15,
  },
  playerControls: {
    flexDirection: "row",
  },
  controlButton: {
    marginLeft: 16,
    padding: 8,
  },
});
