import { workoutMock } from "@/mock/workout";
import { useReducer } from "react";

type Workout = typeof workoutMock;
type Exercise = Workout["exercises"][number];
type Set = Exercise["sets"][number];

export type WorkoutsSessionState = {
  workout: Workout;
  currentExerciseIndex: number;
  currentSetIndex: number;
  durationTime: number;
  restTime: number;
  currentRestDuration: number; // Добавляем поле для хранения текущего времени отдыха
  isResting: boolean;
  isPlaying: boolean;
  isWorkoutStart: boolean;
  isWorkoutEnd: boolean;
  playerTitle: string;
  playerSubtitle: string;
};

const initialState: WorkoutsSessionState = {
  workout: workoutMock,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  durationTime: 0,
  restTime: 0,
  currentRestDuration: 0, // Инициализируем новое поле
  isResting: false,
  isPlaying: false,
  isWorkoutStart: false,
  isWorkoutEnd: false,
  playerTitle: "Начните тренировку",
  playerSubtitle: "",
};

export type WorkoutsSessionAction =
  | { type: "SET_CURRENT_EXERCISE_INDEX"; payload: number }
  | { type: "SET_CURRENT_SET_INDEX"; payload: number }
  | { type: "SET_PLAYER_TITLE"; payload: string }
  | { type: "SET_PLAYER_SUBTITLE"; payload: string }
  | { type: "INCREMENT_DURATION_TIME" }
  | { type: "INCREMENT_REST_TIME" }
  | { type: "RESET_REST_TIME" }
  | { type: "SET_IS_RESTING"; payload: boolean }
  | { type: "SET_IS_WORKOUT_START"; payload: boolean }
  | { type: "SET_IS_WORKOUT_END"; payload: boolean }
  | { type: "SET_IS_PLAYING"; payload: boolean }
  | { type: "COMPLETE_CURRENT_SET" }
  | { type: "COMPLETE_CURRENT_EXERCISE" }
  | { type: "START_REST"; payload: number } // Изменяем: добавляем payload с временем отдыха
  | { type: "END_REST" }
  | { type: "NEXT_SET" }
  | { type: "NEXT_EXERCISE" }
  | {
      type: "UPDATE_EXERCISE";
      payload: { exercise_id: number; field: keyof Exercise; value: any };
    }
  | {
      type: "UPDATE_EXERCISE_SET";
      payload: { exercise_id: number; set_id: number; field: keyof Set; value: any };
    };

