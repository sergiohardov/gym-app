import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import ExerciseSet from "./ExerciseSet";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";
import { WorkoutSession } from "@/types/workouts";

export default function ExercisesListItem({
  exercise,
  exerciseListIndex,
}: {
  exercise: WorkoutSession["exercises"][number];
  exerciseListIndex: number;
}) {
  const { status, currentExerciseIndex, isResting, workout, setCurrentExercise, setCurrentSet } =
    useWorkoutsSessionStore();

  const isCurrent = exerciseListIndex === currentExerciseIndex;
  const canSelect = status === "playing" || status === "end" || isResting;

  const handleSelectExercise = (exerciseListIndex: number) => {
    // Можно выбирать упражнение только если тренировка на паузе или не начата, и не во время отдыха
    if (status === "playing" || status === "end" || isResting) return;

    // Можно выбрать только то упражнение которое не закончено
    const selectedExercise = workout.exercises[exerciseListIndex];
    if (selectedExercise.complete) return;

    // Находим первый незавершенный подход
    const firstIncompleteSetIndex = selectedExercise.sets.findIndex((set) => !set.complete);

    // Обновляем текущий индекс упражнения и сета
    if (firstIncompleteSetIndex !== -1) {
      setCurrentExercise(exerciseListIndex);
      setCurrentSet(firstIncompleteSetIndex);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.numberButton,
            isCurrent && styles.numberButtonCurrent,
            exercise.complete && styles.numberButtonComplete,
          ]}
          onPress={() => handleSelectExercise(exerciseListIndex)}
          disabled={canSelect}
        >
          <Text
            style={[
              styles.numberButtonText,
              isCurrent && styles.numberButtonTextCurrent,
              exercise.complete && styles.numberButtonTextComplete,
            ]}
          >
            {exerciseListIndex + 1}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.title, exercise.complete && styles.titleComplete]}>{exercise.title}</Text>
      </View>

      {exercise.sets.map((set: WorkoutSession["exercises"][number]["sets"][number], setListIndex: number) => (
        <ExerciseSet
          key={set._id}
          set={set}
          exerciseListIndex={exerciseListIndex}
          setListIndex={setListIndex}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  numberButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.secondary,
  },
  numberButtonCurrent: {
    backgroundColor: Colors.secondary,
  },
  numberButtonComplete: {
    borderColor: Colors.surface,
    backgroundColor: Colors.surface,
  },
  numberButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  numberButtonTextCurrent: {
    color: Colors.primary,
  },
  numberButtonTextComplete: {
    color: Colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  titleComplete: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
});
