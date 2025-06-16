import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/base/Button";
import { Colors } from "@/constants/Colors";
import Input from "@/components/base/Input";
import { useWorkoutsCreateContext } from "@/contexts/WorkoutsCreateContext";
import { WorkoutCreateState } from "@/types/workouts";

// TODO: Create validation for input only numbers

const WorkoutsCreateExerciseCard = memo(
  ({ exercise, exerciseIndex }: { exercise: WorkoutCreateState["exercises"][number]; exerciseIndex: number }) => {
    const { getExerciseTitle, dispatch } = useWorkoutsCreateContext();

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {exerciseIndex + 1}. {getExerciseTitle(exercise.exerciseId)}
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() =>
              dispatch({
                type: "REMOVE_EXERCISE",
                payload: { _id: exercise._id },
              })
            }
          >
            <Ionicons name="close" size={25} color="red" />
          </TouchableOpacity>
        </View>

        <View style={styles.setsContainer}>
          {exercise.sets.map((set, setIndex) => (
            <View key={set._id} style={styles.setRow}>
              <Text style={styles.setNumber}>#{setIndex + 1}</Text>
              <Input
                style={{ flex: 1 }}
                placeholder="Вес"
                keyboardType="numeric"
                value={set.weight}
                setValue={(value) =>
                  dispatch({
                    type: "UPDATE_EXERCISE_SET",
                    payload: {
                      exerciseId: exercise._id,
                      setId: set._id,
                      field: "weight",
                      value: value,
                    },
                  })
                }
              />
              <Input
                style={{ flex: 1 }}
                placeholder="Повторы"
                keyboardType="numeric"
                value={set.reps}
                setValue={(value) =>
                  dispatch({
                    type: "UPDATE_EXERCISE_SET",
                    payload: {
                      exerciseId: exercise._id,
                      setId: set._id,
                      field: "reps",
                      value,
                    },
                  })
                }
              />
              <Input
                style={{ flex: 1 }}
                placeholder="Отдых"
                keyboardType="numeric"
                value={set.rest}
                setValue={(value) =>
                  dispatch({
                    type: "UPDATE_EXERCISE_SET",
                    payload: {
                      exerciseId: exercise._id,
                      setId: set._id,
                      field: "rest",
                      value,
                    },
                  })
                }
              />
              <TouchableOpacity
                style={styles.setRemoveButton}
                onPress={() =>
                  dispatch({
                    type: "REMOVE_EXERCISE_SET",
                    payload: { exerciseId: exercise._id, setId: set._id },
                  })
                }
              >
                <Ionicons name="trash-outline" size={16} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Button
          title="Добавить подход"
          icon={<Ionicons name="add" size={24} color={Colors.primary} />}
          callback={() =>
            dispatch({
              type: "ADD_EXERCISE_SET",
              payload: { _id: exercise._id },
            })
          }
        />
      </View>
    );
  }
);

export default WorkoutsCreateExerciseCard;

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
    flex: 1,
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
  removeButton: {},

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