function workoutsSessionReducer(state: WorkoutsSessionState, action: WorkoutsSessionAction): WorkoutsSessionState {
  switch (action.type) {
    case "SET_CURRENT_EXERCISE_INDEX": {
      return { ...state, currentExerciseIndex: action.payload };
    }

    case "SET_CURRENT_SET_INDEX": {
      return { ...state, currentSetIndex: action.payload };
    }

    case "SET_PLAYER_TITLE": {
      return { ...state, playerTitle: action.payload };
    }

    case "SET_PLAYER_SUBTITLE": {
      return { ...state, playerSubtitle: action.payload };
    }

    case "INCREMENT_DURATION_TIME": {
      return { ...state, durationTime: state.durationTime + 1 };
    }

    case "INCREMENT_REST_TIME": {
      return { ...state, restTime: state.restTime + 1 };
    }

    case "RESET_REST_TIME": {
      return { ...state, restTime: 0 };
    }

    case "SET_IS_RESTING": {
      return { ...state, isResting: action.payload };
    }

    case "SET_IS_WORKOUT_START": {
      return { ...state, isWorkoutStart: action.payload };
    }

    case "SET_IS_WORKOUT_END": {
      return { ...state, isWorkoutEnd: action.payload };
    }

    case "SET_IS_PLAYING": {
      return { ...state, isPlaying: action.payload };
    }

    case "COMPLETE_CURRENT_SET": {
      const currentExercise = state.workout.exercises[state.currentExerciseIndex];
      const currentSet = currentExercise.sets[state.currentSetIndex];
      
      return {
        ...state,
        workout: {
          ...state.workout,
          exercises: state.workout.exercises.map((exercise, exerciseIndex) =>
            exerciseIndex === state.currentExerciseIndex
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set, setIndex) =>
                    setIndex === state.currentSetIndex
                      ? { ...set, complete: true }
                      : set
                  ),
                }
              : exercise
          ),
        },
      };
    }

    case "COMPLETE_CURRENT_EXERCISE": {
      return {
        ...state,
        workout: {
          ...state.workout,
          exercises: state.workout.exercises.map((exercise, index) =>
            index === state.currentExerciseIndex
              ? { ...exercise, complete: true }
              : exercise
          ),
        },
      };
    }

    case "START_REST": {
      // Теперь время отдыха приходит в payload
      return {
        ...state,
        isResting: true,
        restTime: 0,
        currentRestDuration: action.payload, // Сохраняем переданное время отдыха
        playerSubtitle: `Отдых: ${action.payload} сек`,
      };
    }

    case "END_REST": {
      return {
        ...state,
        isResting: false,
        restTime: 0,
        currentRestDuration: 0,
        playerSubtitle: "",
      };
    }

    case "NEXT_SET": {
      const currentExercise = state.workout.exercises[state.currentExerciseIndex];
      const nextSetIndex = state.currentSetIndex + 1;
      
      if (nextSetIndex < currentExercise.sets.length) {
        const completedSets = currentExercise.sets.filter(set => set.complete).length;
        const totalSets = currentExercise.sets.length;
        
        return {
          ...state,
          currentSetIndex: nextSetIndex,
          playerSubtitle: `Подход ${completedSets + 1}/${totalSets}`,
        };
      }
      
      return state;
    }

    case "NEXT_EXERCISE": {
      // Ищем следующее незавершенное упражнение (сначала после текущего, потом с начала)
      let nextExerciseIndex = -1;
      
      // Сначала ищем после текущего упражнения
      for (let i = state.currentExerciseIndex + 1; i < state.workout.exercises.length; i++) {
        if (!state.workout.exercises[i].complete) {
          nextExerciseIndex = i;
          break;
        }
      }
      
      // Если не нашли, ищем с начала до текущего упражнения
      if (nextExerciseIndex === -1) {
        for (let i = 0; i < state.currentExerciseIndex; i++) {
          if (!state.workout.exercises[i].complete) {
            nextExerciseIndex = i;
            break;
          }
        }
      }
      
      if (nextExerciseIndex !== -1) {
        const nextExercise = state.workout.exercises[nextExerciseIndex];
        const firstIncompleteSetIndex = nextExercise.sets.findIndex(set => !set.complete);
        
        return {
          ...state,
          currentExerciseIndex: nextExerciseIndex,
          currentSetIndex: firstIncompleteSetIndex !== -1 ? firstIncompleteSetIndex : 0,
          playerTitle: nextExercise.name,
          playerSubtitle: `Подход 1/${nextExercise.sets.length}`,
          isResting: false,
          restTime: 0,
          currentRestDuration: 0,
        };
      }
      
      // Если не нашли незавершенных упражнений (не должно происходить при правильной логике)
      return state;
    }

    case "UPDATE_EXERCISE": {
      return {
        ...state,
        workout: {
          ...state.workout,
          exercises: state.workout.exercises.map((exercise, index) =>
            index === action.payload.exercise_id
              ? { ...exercise, [action.payload.field]: action.payload.value }
              : exercise
          ),
        },
      };
    }

    case "UPDATE_EXERCISE_SET": {
      return {
        ...state,
        workout: {
          ...state.workout,
          exercises: state.workout.exercises.map((exercise, index) =>
            index === action.payload.exercise_id
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set, setIndex) =>
                    setIndex === action.payload.set_id 
                      ? { ...set, [action.payload.field]: action.payload.value } 
                      : set
                  ),
                }
              : exercise
          ),
        },
      };
    }

    default:
      return state;
  }
}

export function useWorkoutsSessionReducer() {
  return useReducer(workoutsSessionReducer, initialState);
}