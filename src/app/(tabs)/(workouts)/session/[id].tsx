import ExercisesList from "@/components/workouts/session/ExercisesList";
import Header from "@/components/workouts/session/Header";
import Player from "@/components/workouts/session/Player";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet, Alert, SafeAreaView } from "react-native";
import { Colors } from "@/constants/Colors";
import { TemplateWorkoutsModel } from "db/models/template-workouts";

export default function WorkoutsSessionScreen() {
  const { id } = useLocalSearchParams();
  const { loadWorkout, resetStore, isLoading } = useWorkoutsSessionStore();
  const [error, setError] = useState<string | null>(null);

  // TODO: обработать сценарий кнопки назад и свайп назад может быть в хедере сделаить или в хуке и использовать тут и в хедере

  useEffect(() => {
    const loadWorkoutData = async () => {
      if (!id || Array.isArray(id)) {
        setError("Некорректный ID тренировки");
        return;
      }

      try {
        resetStore(); // Сбрасываем состояние store

        const workoutId = parseInt(id);
        if (isNaN(workoutId)) {
          setError("Некорректный ID тренировки");
          return;
        }

        const workout = await TemplateWorkoutsModel.getFullById(workoutId);

        if (!workout) {
          setError("Тренировка не найдена");
          return;
        }

        // Проверяем, что тренировка содержит упражнения
        if (!workout.templateExercises || workout.templateExercises.length === 0) {
          setError("В тренировке нет упражнений");
          return;
        }

        loadWorkout(workout);
      } catch (err) {
        console.error("Ошибка загрузки тренировки:", err);
        setError("Ошибка загрузки тренировки");
      }
    };

    loadWorkoutData();

    // Cleanup при размонтировании компонента
    return () => {
      resetStore();
    };
  }, [id, loadWorkout, resetStore]);

  // Обработка ошибок
  useEffect(() => {
    if (error) {
      Alert.alert(
        "Ошибка",
        error,
        [
          {
            text: "Вернуться к списку",
            onPress: () => {
              resetStore();
              router.back();
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [error, resetStore]);

  // Показываем загрузку
  if (isLoading && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
        <Text style={styles.loadingText}>Загрузка тренировки...</Text>
      </View>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ExercisesList />
      <Player />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.surface,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
