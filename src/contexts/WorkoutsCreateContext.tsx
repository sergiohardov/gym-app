import { useWorkoutValidation } from "@/hooks/useWorkoutValidation";
import { useWorkoutsCreateReducer } from "@/reducers/useWorkoutsCreateReducer";
import { Exercise } from "@/types/db";
import { WorkoutCreateContextProps } from "@/types/workouts";
import { getExercises } from "db/queries";
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
    // if (!isWorkoutValid) {
    //   Alert.alert("Ошибка", "Заполните все обязательные поля");
    //   return;
    // }

    // try {
    //   const validExercises = state.exercises
    //     .filter(
    //       (ex) => ex.exercise_id && Array.isArray(ex.sets) && ex.sets.length > 0
    //     )
    //     .map((ex) => ({
    //       ...ex,
    //       sets: ex.sets.filter(
    //         (set) =>
    //           set.weight.trim() &&
    //           set.reps.trim() &&
    //           parseFloat(set.weight) > 0 &&
    //           parseInt(set.reps) > 0
    //       ),
    //     }))
    //     .filter((ex) => ex.sets.length > 0);

    //   const workout = {
    //     title: state.title.trim(),
    //     exercises: JSON.stringify(validExercises),
    //     created_at: new Date().toISOString(),
    //   };

    //   await db.insert(workouts).values(workout);

    //   Alert.alert("Успех", "Тренировка сохранена", [
    //     { text: "OK", onPress: () => router.back() },
    //   ]);
    // } catch (error) {
    //   Alert.alert("Ошибка", "Не удалось сохранить тренировку");
    //   console.error("Error saving workout:", error);
    // }

    // await createWorkout({
    //   title: state.title,
    // });

    router.back();
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
