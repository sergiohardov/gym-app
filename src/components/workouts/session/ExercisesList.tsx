import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useWorkoutsSessionContext } from "@/contexts/WorkoutsSessionContext";
import ExercisesListItem from "@/components/workouts/session/ExercisesListItem";

export default function ExercisesList() {
  const { state } = useWorkoutsSessionContext();

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={state.workout.exercises}
      renderItem={({ item, index }) => <ExercisesListItem exercise={item} exerciseListIndex={index} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100, // Чтобы не перекрывалось плеером
    gap: 15,
  },
});
