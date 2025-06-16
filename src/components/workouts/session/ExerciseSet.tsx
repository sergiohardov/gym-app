import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";
import { WorkoutSession } from "@/types/workouts";

export default function ExerciseSet({
  set,
  exerciseListIndex,
  setListIndex,
}: {
  set: WorkoutSession["exercises"][number]["sets"][number];
  exerciseListIndex: number;
  setListIndex: number;
}) {
  const { currentExerciseIndex, currentSetIndex } = useWorkoutsSessionStore();

  const isCurrent = exerciseListIndex === currentExerciseIndex && setListIndex === currentSetIndex;

  return (
    <View style={[styles.container, isCurrent && styles.containerCurrent, set.complete && styles.containerCompleted]}>
      <View style={styles.header}>
        <Text style={styles.title}>Подход #{setListIndex + 1}</Text>
        {set.complete && <Text style={styles.icon}>✓</Text>}
      </View>

      <View style={styles.details}>
        <Text style={styles.text}>Вес: {set.weight} кг</Text>
        <Text style={styles.text}>Повторы: {set.reps}</Text>
        <Text style={styles.text}>Отдых: {set.rest} сек</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    marginLeft: 50,
    gap: 5,
  },
  containerCurrent: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  containerCompleted: {
    opacity: 0.5,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
  },
  icon: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
