import { useWorkoutValidation } from "@/hooks/useWorkoutValidation";
import { useWorkoutsCreateReducer } from "@/reducers/useWorkoutsCreateReducer";
import { Exercise } from "@/types/db";
import { WorkoutCreateContextProps } from "@/types/workouts";
import { convertWorkoutCreateStateToNewFullTemplateWorkout } from "@/utils/format";
import { ExercisesModel } from "db/models/exercises";
import { TemplateWorkoutsModel } from "db/models/template-workouts";
import { router } from "expo-router";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const Context = createContext<WorkoutCreateContextProps | undefined>(undefined);

export const WorkoutsCreateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useWorkoutsCreateReducer();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const isWorkoutValid = useWorkoutValidation(state);

  const fetchExercises = useCallback(async () => {
    try {
      const data = await ExercisesModel.getAll();
      setExercises(data);
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при получении упражнений.");
      router.back();
    }
  }, []);

  const refetchExercises = useCallback(async () => {
    await fetchExercises();
  }, [fetchExercises]);

  const handleCancel = useCallback(() => {
    const hasChanges = state.name.trim() || state.exercises.length > 0;

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
  }, [state.name, state.exercises, dispatch]);

  const handleSave = useCallback(async () => {
    if (!isWorkoutValid) {
      Alert.alert("Ошибка", "Заполните все обязательные поля: Название, упражнение и подходы");
      return;
    }

    try {
      const templateWorkout = await TemplateWorkoutsModel.createFull(
        convertWorkoutCreateStateToNewFullTemplateWorkout(state)
      );

      if (!templateWorkout.id) throw Error("");

      Alert.alert("Успех", "Тренировка сохранена", [{ text: "OK" }]);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось сохранить тренировку");
    } finally {
      router.back();
    }
  }, [state, isWorkoutValid]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return (
    <Context.Provider
      value={{
        exercises,
        state,
        dispatch,
        handleCancel,
        handleSave,
        refetchExercises,
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
