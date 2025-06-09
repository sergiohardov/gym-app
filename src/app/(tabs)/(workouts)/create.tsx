import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "db/client";
import { exercises, workouts } from "db/schema";
import Button from "@/components/base/Button";
import { Colors } from "@/constants/Colors";
import { useWorkoutReducer } from "@/reducers/useWorkoutReducer";
import { useWorkoutValidation } from "@/hooks/useWorkoutValidation";
import WorkoutExerciseCard from "@/components/workouts/WorkoutExerciseCard";
import WorkoutExerciseModal from "@/components/workouts/WorkoutExercisesModal";
import Input from "@/components/base/Input";

export default function CreateWorkout() {
  const [state, dispatch] = useWorkoutReducer();
  const { data: dbExercises = [] } = useLiveQuery(db.select().from(exercises));
  const isWorkoutValid = useWorkoutValidation(state);

  const handleCancel = useCallback(() => {
    const hasChanges = state.title.trim() || state.exercises.length > 0;

    if (hasChanges) {
      Alert.alert(
        "Отменить создание?",
        "Все несохраненные изменения будут потеряны",
        [
          { text: "Продолжить редактирование", style: "cancel" },
          {
            text: "Отменить",
            style: "destructive",
            onPress: () => {
              dispatch({ type: "RESET" });
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  }, [state.title, state.exercises, dispatch]);

  const handleSave = useCallback(async () => {
    if (!isWorkoutValid) {
      Alert.alert("Ошибка", "Заполните все обязательные поля");
      return;
    }

    try {
      const validExercises = state.exercises
        .filter(
          (ex) => ex.exercise_id && Array.isArray(ex.sets) && ex.sets.length > 0
        )
        .map((ex) => ({
          ...ex,
          sets: ex.sets.filter(
            (set) =>
              set.weight.trim() &&
              set.reps.trim() &&
              parseFloat(set.weight) > 0 &&
              parseInt(set.reps) > 0
          ),
        }))
        .filter((ex) => ex.sets.length > 0);

      const workout = {
        title: state.title.trim(),
        exercises: JSON.stringify(validExercises),
        created_at: new Date().toISOString(),
      };

      await db.insert(workouts).values(workout);

      Alert.alert("Успех", "Тренировка сохранена", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить тренировку");
      console.error("Error saving workout:", error);
    }
  }, [state, isWorkoutValid]);

  const getExerciseTitle = useMemo(
    () =>
      (id: number): string => {
        const exercise = dbExercises.find((item) => item.id === id);
        return exercise ? exercise.title : "";
      },
    [dbExercises]
  );

  const handleAddExercise = useCallback(() => {
    dispatch({ type: "ADD_EXERCISE" });
  }, [dispatch]);

  const handleRemoveExercise = useCallback(
    (id: number) => {
      dispatch({ type: "REMOVE_EXERCISE", payload: id });
    },
    [dispatch]
  );

  const handleAddSet = useCallback(
    (exerciseId: number) => {
      dispatch({ type: "ADD_SET", payload: exerciseId });
    },
    [dispatch]
  );

  const handleRemoveSet = useCallback(
    (exerciseId: number, setId: string) => {
      dispatch({ type: "REMOVE_SET", payload: { exerciseId, setId } });
    },
    [dispatch]
  );

  const handleUpdateSet = useCallback(
    (exerciseId: number, setId: string, field: string, value: string) => {
      dispatch({
        type: "UPDATE_SET",
        payload: { exerciseId, setId, field: field as any, value },
      });
    },
    [dispatch]
  );

  const handleSelectExercise = useCallback(
    (exerciseId: number) => {
      dispatch({ type: "SHOW_MODAL", payload: exerciseId });
    },
    [dispatch]
  );

  const handleExerciseSelection = useCallback(
    (exerciseId: number) => {
      if (state.selectedExerciseId !== null) {
        dispatch({
          type: "UPDATE_EXERCISE",
          payload: {
            id: state.selectedExerciseId,
            field: "exercise_id",
            value: exerciseId,
          },
        });
        dispatch({ type: "HIDE_MODAL" });
      }
    },
    [dispatch, state.selectedExerciseId]
  );

  const handleModalClose = useCallback(() => {
    dispatch({ type: "HIDE_MODAL" });
  }, [dispatch]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Создать тренировку",
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} disabled={!isWorkoutValid}>
              <Ionicons name="checkmark" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Название</Text>
            <Input
              placeholder="Введите название тренировки"
              value={state.title}
              setValue={(value) =>
                dispatch({ type: "SET_TITLE", payload: value })
              }
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {`Упражнения (${state.exercises.length})`}
            </Text>

            {state.exercises.map((exercise, index) => (
              <WorkoutExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                getExerciseTitle={getExerciseTitle}
                onSelectExercise={handleSelectExercise}
                onRemoveExercise={handleRemoveExercise}
                onAddSet={handleAddSet}
                onRemoveSet={handleRemoveSet}
                onUpdateSet={handleUpdateSet}
              />
            ))}

            <Button
              title="Добавить упражнение"
              icon={<Ionicons name="add" size={24} color={Colors.primary} />}
              callback={handleAddExercise}
            />
          </View>
        </View>

        <WorkoutExerciseModal
          visible={state.modalVisible}
          exercises={dbExercises}
          onClose={handleModalClose}
          onSelectExercise={handleExerciseSelection}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 20,
  },
  sectionContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
  },
});
