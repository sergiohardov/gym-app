import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ExercisesListItem from "@/components/workouts/session/ExercisesListItem";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";

export default function ExercisesList() {
  const { workout } = useWorkoutsSessionStore();

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={workout.exercises}
      renderItem={({ item, index }) => <ExercisesListItem exercise={item} exerciseListIndex={index} />}
      keyExtractor={(item) => item._id.toString()}
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
