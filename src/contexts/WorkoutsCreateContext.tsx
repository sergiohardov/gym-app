import { useWorkoutValidation } from "@/hooks/useWorkoutValidation";
import { useWorkoutsCreateReducer } from "@/reducers/useWorkoutsCreateReducer";
import { Exercise, NewSet, NewWorkout, NewWorkoutExercise } from "@/types/db";
import { WorkoutCreateContextProps } from "@/types/workouts";
import { addExerciseToWorkout, addSetToWorkoutExercise, createWorkout, getExercises } from "db/queries";
import { router } from "expo-router";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const Context = createContext<WorkoutCreateContextProps | undefined>(undefined);

export const WorkoutsCreateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useWorkoutsCreateReducer();
  const [dbExercises, setDbExercises] = useState<Exercise[]>([]);
  const isWorkoutValid = useWorkoutValidation(state);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        setDbExercises(data);
      } catch (error) {
        console.error("Ошибка при получении упражнений:", error);
      }
    };

    fetchExercises();
  }, []);

  const handleCancel = useCallback(() => {
    const hasChanges = state.title.trim() || state.exercises.length > 0;

    if (hasChanges) {
      Alert.alert("Отменить создание?", "Все несохраненные изменения будут потеряны", [
        { text: "Продолжить редактирование", style: "cancel" },
        {
          text: "Отменить",
          style: "destructive",
          onPress: () => {
            dispatch({ type: "RESET" });
            router.back();
          },
        },
      ]);
    } else {
      router.back();
    }
  }, [state.title, state.exercises, dispatch]);

  const handleSave = useCallback(async () => {
    if (!isWorkoutValid) {
      Alert.alert("Ошибка", "Заполните все обязательные поля: Название, тренировку и подход");
      return;
    }

    try {
      const newWorkout: NewWorkout = {
        title: state.title,
      };

      const workout = await createWorkout(newWorkout);
      if (!workout.id) return;

      for (const [exerciseIndex, exercise] of state.exercises.entries()) {
        const newWorkoutExercise: NewWorkoutExercise = {
          workoutId: workout.id,
          exerciseId: exercise.exerciseId,
          order: exerciseIndex + 1,
        };

        const [workoutExercise] = await addExerciseToWorkout(newWorkoutExercise);
        if (!workoutExercise?.id) continue;

        for (const [setIndex, set] of exercise.sets.entries()) {
          const newSet: NewSet = {
            workoutExerciseId: workoutExercise.id,
            order: setIndex + 1,
            weight: +set.weight,
            reps: +set.reps,
            rest: +set.rest,
          };

          await addSetToWorkoutExercise(newSet);
        }
      }

      Alert.alert("Успех", "Тренировка сохранена", [{ text: "OK" }]);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить тренировку");
      console.error("Error saving workout:", error);
    } finally {
      router.back();
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

  return (
    <Context.Provider
      value={{
        dbExercises,
        getExerciseTitle,
        state,
        dispatch,
        handleCancel,
        handleSave,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useWorkoutsCreateContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useWorkoutCreateContext must be used within an WorkoutCreateProvider");

  return context;
};
