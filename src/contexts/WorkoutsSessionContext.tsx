import {
  useWorkoutsSessionReducer,
  WorkoutsSessionAction,
  WorkoutsSessionState,
} from "@/reducers/useWorkoutsSessionReduser";
import { createContext, Dispatch, ReactNode, useContext, useEffect, useRef } from "react";

export interface WorkoutsSessionContextProps {
  state: WorkoutsSessionState;
  dispatch: Dispatch<WorkoutsSessionAction>;
  handlePlayPause: () => void;
  handleSelectExercise: (exerciseIndex: number) => void;
  handleNextStep: () => void;
}

const Context = createContext<WorkoutsSessionContextProps | undefined>(undefined);

export const WorkoutsSessionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useWorkoutsSessionReducer();

  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Управление общим таймером тренировки
  useEffect(() => {
    if (state.isPlaying && !state.isWorkoutEnd) {
      durationIntervalRef.current = setInterval(() => {
        dispatch({ type: "INCREMENT_DURATION_TIME" });
      }, 1000);
    } else {
      if (durationIntervalRef.current !== null) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }

    return () => {
      if (durationIntervalRef.current !== null) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [state.isPlaying, state.isWorkoutEnd]);

  // Управление таймером отдыха
  useEffect(() => {
    if (state.isResting && state.isPlaying) {
      restIntervalRef.current = setInterval(() => {
        dispatch({ type: "INCREMENT_REST_TIME" });
      }, 1000);
    } else {
      if (restIntervalRef.current !== null) {
        clearInterval(restIntervalRef.current);
        restIntervalRef.current = null;
      }
    }

    return () => {
      if (restIntervalRef.current !== null) {
        clearInterval(restIntervalRef.current);
      }
    };
  }, [state.isResting, state.isPlaying]);

  // Проверка окончания отдыха
  useEffect(() => {
    if (state.isResting && state.currentRestDuration > 0) {
      if (state.restTime >= state.currentRestDuration) {
        // Отдых закончен, переходим к следующему подходу или упражнению
        dispatch({ type: "END_REST" });
        handleNextStep();
      } else {
        // Обновляем отображение оставшегося времени отдыха
        const remainingTime = state.currentRestDuration - state.restTime;
        dispatch({
          type: "SET_PLAYER_SUBTITLE",
          payload: `Отдых: ${remainingTime} сек`,
        });
      }
    }
  }, [state.restTime, state.isResting, state.currentRestDuration]);

  // Обновление информации о текущем подходе при смене упражнения
  useEffect(() => {
    if (state.isWorkoutStart && !state.isResting && !state.isWorkoutEnd) {
      const currentExercise = state.workout.exercises[state.currentExerciseIndex];
      const completedSets = currentExercise.sets.slice(0, state.currentSetIndex).filter((set) => set.complete).length;
      const totalSets = currentExercise.sets.length;

      dispatch({ type: "SET_PLAYER_TITLE", payload: currentExercise.name });
      dispatch({
        type: "SET_PLAYER_SUBTITLE",
        payload: `Подход ${completedSets + 1}/${totalSets}`,
      });
    }
  }, [state.currentExerciseIndex, state.currentSetIndex, state.isWorkoutStart, state.isResting, state.isWorkoutEnd]);

  const handlePlayPause = () => {
    if (state.isWorkoutEnd) return;

    dispatch({ type: "SET_IS_PLAYING", payload: !state.isPlaying });

    if (!state.isWorkoutStart) {
      dispatch({ type: "SET_IS_WORKOUT_START", payload: true });

      const currentExercise = state.workout.exercises[state.currentExerciseIndex];
      const totalSets = currentExercise.sets.length;

      dispatch({ type: "SET_PLAYER_TITLE", payload: currentExercise.name });
      dispatch({ type: "SET_PLAYER_SUBTITLE", payload: `Подход 1/${totalSets}` });
    }
  };

  const handleSelectExercise = (exerciseIndex: number) => {
    // Можно выбирать упражнение только если тренировка на паузе или не начата, и не во время отдыха
    if (state.isPlaying || state.isResting || state.isWorkoutEnd) return;

    const selectedExercise = state.workout.exercises[exerciseIndex];
    if (selectedExercise.complete) return;

    // Находим первый незавершенный подход
    const firstIncompleteSetIndex = selectedExercise.sets.findIndex((set) => !set.complete);

    if (firstIncompleteSetIndex !== -1) {
      dispatch({ type: "SET_CURRENT_EXERCISE_INDEX", payload: exerciseIndex });
      dispatch({ type: "SET_CURRENT_SET_INDEX", payload: firstIncompleteSetIndex });
    }
  };

  const handleNextStep = () => {
    if (!state.isPlaying || state.isWorkoutEnd) return;

    const currentExercise = state.workout.exercises[state.currentExerciseIndex];
    const currentSet = currentExercise.sets[state.currentSetIndex];

    if (state.isResting) {
      // Если сейчас отдых, принудительно заканчиваем его
      dispatch({ type: "END_REST" });
      return;
    }

    // Завершаем текущий подход
    dispatch({ type: "COMPLETE_CURRENT_SET" });

    // Проверяем, есть ли еще подходы в текущем упражнении
    const nextSetIndex = state.currentSetIndex + 1;

    if (nextSetIndex < currentExercise.sets.length) {
      // Есть еще подходы - начинаем отдых с временем из ТЕКУЩЕГО завершенного подхода
      dispatch({ type: "START_REST", payload: currentSet.rest });
      dispatch({ type: "NEXT_SET" });
    } else {
      // Это был последний подход в упражнении
      dispatch({ type: "COMPLETE_CURRENT_EXERCISE" });

      // Проверяем, есть ли еще незавершенные упражнения (во всей тренировке)
      if (!areAllExercisesComplete(state.workout.exercises)) {
        // Есть незавершенные упражнения - переходим к следующему
        dispatch({ type: "NEXT_EXERCISE" });
      } else {
        // Все упражнения завершены
        dispatch({ type: "SET_IS_WORKOUT_END", payload: true });
        dispatch({ type: "SET_IS_PLAYING", payload: false });
        dispatch({ type: "SET_PLAYER_TITLE", payload: "Тренировка завершена!" });
        dispatch({ type: "SET_PLAYER_SUBTITLE", payload: "" });
      }
    }
  };

  // Функция для поиска следующего незавершенного упражнения
  const findNextIncompleteExercise = (exercises: typeof state.workout.exercises, currentIndex: number): number => {
    // Сначала ищем после текущего упражнения
    for (let i = currentIndex + 1; i < exercises.length; i++) {
      if (!exercises[i].complete) {
        return i;
      }
    }

    // Если не нашли, ищем с начала до текущего упражнения
    for (let i = 0; i < currentIndex; i++) {
      if (!exercises[i].complete) {
        return i;
      }
    }

    return -1; // Все упражнения завершены
  };

  // Функция для проверки, завершены ли все упражнения
  const areAllExercisesComplete = (exercises: typeof state.workout.exercises): boolean => {
    return exercises.every((exercise) => exercise.complete);
  };

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        handlePlayPause,
        handleSelectExercise,
        handleNextStep,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useWorkoutsSessionContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useWorkoutsSessionContext must be used within a WorkoutsSessionProvider");

  return context;
};
