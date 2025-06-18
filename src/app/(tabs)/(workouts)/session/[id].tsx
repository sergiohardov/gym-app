import ExercisesList from "@/components/workouts/session/ExercisesList";
import Header from "@/components/workouts/session/Header";
import Player from "@/components/workouts/session/Player";
import { useWorkoutsSessionStore } from "@/stores/WorkoutsSessionStore";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet, Alert } from "react-native";
import { Colors } from "@/constants/Colors";
import { TemplateWorkoutsModel } from "db/models/template-workouts";

export default function WorkoutsSessionScreen() {
  const { id } = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { loadWorkout, resetStore, isLoading } = useWorkoutsSessionStore();

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
  }, [id]);

  // Обработка ошибок
  useEffect(() => {
    if (error) {
      Alert.alert(
        "Ошибка",
        error,
        [
          {
            text: "Вернуться к списку",
            onPress: () => router.back(),
          },
        ],
        { cancelable: false }
      );
    }
  }, [error]);

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
    <View style={{ flex: 1 }}>
      <Header />
      <ExercisesList />
      <Player />
    </View>
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