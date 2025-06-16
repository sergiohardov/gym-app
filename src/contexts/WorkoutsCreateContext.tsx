import { useWorkoutValidation } from "@/hooks/useWorkoutValidation";
import { useWorkoutsCreateReducer } from "@/reducers/useWorkoutsCreateReducer";
import { Exercise } from "@/types/db";
import { WorkoutCreateContextProps } from "@/types/workouts";
import { getExercises, createFullWorkout } from "db/queries";
import { router } from "expo-router";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const Context = createContext<WorkoutCreateContextProps | undefined>(undefined);

export const WorkoutsCreateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useWorkoutsCreateReducer();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const isWorkoutValid = useWorkoutValidation(state);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data);
      } catch (error) {
        Alert.alert("Ошибка", "Произошла ошибка при получении упражнений.");
        router.back();
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
          text: "Сбросить",
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
      Alert.alert("Ошибка", "Заполните все обязательные поля: Название, упражнение и подходы");
      return;
    }

    try {
      const workout = await createFullWorkout({
        title: state.title,
        exercises: state.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          sets: exercise.sets.map((set) => ({
            weight: +set.weight,
            reps: +set.reps,
            rest: +set.rest,
          })),
        })),
      });

      if (!workout.id) throw Error("");

      Alert.alert("Успех", "Тренировка сохранена", [{ text: "OK" }]);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить тренировку");
    } finally {
      router.back();
    }
  }, [state, isWorkoutValid]);

  const getExerciseTitle = useMemo(
    () =>
      (id: number): string => {
        const exercise = exercises.find((item) => item.id === id);
        return exercise ? exercise.title : "";
      },
    [exercises]
  );

  return (
    <Context.Provider
      value={{
        exercises,
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
