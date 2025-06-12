import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { formatTime } from "@/utils/format";
import { useWorkoutsSessionContext } from "@/contexts/WorkoutsSessionContext";

export default function Player() {
  const { state, handlePlayPause, handleNextStep } = useWorkoutsSessionContext();

  const getPlayButtonIcon = () => {
    if (state.isWorkoutEnd) return "checkmark-circle";
    return state.isPlaying ? "pause" : "play";
  };

  const isNextButtonVisible = () => {
    return state.isWorkoutStart && !state.isWorkoutEnd;
  };

  const getPlayerTitle = () => {
    if (state.isWorkoutEnd) return "Тренировка завершена!";
    if (!state.isWorkoutStart) return "Начните тренировку";
    return state.playerTitle;
  };

  const getPlayerSubtitle = () => {
    if (state.isWorkoutEnd || !state.isWorkoutStart) return "";
    if (state.isResting) return state.playerSubtitle;

    // Показываем информацию о текущем подходе
    const currentExercise = state.workout.exercises[state.currentExerciseIndex];
    const currentSet = currentExercise.sets[state.currentSetIndex];
    const setNumber = state.currentSetIndex + 1;
    const totalSets = currentExercise.sets.length;

    return `Подход ${setNumber}/${totalSets} • ${currentSet.weight}кг × ${currentSet.reps}`;
  };

  const subtitle = getPlayerSubtitle();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{getPlayerTitle()}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.playerControls}>
        <TouchableOpacity onPress={handlePlayPause} style={[styles.controlButton]} disabled={state.isWorkoutEnd}>
          <Ionicons name={getPlayButtonIcon()} size={24} color={Colors.primary} />
        </TouchableOpacity>

        {isNextButtonVisible() && (
          <TouchableOpacity onPress={handleNextStep} style={styles.controlButton}>
            <Ionicons name={"play-forward"} size={24} color="white" />
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
  completedButton: {
    opacity: 0.5,
  },
});
