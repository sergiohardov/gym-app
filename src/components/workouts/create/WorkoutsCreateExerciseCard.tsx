import { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Input from "@/components/base/Input";
import { useWorkoutsCreateContext } from "@/contexts/WorkoutsCreateContext";
import { WorkoutCreateState } from "@/types/workouts";
import ButtonString from "@/components/base/ButtonString";

const WorkoutsCreateExerciseCard = memo(
  ({ exercise, exerciseIndex }: { exercise: WorkoutCreateState["exercises"][number]; exerciseIndex: number }) => {
    const { dispatch } = useWorkoutsCreateContext();

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.textContainer}>
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>{exerciseIndex + 1}</Text>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{exercise.exercise.name}</Text>
              <Text style={styles.subtitleText}>
                {exercise.sets.length} {exercise.sets.length === 1 ? "подход" : "подходов"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() =>
              dispatch({
                type: "REMOVE_EXERCISE",
                payload: { _id: exercise._id },
              })
            }
          >
            <Ionicons name="trash-outline" size={20} color={"red"} />
          </TouchableOpacity>
        </View>

        {exercise.sets.length > 0 ? (
          <View style={styles.setsContainer}>
            <View style={styles.setsHeaderContainer}>
              <Text style={[styles.setsHeaderLabel, { maxWidth: 28 }]}>#</Text>
              <Text style={styles.setsHeaderLabel}>Вес (kg)</Text>
              <Text style={styles.setsHeaderLabel}>Повторы</Text>
              <Text style={styles.setsHeaderLabel}>Отдых (s)</Text>
              <Text style={[styles.setsHeaderLabel, { maxWidth: 28 }]}></Text>
            </View>

            {exercise.sets.map((set, setIndex) => (
              <View key={set._id} style={styles.setRowContainer}>
                <View style={styles.setNumberContainer}>
                  <Text style={styles.setNumberText}>{setIndex + 1}</Text>
                </View>

                <Input
                  style={styles.setInput}
                  placeholder="0"
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
                  style={styles.setInput}
                  placeholder="0"
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
                  style={styles.setInput}
                  placeholder="0"
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
                  <Ionicons name="close" size={16} color={"red"} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="add-circle-outline" size={32} color={Colors.surface} />
            <Text style={styles.emptyStateText}>Добавьте первый подход</Text>
          </View>
        )}

        <ButtonString
          title="Добавить подход"
          icon={<Ionicons name="add" size={18} color={Colors.secondary} />}
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
    shadowColor: "#aeaeae",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  numberContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.surface,
  },
  titleContainer: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    lineHeight: 20,
  },
  subtitleText: {
    fontSize: 12,
    color: Colors.surface,
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "red",
  },
  setsContainer: {
    gap: 16,
  },
  setsHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
    gap: 8,
  },
  setsHeaderLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.secondary,
    textAlign: "center",
    flex: 1,
  },
  setRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  setNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  setNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  setInput: {
    flex: 1,
  },
  setRemoveButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.surface,
    borderStyle: "dashed",
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.surface,
  },
});
