import { WorkoutCreateAction, WorkoutCreateState } from "@/types/workouts";
import { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

const initialState: WorkoutCreateState = {
  title: "",
  exercises: [],
  modalVisible: false,
};

function workoutCreateReducer(state: WorkoutCreateState, action: WorkoutCreateAction): WorkoutCreateState {
  switch (action.type) {
    case "SET_TITLE": {
      return { ...state, title: action.payload };
    }

    case "ADD_EXERCISE": {
      const newExercise: WorkoutCreateState["exercises"][number] = {
        _id: uuidv4(),
        exerciseId: action.payload.exerciseId,
        sets: [],
      };

      return {
        ...state,
        exercises: [...state.exercises, newExercise],
      };
    }

    case "ADD_EXERCISE_SET": {
      const newSet: WorkoutCreateState["exercises"][number]["sets"][number] = {
        _id: uuidv4(),
        weight: "",
        reps: "",
        rest: "",
      };

      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise._id === action.payload._id ? { ...exercise, sets: [...exercise.sets, newSet] } : exercise
        ),
      };
    }

    case "UPDATE_EXERCISE_SET": {
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise._id === action.payload.exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set._id === action.payload.setId ? { ...set, [action.payload.field]: action.payload.value } : set
                ),
              }
            : exercise
        ),
      };
    }

    case "REMOVE_EXERCISE_SET": {
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise._id === action.payload.exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.filter((set) => set._id !== action.payload.setId),
              }
            : exercise
        ),
      };
    }

    case "REMOVE_EXERCISE": {
      return {
        ...state,
        exercises: state.exercises.filter((exercise) => exercise._id !== action.payload._id),
      };
    }

    case "SHOW_MODAL": {
      return {
        ...state,
        modalVisible: true,
      };
    }

    case "HIDE_MODAL": {
      return {
        ...state,
        modalVisible: false,
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

export function useWorkoutsCreateReducer() {
  return useReducer(workoutCreateReducer, initialState);
}
