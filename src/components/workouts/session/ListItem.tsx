import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useWorkoutsSessionContext } from "@/contexts/WorkoutsSessionContext";

type ListItemProps = {
  exercise: any; // TODO FIX TYPE
  listIndex: number;
};

export default function ListItem({ exercise, listIndex }: ListItemProps) {
  const { state, handleSelectExercise } = useWorkoutsSessionContext();

  const isCurrentExercise = listIndex === state.currentExerciseIndex;
  const canSelectExercise = !state.isPlaying && !state.isResting && !exercise.complete && !state.isWorkoutEnd;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleSelectExercise(listIndex)} disabled={!canSelectExercise}>
          <View
            style={[
              styles.exNumber,
              isCurrentExercise && !exercise.complete && styles.exNumberCurrent,
              exercise.complete && styles.exNumberComplete,
            ]}
          >
            <Text
              style={[
                styles.exNumberText,
                isCurrentExercise && styles.exNumberCurrentText,
                exercise.complete && styles.exNumberTextComplete,
              ]}
            >
              {listIndex + 1}
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={[styles.exerciseName, exercise.complete && styles.exerciseNameComplete]}>{exercise.name}</Text>
      </View>

      {exercise.sets.map((set: any, setIndex: number) => {
        const isCurrentSet = isCurrentExercise && setIndex === state.currentSetIndex && !exercise.complete;
        const isActiveSet = isCurrentSet && state.isWorkoutStart && !state.isWorkoutEnd;

        return (
          <View
            key={set.id}
            style={[styles.setContainer, isActiveSet && styles.currentSet, set.complete && styles.completedSet]}
          >
            <View style={styles.setHeader}>
              <Text style={[styles.setText, styles.setBold]}>Подход {setIndex + 1}</Text>
              {set.complete && <Text style={styles.completedText}>✓</Text>}
            </View>
            <View style={styles.setDetails}>
              <Text style={styles.setText}>Вес: {set.weight} кг</Text>
              <Text style={styles.setText}>Повторы: {set.reps}</Text>
              <Text style={styles.setText}>Отдых: {set.rest} сек</Text>
            </View>
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
    marginBottom: 8,
  },
  exNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.secondary,
  },
  exNumberCurrent: {
    backgroundColor: Colors.secondary,
  },
  exNumberComplete: {
    borderColor: Colors.surface,
    backgroundColor: Colors.surface,
  },
  exNumberText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  exNumberCurrentText: {
    color: Colors.primary,
  },
  exNumberTextComplete: {
    color: Colors.primary,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  exerciseNameComplete: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  setContainer: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    marginLeft: 50,
  },
  currentSet: {
    backgroundColor: Colors.primary,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  completedSet: {
    opacity: 0.5,
    backgroundColor: Colors.surface,
  },
  setHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  setDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  setText: {
    fontSize: 14,
  },
  setBold: {
    fontWeight: "600",
  },
  completedText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
