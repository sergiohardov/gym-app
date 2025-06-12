import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

export default function ListItem({ exercise, exIndex, currentExerciseIndex, currentSetIndex }) {
  const isCurrentExercise = exIndex === currentExerciseIndex;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.exNumber, isCurrentExercise && styles.exNumberCurrent]}>
          <Text style={[styles.exNumberText, isCurrentExercise && styles.exNumberCurrentText]}>{exIndex + 1}</Text>
        </View>

        <Text style={styles.exerciseName}>{exercise.name}</Text>
      </View>

      {exercise.sets.map((set, setIndex) => {
        const isCurrentSet = isCurrentExercise && setIndex === currentSetIndex;
        const isCompleted =
          exIndex < currentExerciseIndex || (exIndex === currentExerciseIndex && setIndex < currentSetIndex);

        return (
          <View
            key={set.id}
            style={[styles.setContainer, isCurrentSet && styles.currentSet, isCompleted && styles.completedSet]}
          >
            <Text style={styles.setText}>Подход {setIndex + 1}:</Text>
            <Text style={styles.setText}>Вес: {set.weight} кг</Text>
            <Text style={styles.setText}>Повторы: {set.reps}</Text>
            <Text style={styles.setText}>Отдых: {set.rest} сек</Text>
          </View>
        );
      })}
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
  },
  exNumber: {
    width: 40,
    height: 40,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.secondary,
  },
  exNumberCurrent: {
    backgroundColor: Colors.secondary,
  },
  exNumberText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  exNumberCurrentText: {
    color: Colors.primary,
  },
  currentExercise: {
    borderLeftWidth: 4,
    borderLeftColor: "#6200ee",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  setContainer: {
    padding: 8,
    marginVertical: 4,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    marginLeft: 50,
  },
  currentSet: {
    backgroundColor: Colors.primary,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  completedSet: {
    opacity: 0.5,
    backgroundColor: Colors.surface,
  },
  setText: {
    fontSize: 14,
  },
});
