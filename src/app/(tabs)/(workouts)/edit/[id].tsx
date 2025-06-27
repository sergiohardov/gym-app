import { db } from "db/client";
import { templateExercises, templateWorkouts } from "db/schema";
import { and, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator, Text, Alert } from "react-native";
import { Colors } from "@/constants/Colors";
import Header from "@/components/workouts/edit/Header";
import AddExerciseBottomSheet from "@/components/workouts/edit/AddExerciseBottomSheet";
import ExercisesListItem from "@/components/workouts/edit/ExercisesListItem";
import CreateExerciseBottomSheet from "@/components/workouts/edit/CreateExerciseBottomSheet";
import EditExerciseBottomSheet from "@/components/workouts/edit/EditExerciseBottomSheet";
import { Exercise, TemplateExercise, TemplateSet, TemplateWorkout } from "@/types/db";
import { TemplateWorkoutsModel } from "db/models/template-workouts";

export default function WorkoutsEditScreen() {
  const { id } = useLocalSearchParams();

  const [workout, setWorkout] = useState<TemplateWorkout | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<TemplateExercise['id'] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const workout = await TemplateWorkoutsModel.getById(+id);
        if (!workout) throw Error;
        setWorkout(workout);
      } catch (error) {
        Alert.alert("Ошибка", "Ошибка получения информации о тренировки");
        console.log(error);
        router.back();
      }
    })();
  }, [id]);

  const { data, error } = useLiveQuery(
    db.query.templateExercises.findMany({
      where: eq(templateExercises.templateWorkoutId, +id),
      with: { exercise: {}, sets: {} },
    }),
    [id]
  );

  if (!id || error) {
    Alert.alert("Ошибка", "Ошибка загрузки тренировки");
    console.log(error);
    router.back();
  }

  if (!workout || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
        <Text style={styles.loadingText}>Загрузка тренировки...</Text>
      </View>
    );
  }

  return (
    <>
      <Header title={workout.name} />

      <View style={styles.container}>
        <FlatList
          style={styles.listContainer}
          contentContainerStyle={styles.listContentContainer}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ExercisesListItem
              handlePress={() => {
                setCurrentExerciseId(item.id);
                setIsEditModalVisible(true);
              }}
              icon="checkmark"
              title={item.exercise.name}
              subtitle={item.sets.length ? `${item.sets.length} Подходов` : "Без подходов"}
            />
          )}
          ListFooterComponent={() => (
            <ExercisesListItem handlePress={() => setIsAddModalVisible(true)} icon="add" title="Добавить упражнение" />
          )}
        />
      </View>

      <AddExerciseBottomSheet
        workoutId={+id}
        isAddModalVisible={isAddModalVisible}
        setIsAddModalVisible={setIsAddModalVisible}
        setIsCreateModalVisible={setIsCreateModalVisible}
      />
      <CreateExerciseBottomSheet
        isCreateModalVisible={isCreateModalVisible}
        setIsCreateModalVisible={setIsCreateModalVisible}
        setIsAddModalVisible={setIsAddModalVisible}
      />
      <EditExerciseBottomSheet
        currentExerciseId={currentExerciseId}
        isEditModalVisible={isEditModalVisible}
        setCurrentExerciseId={setCurrentExerciseId}
        setIsEditModalVisible={setIsEditModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
