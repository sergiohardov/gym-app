import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { HistoryWorkoutsModel } from "db/models/history-workouts";
import { formatTime } from "@/utils/format";
import Button from "@/components/base/Button";
import Card from "@/components/base/Card";
import EmptyScreen from "@/components/base/EmptyScreen";
import { FullHistoryWorkout } from "@/types/db";

export default function WorkoutHistoryDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [workout, setWorkout] = useState<FullHistoryWorkout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkoutDetails = async () => {
      if (!id || Array.isArray(id)) {
        setError("Некорректный ID тренировки");
        setIsLoading(false);
        return;
      }

      try {
        const workoutId = parseInt(id);
        if (isNaN(workoutId)) {
          setError("Некорректный ID тренировки");
          setIsLoading(false);
          return;
        }

        const data = await HistoryWorkoutsModel.getFullById(workoutId);

        if (!data) {
          setError("Тренировка не найдена");
        } else {
          setWorkout(data);
        }
      } catch (err) {
        console.error("Ошибка загрузки тренировки:", err);
        setError("Ошибка загрузки данных");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkoutDetails();
  }, [id]);

  const handleDeleteWorkout = () => {
    if (!workout) return;

    Alert.alert("Удалить тренировку?", "Эта тренировка будет удалена из истории безвозвратно", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          try {
            await HistoryWorkoutsModel.remove(workout.id);
            router.back();
          } catch (error) {
            Alert.alert("Ошибка", "Не удалось удалить тренировку");
          }
        },
      },
    ]);
  };

  const getWorkoutStats = () => {
    if (!workout) return null;

    const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
    const totalWeight = workout.exercises.reduce(
      (sum, exercise) =>
        sum +
        exercise.sets.reduce((setSum, set) => {
          if (set.weight && set.reps) {
            return setSum + set.weight * set.reps;
          }
          return setSum;
        }, 0),
      0
    );

    return {
      totalExercises: workout.exercises.length,
      totalSets,
      totalWeight,
      duration: workout.duration ? formatTime(workout.duration) : "Не указано",
    };
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка тренировки...</Text>
      </View>
    );
  }

  if (error || !workout) {
    return (
      <EmptyScreen icon="alert-circle-outline" title="Ошибка загрузки" subtitle={error || "Тренировка не найдена"} />
    );
  }

  const stats = getWorkoutStats();
  const workoutDate = new Date(workout.createdAt);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Заголовок и основная информация */}
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="fitness" size={24} color={Colors.primary} />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            <Text style={styles.workoutDate}>
              {workoutDate.toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              в{" "}
              {workoutDate.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </Card>

      {/* Статистика тренировки */}
      {stats && (
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Статистика тренировки</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="barbell-outline" size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.statValue}>{stats.totalExercises}</Text>
              <Text style={styles.statLabel}>упражнений</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="repeat-outline" size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.statValue}>{stats.totalSets}</Text>
              <Text style={styles.statLabel}>подходов</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="time-outline" size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.statValue}>{stats.duration}</Text>
              <Text style={styles.statLabel}>времени</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="trending-up-outline" size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.statValue}>{stats.totalWeight}</Text>
              <Text style={styles.statLabel}>кг общий вес</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Детали упражнений */}
      <Card style={styles.exercisesCard}>
        <Text style={styles.sectionTitle}>Выполненные упражнения</Text>

        {workout.exercises.map((exercise, exerciseIndex) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{exerciseIndex + 1}</Text>
              </View>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </View>

            <View style={styles.setsContainer}>
              <View style={styles.setsHeader}>
                <Text style={styles.setHeaderText}>Подход</Text>
                <Text style={styles.setHeaderText}>Вес (кг)</Text>
                <Text style={styles.setHeaderText}>Повторы</Text>
                <Text style={styles.setHeaderText}>Отдых (с)</Text>
              </View>

              {exercise.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setCellText}>#{setIndex + 1}</Text>
                  <Text style={styles.setCellText}>{set.weight || "-"}</Text>
                  <Text style={styles.setCellText}>{set.reps || "-"}</Text>
                  <Text style={styles.setCellText}>{set.rest || "-"}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Card>

      {/* Кнопки действий */}
      <View style={styles.actionsContainer}>
        <Button
          title="Удалить тренировку"
          icon={<Ionicons name="trash-outline" size={20} color={Colors.primary} />}
          callback={handleDeleteWorkout}
          style={styles.deleteButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.surface,
  },

  // Header Card
  headerCard: {
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
    lineHeight: 24,
  },
  workoutDate: {
    fontSize: 14,
    color: Colors.surface,
    fontWeight: "500",
  },

  // Stats Card
  statsCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    gap: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.surface,
    textAlign: "center",
  },

  // Exercises Card
  exercisesCard: {
    padding: 20,
  },
  exerciseItem: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary,
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },

  // Sets Table
  setsContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    overflow: "hidden",
  },
  setsHeader: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  setHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.secondary,
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  setCellText: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
    textAlign: "center",
  },

  // Actions
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
});
