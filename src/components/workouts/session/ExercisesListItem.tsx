import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { WorkoutsSessionExercise, WorkoutsSessionExerciseSet } from "@/types/workouts";
import { Colors } from "@/constants/Colors";
import ExerciseSet from "./ExerciseSet";

export default function ExercisesListItem({
  exercise,
  exerciseListIndex,
}: {
  exercise: WorkoutsSessionExercise;
  exerciseListIndex: number;
}) {
  const isCurrent = false;
  const canSelect = false;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.numberButton,
            isCurrent && styles.numberButtonCurrent,
            exercise.complete && styles.numberButtonComplete,
          ]}
          onPress={() => {}}
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

        <Text style={[styles.title, exercise.complete && styles.titleComplete]}>{exercise.name}</Text>
      </View>

      {exercise.sets.map((set: WorkoutsSessionExerciseSet, setListIndex: number) => (
        <ExerciseSet key={"ExerciseSet_" + setListIndex} set={set} setListIndex={setListIndex} />
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
