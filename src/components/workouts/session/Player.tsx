import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";
import { formatSetSubtitle } from "@/utils/format";

export default function Player() {
  const {
    workout,
    status,
    isResting,
    restTime,
    startSession,
    togglePlayPause,
    currentExerciseIndex,
    currentSetIndex,
    playerTitle,
    playerSubtitle,
    setPlayerTitle,
    setPlayerSubtitle,
    startRest,
    stopRest,
    completeCurrentSet,
    proceedToNextStep,
  } = useWorkoutsSessionStore();

  const isShowPlayButton = status !== "end";
  const isShowNextButton = status !== "start" && status !== "end";

  const handlePlayPause = () => {
    if (status === "start") {
      startSession();
      return;
    }
    togglePlayPause();
  };

  const handleNextStep = () => {
    if (status === "start" || status === "end") return;

    if (isResting) {
      stopRest();
      proceedToNextStep();
      return;
    }

    completeCurrentSet();

    const currentSet = workout.exercises[currentExerciseIndex].sets[currentSetIndex];
    const restDuration = currentSet.rest;

    const currentExercise = workout.exercises[currentExerciseIndex];
    const nextSetIndex = currentExercise.sets.findIndex((set, index) => index > currentSetIndex && !set.complete);

    const anyIncompleteExerciseIndex = workout.exercises.findIndex((exercise) =>
      exercise.sets.some((set) => !set.complete)
    );

    if (nextSetIndex !== -1 || anyIncompleteExerciseIndex !== -1) {
      if (restDuration) startRest(restDuration);
    } else {
      proceedToNextStep();
    }
  };

  useEffect(() => {
    if (status !== "start" && status !== "end" && !isResting) {
      setPlayerTitle(workout.exercises[currentExerciseIndex].title);
      setPlayerSubtitle(
        formatSetSubtitle(
          currentSetIndex + 1,
          workout.exercises[currentExerciseIndex].sets.length,
          workout.exercises[currentExerciseIndex].sets[currentSetIndex]
        )
      );
    }
  }, [currentExerciseIndex, currentSetIndex, status, isResting]);

  useEffect(() => {
    if (isResting) {
      setPlayerSubtitle(`${restTime} сек`);
    }
  }, [restTime, isResting]);

  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
        <Text style={styles.title}>{playerTitle}</Text>
        {playerSubtitle && <Text style={styles.subtitle}>{playerSubtitle}</Text>}
      </View>

      <View style={styles.containerControls}>
        {isShowPlayButton && (
          <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
            <Ionicons name={status === "playing" ? "pause" : "play"} size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}

        {isShowNextButton && (
          <TouchableOpacity onPress={handleNextStep} style={styles.controlButton}>
            <Ionicons name={isResting ? "play-forward" : "checkmark"} size={24} color={Colors.primary} />
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
});
