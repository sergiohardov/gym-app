import { useWorkoutsEditorReducer } from "@/reducers/useWorkoutsEditorReducer";
import { Exercise } from "@/types/db";
import { WorkoutsEditorContextProps, WorkoutsEditorState } from "@/types/workouts";
import { convertWorkoutCreateStateToNewFullTemplateWorkout } from "@/utils/format";
import { ExercisesModel } from "db/models/exercises";
import { TemplateWorkoutsModel } from "db/models/template-workouts";
import { router, useLocalSearchParams } from "expo-router";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const Context = createContext<WorkoutsEditorContextProps | undefined>(undefined);

export const WorkoutsEditorProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useWorkoutsEditorReducer();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useLocalSearchParams();

  const fetchExercises = useCallback(async () => {
    try {
      const data = await ExercisesModel.getAll();
      setExercises(data);
    } catch (error) {
      Alert.alert("Ошибка", "Произошла ошибка при получении упражнений.");
      router.back();
    }
  }, []);

  const fetchWorkoutData = useCallback(async (workoutId: number) => {
    try {
      const data = await TemplateWorkoutsModel.getFullById(workoutId);

      if (!data) {
        Alert.alert("Ошибка", "Тренировка не найдена", [{ text: "OK", onPress: () => router.back() }]);
        return;
      }

      dispatch({ type: "LOAD_WORKOUT", payload: data });
    } catch (error) {
      console.error("Ошибка загрузки тренировки:", error);
      Alert.alert("Ошибка", "Не удалось загрузить тренировку", [{ text: "OK", onPress: () => router.back() }]);
    }
  }, []);

  const validationState = useCallback(
    (state: WorkoutsEditorState) => {
      if (!state.name.trim()) return false;

      return state.exercises.some(
        (exercise) =>
          exercise.exercise.name &&
          Array.isArray(exercise.sets) &&
          exercise.sets.some((set) => set.weight.trim() && set.reps.trim() && set.rest.trim())
      );
    },
    [state.name, state.exercises]
  );

  const handleCancel = useCallback(() => {
    const hasChanges = state.name.trim() || state.exercises.length > 0;
    const actionText = state.isEditMode ? "Отменить изменения?" : "Отменить создание?";

    if (hasChanges) {
      Alert.alert(actionText, "Все несохраненные изменения будут потеряны", [
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
  }, [state.name, state.exercises, state.isEditMode, dispatch]);

  const handleSave = useCallback(async () => {
    if (!validationState(state)) {
      Alert.alert("Ошибка", "Заполните все обязательные поля: Название, упражнение и подходы");
      return;
    }

    if (!state.workoutId && state.isEditMode) {
      Alert.alert("Ошибка", "Некорректный ID тренировки");
      return;
    }

    setIsLoading(true);

    try {
      const workoutData = convertWorkoutCreateStateToNewFullTemplateWorkout(state);
      let result;

      if (state.isEditMode && state.workoutId) {
        // Режим редактирования
        result = await TemplateWorkoutsModel.updateFull(state.workoutId, workoutData);

        if (!result?.id) {
          throw new Error("Не удалось обновить тренировку");
        }

        Alert.alert("Успех", "Тренировка обновлена", [{ text: "OK", onPress: () => router.back() }]);
      } else {
        // Режим создания
        result = await TemplateWorkoutsModel.createFull(workoutData);

        if (!result?.id) {
          throw new Error("Не удалось создать тренировку");
        }

        Alert.alert("Успех", "Тренировка создана", [{ text: "OK", onPress: () => router.back() }]);
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      const errorMessage = state.isEditMode ? "Не удалось обновить тренировку" : "Не удалось создать тренировку";
      Alert.alert("Ошибка", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [state, state.isEditMode, state.workoutId]);

  // Инициализация
  useEffect(() => {
    const isEditMode = id !== undefined;
    const workoutId = id ? parseInt(id as string) : null;

    dispatch({ type: "SET_IS_EDIT_MODE", payload: isEditMode });
    dispatch({ type: "SET_WORKOUT_ID", payload: workoutId });

    (async () => {
      setIsLoading(true);

      // Подгрузка упражнений
      await fetchExercises();

      // Подгрузка данных тренировки (если редактирование)
      if (isEditMode && workoutId) {
        await fetchWorkoutData(workoutId);
      }

      setIsLoading(false);
    })();
  }, []);

  return (
    <Context.Provider
      value={{
        exercises,
        state,
        dispatch,
        handleCancel,
        handleSave,
        fetchExercises,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useWorkoutsEditorContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useWorkoutsEditorContext must be used within an WorkoutsEditorProvider");

  return context;
};
