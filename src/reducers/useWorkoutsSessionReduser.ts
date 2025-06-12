import { workoutMock } from "@/mock/workout";
import { Workout } from "@/types/session";
import { workoutUtils } from "@/utils/session";
import { useReducer, useMemo } from "react";

export interface WorkoutsSessionState {
  workout: Workout;
  currentExerciseIndex: number;
  currentSetIndex: number;
  durationTime: number;
  restTime: number;
  currentRestDuration: number;
  isResting: boolean;
  isPlaying: boolean;
  isWorkoutStart: boolean;
  isWorkoutEnd: boolean;
}

export type WorkoutsSessionAction =
  | { type: "SET_CURRENT_EXERCISE_INDEX"; payload: number }
  | { type: "SET_CURRENT_SET_INDEX"; payload: number }
  | { type: "INCREMENT_DURATION_TIME" }
  | { type: "INCREMENT_REST_TIME" }
  | { type: "SET_IS_RESTING"; payload: boolean }
  | { type: "SET_IS_WORKOUT_START"; payload: boolean }
  | { type: "SET_IS_WORKOUT_END"; payload: boolean }
  | { type: "SET_IS_PLAYING"; payload: boolean }
  | { type: "COMPLETE_CURRENT_SET" }
  | { type: "COMPLETE_CURRENT_EXERCISE" }
  | { type: "START_REST"; payload: number }
  | { type: "END_REST" }
  | { type: "NEXT_STEP" };

const initialState: WorkoutsSessionState = {
  workout: workoutMock,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  durationTime: 0,
  restTime: 0,
  currentRestDuration: 0,
  isResting: false,
  isPlaying: false,
  isWorkoutStart: false,
  isWorkoutEnd: false,
};

function workoutsSessionReducer(state: WorkoutsSessionState, action: WorkoutsSessionAction): WorkoutsSessionState {
  switch (action.type) {
    case "SET_CURRENT_EXERCISE_INDEX":
      return { ...state, currentExerciseIndex: action.payload };

    case "SET_CURRENT_SET_INDEX":
      return { ...state, currentSetIndex: action.payload };

    case "INCREMENT_DURATION_TIME":
      return { ...state, durationTime: state.durationTime + 1 };

    case "INCREMENT_REST_TIME":
      return { ...state, restTime: state.restTime + 1 };

    case "SET_IS_RESTING":
      return { ...state, isResting: action.payload };

    case "SET_IS_WORKOUT_START":
      return { ...state, isWorkoutStart: action.payload };

    case "SET_IS_WORKOUT_END":
      return { ...state, isWorkoutEnd: action.payload };

    case "SET_IS_PLAYING":
      return { ...state, isPlaying: action.payload };

    case "COMPLETE_CURRENT_SET":
      return {
        ...state,
        workout: {
          ...state.workout,
          exercises: state.workout.exercises.map((exercise, exerciseIndex) =>
            exerciseIndex === state.currentExerciseIndex
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set, setIndex) =>
                    setIndex === state.currentSetIndex ? { ...set, complete: true } : set
                  ),
                }
              : exercise
          ),
        },
      };

    case "COMPLETE_CURRENT_EXERCISE":
      return {
        ...state,
        workout: {
          ...state.workout,
          exercises: state.workout.exercises.map((exercise, index) =>
            index === state.currentExerciseIndex ? { ...exercise, complete: true } : exercise
          ),
        },
      };

    case "START_REST":
      return {
        ...state,
        isResting: true,
        restTime: 0,
        currentRestDuration: action.payload,
      };

    case "END_REST":
      return {
        ...state,
        isResting: false,
        restTime: 0,
        currentRestDuration: 0,
      };

    case "NEXT_STEP": {
      const currentExercise = state.workout.exercises[state.currentExerciseIndex];
      const currentSet = currentExercise.sets[state.currentSetIndex];

      if (state.isResting) {
        return {
          ...state,
          isResting: false,
          restTime: 0,
          currentRestDuration: 0,
        };
      }

      // Завершаем текущий подход
      const newState = workoutsSessionReducer(state, { type: "COMPLETE_CURRENT_SET" });
      const nextSetIndex = state.currentSetIndex + 1;

      if (nextSetIndex < currentExercise.sets.length) {
        // Есть еще подходы - начинаем отдых
        return {
          ...newState,
          currentSetIndex: nextSetIndex,
          isResting: true,
          restTime: 0,
          currentRestDuration: currentSet.rest,
        };
      } else {
        // Завершаем упражнение
        const exerciseCompletedState = workoutsSessionReducer(newState, {
          type: "COMPLETE_CURRENT_EXERCISE",
        });

        if (workoutUtils.areAllExercisesComplete(exerciseCompletedState.workout.exercises)) {
          // Все упражнения завершены
          return {
            ...exerciseCompletedState,
            isWorkoutEnd: true,
            isPlaying: false,
          };
        } else {
          // Переходим к следующему упражнению
          const nextExerciseIndex = workoutUtils.findNextIncompleteExercise(
            exerciseCompletedState.workout.exercises,
            state.currentExerciseIndex
          );

          if (nextExerciseIndex !== -1) {
            const nextExercise = exerciseCompletedState.workout.exercises[nextExerciseIndex];
            const firstIncompleteSetIndex = workoutUtils.findFirstIncompleteSet(nextExercise);

            return {
              ...exerciseCompletedState,
              currentExerciseIndex: nextExerciseIndex,
              currentSetIndex: firstIncompleteSetIndex !== -1 ? firstIncompleteSetIndex : 0,
            };
          }
        }
      }

      return newState;
    }

    default:
      return state;
  }
}

export function useWorkoutsSessionReducer() {
  return useReducer(workoutsSessionReducer, initialState);
}
