import { useWorkoutsSessionReducer, WorkoutsSessionState } from "@/reducers/useWorkoutsSessionReduser";
import { Exercise, WorkoutSet } from "@/types/session";
import { workoutUtils } from "@/utils/session";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from "react";

interface WorkoutsSessionContextProps {
  state: WorkoutsSessionState;
  playerInfo: { title: string; subtitle: string };
  currentExercise: Exercise;
  currentSet: WorkoutSet;
  handlePlayPause: () => void;
  handleSelectExercise: (exerciseIndex: number) => void;
  handleNextStep: () => void;
}

const Context = createContext<WorkoutsSessionContextProps | undefined>(undefined);

export const WorkoutsSessionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useWorkoutsSessionReducer();

  const durationIntervalRef = useRef<number | null>(null);
  const restIntervalRef = useRef<number | null>(null);

  // Объединенная логика таймеров
  useEffect(() => {
    // Общий таймер тренировки
    if (state.isPlaying && !state.isWorkoutEnd) {
      durationIntervalRef.current = setInterval(() => {
        dispatch({ type: "INCREMENT_DURATION_TIME" });
      }, 1000);
    } else if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Таймер отдыха
    if (state.isResting && state.isPlaying) {
      restIntervalRef.current = setInterval(() => {
        dispatch({ type: "INCREMENT_REST_TIME" });
      }, 1000);
    } else if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }

    return () => {
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [state.isPlaying, state.isWorkoutEnd, state.isResting]);

  // Автоматическое завершение отдыха
  useEffect(() => {
    if (state.isResting && state.currentRestDuration > 0 && state.restTime >= state.currentRestDuration) {
      dispatch({ type: "NEXT_STEP" });
    }
  }, [state.restTime, state.isResting, state.currentRestDuration]);

  // Вычисляемые значения
  const currentExercise = state.workout.exercises[state.currentExerciseIndex];
  const currentSet = currentExercise?.sets[state.currentSetIndex];

  const playerInfo = useMemo(() => {
    if (state.isWorkoutEnd) {
      return { title: "Тренировка завершена!", subtitle: "" };
    }

    if (!state.isWorkoutStart) {
      return { title: "Начните тренировку", subtitle: "" };
    }

    if (state.isResting) {
      const remaining = state.currentRestDuration - state.restTime;
      return {
        title: currentExercise.name,
        subtitle: workoutUtils.formatRestTime(remaining),
      };
    }

    if (currentSet) {
      const completedSets = workoutUtils.getCompletedSetsCount(currentExercise);
      return {
        title: currentExercise.name,
        subtitle: workoutUtils.formatSetInfo(
          completedSets,
          currentExercise.sets.length,
          currentSet.weight,
          currentSet.reps
        ),
      };
    }

    return { title: currentExercise.name, subtitle: "" };
  }, [state, currentExercise, currentSet]);

  const handlePlayPause = useCallback(() => {
    if (state.isWorkoutEnd) return;

    dispatch({ type: "SET_IS_PLAYING", payload: !state.isPlaying });

    if (!state.isWorkoutStart) {
      dispatch({ type: "SET_IS_WORKOUT_START", payload: true });
    }
  }, [state.isPlaying, state.isWorkoutStart, state.isWorkoutEnd]);

  const handleSelectExercise = useCallback(
    (exerciseIndex: number) => {
      if (state.isPlaying || state.isResting || state.isWorkoutEnd) return;

      const selectedExercise = state.workout.exercises[exerciseIndex];
      if (selectedExercise.complete) return;

      const firstIncompleteSetIndex = workoutUtils.findFirstIncompleteSet(selectedExercise);

      if (firstIncompleteSetIndex !== -1) {
        dispatch({ type: "SET_CURRENT_EXERCISE_INDEX", payload: exerciseIndex });
        dispatch({ type: "SET_CURRENT_SET_INDEX", payload: firstIncompleteSetIndex });
      }
    },
    [state.isPlaying, state.isResting, state.isWorkoutEnd, state.workout.exercises]
  );

  const handleNextStep = useCallback(() => {
    if (!state.isPlaying || state.isWorkoutEnd) return;
    dispatch({ type: "NEXT_STEP" });
  }, [state.isPlaying, state.isWorkoutEnd]);

  return (
    <Context.Provider
      value={{
        state,
        playerInfo,
        currentExercise,
        currentSet,
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
  if (!context) {
    throw new Error("useWorkoutsSessionContext must be used within a WorkoutsSessionProvider");
  }
  return context;
};
