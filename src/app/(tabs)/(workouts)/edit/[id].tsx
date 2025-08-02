import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import { TemplateWorkoutsModel } from "db/models/template-workouts";
import * as Haptics from "expo-haptics";

import { Exercise, FullTemplateWorkout, TemplateExercise, TemplateSet, TemplateWorkout } from "@/types/db";
import { Colors } from "@/constants/Colors";
import Header from "@/components/workouts/edit/Header";
import ExercisesListItem from "@/components/workouts/edit/ExercisesListItem";
import AddExerciseBottomSheet from "@/components/workouts/edit/AddExerciseBottomSheet";
import CreateExerciseBottomSheet from "@/components/workouts/edit/CreateExerciseBottomSheet";
import EditExerciseBottomSheet from "@/components/workouts/edit/EditExerciseBottomSheet";
import EmptyScreen from "@/components/base/EmptyScreen";
import LoadingScreen from "@/components/base/LoadingScreen";
import { TemplateSetsModel } from "db/models/template-sets";

export default function WorkoutsEditScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const [workout, setWorkout] = useState<FullTemplateWorkout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [currentExerciseId, setCurrentExerciseId] = useState<TemplateExercise["id"] | null>(null);

  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  const fetchWorkout = async (id: TemplateWorkout["id"]) => {
    try {
      setIsLoading(true);
      const response = await TemplateWorkoutsModel.getFullById(id);
      if (!response) throw Error;
      setWorkout(response);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Ошибка", "Ошибка при получении информации о тренировке.");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWorkout = async (id: TemplateWorkout["id"]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      setRefreshing(true);
      const response = await TemplateWorkoutsModel.getFullById(id);
      if (!response) throw Error;
      setWorkout(response);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Ошибка", "Ошибка при получении информации о тренировке.");
      router.back();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const workoutId = id ? parseInt(id, 10) : null;

    if (!workoutId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Ошибка", "Ошибка при получении информации о тренировке.");
      return router.back();
    }

    fetchWorkout(workoutId);
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
      <Header title={workout.name} setIsAddModalVisible={setIsAddModalVisible} />

      <View style={styles.container}>
        {workout.templateExercises.length ? (
          <FlatList
            style={styles.listContainer}
            contentContainerStyle={styles.listContentContainer}
            data={workout.templateExercises}
            refreshing={refreshing}
            onRefresh={() => refreshWorkout(+id)}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ExercisesListItem
                handlePress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCurrentExerciseId(item.id);
                  setIsEditModalVisible(true);
                }}
                index={index}
                title={item.exercise.name}
                subtitle={item.sets.length ? `${item.sets.length} Подходов` : "Без подходов"}
              />
            )}
          />
        ) : (
          <EmptyScreen
            icon="barbell"
            title="Упражнения не добавлены"
            subtitle="Добавьте первое упражнение для этой тренировки"
          />
        )}
      </View>

      <AddExerciseBottomSheet
        workoutId={+id}
        isAddModalVisible={isAddModalVisible}
        setIsAddModalVisible={setIsAddModalVisible}
        setIsCreateModalVisible={setIsCreateModalVisible}
        refreshWorkout={refreshWorkout}
      />

      <CreateExerciseBottomSheet
        isCreateModalVisible={isCreateModalVisible}
        setIsCreateModalVisible={setIsCreateModalVisible}
        setIsAddModalVisible={setIsAddModalVisible}
      />
      
      <EditExerciseBottomSheet
        currentExerciseId={currentExerciseId}
        setCurrentExerciseId={setCurrentExerciseId}
        isEditModalVisible={isEditModalVisible}
        setIsEditModalVisible={setIsEditModalVisible}
        workoutId={+id}
        refreshWorkout={refreshWorkout}
      />
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingVertical: 16,
  },
  listContentContainer: {
    gap: 10,
  },
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

// остановился на том что нужно сделать контекст или стор
// на экран редактирования грузить всю информацию о тренировке
// при добавлении чего либо обновлять информацию о тренировке