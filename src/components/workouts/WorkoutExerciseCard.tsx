import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/base/Button";
import { Colors } from "@/constants/Colors";
import { WorkoutExercise, WorkoutExerciseSet } from "@/reducers/useWorkoutReducer";
import Input from "../base/Input";

interface WorkoutExerciseCardProps {
  exercise: WorkoutExercise;
  index: number;
  getExerciseTitle: (id: number) => string;
  onSelectExercise: (exerciseId: number) => void;
  onRemoveExercise: (exerciseId: number) => void;
  onAddSet: (exerciseId: number) => void;
  onRemoveSet: (exerciseId: number, setId: string) => void;
  onUpdateSet: (
    exerciseId: number,
    setId: string,
    field: keyof WorkoutExerciseSet,
    value: string
  ) => void;
}

const WorkoutExerciseCard = memo<WorkoutExerciseCardProps>(
  ({
    exercise,
    index,
    getExerciseTitle,
    onSelectExercise,
    onRemoveExercise,
    onAddSet,
    onRemoveSet,
    onUpdateSet,
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>#{index + 1}</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => onSelectExercise(exercise.id)}
          >
            <Text
              style={[
                styles.selectText,
                !exercise.exercise_id && styles.selectTextPlaceholder,
              ]}
            >
              {exercise.exercise_id
                ? getExerciseTitle(exercise.exercise_id)
                : "Выбрать упражнение"}
            </Text>
            <Ionicons name="chevron-down" size={16} color={Colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemoveExercise(exercise.id)}
          >
            <Ionicons name="close" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {exercise.sets && exercise.sets.length > 0 && (
          <View style={styles.setsContainer}>
            {exercise.sets.map((set, setIndex) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={styles.setNumber}>{setIndex + 1}</Text>
                <Input
                  style={{ flex: 1 }}
                  placeholder="Вес"
                  keyboardType="numeric"
                  value={set.weight}
                  setValue={(value) =>
                    onUpdateSet(exercise.id, set.id, "weight", value)
                  }
                />
                <Input
                  style={{ flex: 1 }}
                  placeholder="Повторы"
                  keyboardType="numeric"
                  value={set.reps}
                  setValue={(value) =>
                    onUpdateSet(exercise.id, set.id, "reps", value)
                  }
                />
                <Input
                  style={{ flex: 1 }}
                  placeholder="Отдых"
                  keyboardType="numeric"
                  value={set.rest}
                  setValue={(value) =>
                    onUpdateSet(exercise.id, set.id, "rest", value)
                  }
                />
                <TouchableOpacity
                  style={styles.setRemoveButton}
                  onPress={() => onRemoveSet(exercise.id, set.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <Button
          title="Добавить подход"
          icon={<Ionicons name="add" size={24} color={Colors.primary} />}
          callback={() => onAddSet(exercise.id)}
          disabled={!exercise.exercise_id}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.secondary,
    minWidth: 30,
  },
  select: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    fontSize: 16,
    color: Colors.secondary,
    flex: 1,
  },
  selectTextPlaceholder: {
    color: Colors.surface,
  },
  removeButton: {
    backgroundColor: "#ff4444",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  // Sets styles
  setsContainer: {
    gap: 12,
  },
  setsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.secondary,
    minWidth: 20,
    textAlign: "center",
  },
  setInputs: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  setInput: {
    flex: 1,
  },
  setRemoveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff4444",
  },
});

export default WorkoutExerciseCard;
