import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { useWorkoutsEditStore } from "@/stores/WorkoutsEditStore";
import Header from "@/components/workouts/edit/Header";
import AddExerciseBottomSheet from "@/components/workouts/edit/AddExerciseBottomSheet";
import CreateExerciseBottomSheet from "@/components/workouts/edit/CreateExerciseBottomSheet";
import EditExerciseBottomSheet from "@/components/workouts/edit/EditExerciseBottomSheet";
import LoadingScreen from "@/components/base/LoadingScreen";
import ExercisesList from "@/components/workouts/edit/ExercisesList";

export default function WorkoutsEditScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const { workout, isLoading, loadWorkout } = useWorkoutsEditStore();

  useEffect(() => {
    const workoutId = id ? parseInt(id, 10) : null;

    if (!workoutId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Ошибка", "Ошибка при получении информации о тренировке.");
      return router.back();
    }

    loadWorkout(workoutId);
  }, [id]);

  if (isLoading) {
    return <LoadingScreen text="Загрузка тренировки..." />;
  }

  if (!workout) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert("Ошибка", "Ошибка при получении информации о тренировке.");
    return router.back();
  }

  return (
    <>
      <Header />
      <ExercisesList />
      <AddExerciseBottomSheet />
      <CreateExerciseBottomSheet />
      <EditExerciseBottomSheet />
    </>
  );
}
