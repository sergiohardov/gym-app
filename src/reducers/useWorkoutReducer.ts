import { useReducer } from "react";

export type WorkoutExercise = {
  id: number;
  exercise_id: number | null;
  sets: WorkoutExerciseSet[];
};

export type WorkoutExerciseSet = {
  id: string;
  weight: string;
  reps: string;
  rest: string;
};

export type WorkoutState = {
  title: string;
  exercises: WorkoutExercise[];
  modalVisible: boolean;
  selectedExerciseId: number | null;
};

export type WorkoutAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "ADD_EXERCISE" }
  | { type: "REMOVE_EXERCISE"; payload: number }
  | {
      type: "UPDATE_EXERCISE";
      payload: { id: number; field: string; value: any };
    }
  | { type: "ADD_SET"; payload: number }
  | { type: "REMOVE_SET"; payload: { exerciseId: number; setId: string } }
  | {
      type: "UPDATE_SET";
      payload: {
        exerciseId: number;
        setId: string;
        field: keyof WorkoutExerciseSet;
        value: string;
      };
    }
  | { type: "SHOW_MODAL"; payload: number }
  | { type: "HIDE_MODAL" }
  | { type: "RESET" };

const initialState: WorkoutState = {
  title: "",
  exercises: [],
  modalVisible: false,
  selectedExerciseId: null,
};

function workoutReducer(
  state: WorkoutState,
  action: WorkoutAction
): WorkoutState {
  switch (action.type) {
    case "SET_TITLE": {
      return { ...state, title: action.payload };
    }

    case "ADD_EXERCISE": {
      const newExercise: WorkoutExercise = {
        id: Date.now(),
        exercise_id: null,
        sets: [],
      };
      return {
        ...state,
        exercises: [...state.exercises, newExercise],
      };
    }
    case "UPDATE_EXERCISE": {
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.payload.id
            ? { ...exercise, [action.payload.field]: action.payload.value }
            : exercise
        ),
      };
    }
    case "REMOVE_EXERCISE": {
      return {
        ...state,
        exercises: state.exercises.filter(
          (exercise) => exercise.id !== action.payload
        ),
      };
    }

    case "ADD_SET": {
      const newSet: WorkoutExerciseSet = {
        id: `${action.payload}_${Date.now()}`,
        weight: "",
        reps: "",
        rest: "",
      };

      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.payload
            ? {
                ...exercise,
                sets: Array.isArray(exercise.sets)
                  ? [...exercise.sets, newSet]
                  : [newSet],
              }
            : exercise
        ),
      };
    }
    case "UPDATE_SET": {
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.payload.exerciseId
            ? {
                ...exercise,
                sets: Array.isArray(exercise.sets)
                  ? exercise.sets.map((set) =>
                      set.id === action.payload.setId
                        ? {
                            ...set,
                            [action.payload.field]: action.payload.value,
                          }
                        : set
                    )
                  : [],
              }
            : exercise
        ),
      };
    }
    case "REMOVE_SET": {
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id === action.payload.exerciseId
            ? {
                ...exercise,
                sets: Array.isArray(exercise.sets)
                  ? exercise.sets.filter(
                      (set) => set.id !== action.payload.setId
                    )
                  : [],
              }
            : exercise
        ),
      };
    }

    case "SHOW_MODAL": {
      return {
        ...state,
        modalVisible: true,
        selectedExerciseId: action.payload,
      };
    }
    case "HIDE_MODAL": {
      return {
        ...state,
        modalVisible: false,
        selectedExerciseId: null,
      };
    }

    case "RESET": {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export function useWorkoutReducer() {
  return useReducer(workoutReducer, initialState);
}
