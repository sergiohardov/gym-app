import { View, Text, FlatList, StyleSheet } from "react-native";
import Player from "@/components/workouts/session/Player";
import ListItem from "@/components/workouts/session/ListItem";
import { Stack } from "expo-router";
import { formatTime } from "@/utils/format";
import { useWorkoutsSessionContext } from "@/contexts/WorkoutsSessionContext";

export default function WorkoutsSessionScreen() {
  const { state, dispatch } = useWorkoutsSessionContext();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Тренировка</Text>
              {state.isWorkoutStart && <Text>{formatTime(state.durationTime)}</Text>}
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={state.workout.exercises}
          renderItem={({ item, index }) => <ListItem exercise={item} listIndex={index} />}
          keyExtractor={(item) => item.id.toString()}
        />

        <Player />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  listContent: {
    paddingBottom: 100, // Чтобы не перекрывалось плеером
    gap: 15,
  },
  exerciseContainer: {
    margin: 8,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
  },
  currentExercise: {
    borderLeftWidth: 4,
    borderLeftColor: "#6200ee",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  setContainer: {
    padding: 8,
    marginVertical: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  currentSet: {
    backgroundColor: "#d1c4e9",
    borderLeftWidth: 4,
    borderLeftColor: "#6200ee",
  },
  completedSet: {
    opacity: 0.7,
  },
  setText: {
    fontSize: 14,
  },
});
