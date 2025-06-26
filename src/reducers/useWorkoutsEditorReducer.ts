import { WorkoutsEditorAction, WorkoutsEditorState } from "@/types/workouts";
import { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

const initialState: WorkoutsEditorState = {
  name: "",
  exercises: [],
  isEditMode: false,
  isLoading: false,
  workoutId: null,
  modalExerciseListVisible: false,
  modalExerciseCreateVisible: false,
};

function workoutsEditorReducer(state: WorkoutsEditorState, action: WorkoutsEditorAction): WorkoutsEditorState {
  switch (action.type) {
    case "SET_NAME": {
      return { ...state, name: action.payload };
    }

    case "SET_IS_EDIT_MODE": {
      return { ...state, isEditMode: action.payload };
    }

    case "SET_WORKOUT_ID": {
      return { ...state, workoutId: action.payload };
    }

    case "LOAD_WORKOUT": {
      const exercises = action.payload.templateExercises.map((itemExercise) => {
        const newExercise: WorkoutsEditorState["exercises"][number] = {
          _id: uuidv4(),
          exercise: itemExercise.exercise,
          sets: itemExercise.sets.map((itemSet) => {
            const newSet: WorkoutsEditorState["exercises"][number]["sets"][number] = {
              _id: uuidv4(),
              weight: (itemSet.weight ?? "").toString(),
              reps: (itemSet.reps ?? "").toString(),
              rest: (itemSet.rest ?? "").toString(),
            };
            return newSet;
          }),
        };
        return newExercise;
      });

      return {
        ...state,
        name: action.payload.name,
        exercises: exercises,
      };
    }

    case "ADD_EXERCISE": {
      const newExercise: WorkoutsEditorState["exercises"][number] = {
        _id: uuidv4(),
        exercise: action.payload,
        sets: [],
      };

      return {
        ...state,
        exercises: [...state.exercises, newExercise],
      };
    }

    case "ADD_EXERCISE_SET": {
      const newSet: WorkoutsEditorState["exercises"][number]["sets"][number] = {
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

    case "SHOW_EXERCISE_LIST_MODAL": {
      return {
        ...state,
        modalExerciseListVisible: true,
      };
    }

    case "HIDE_EXERCISE_LIST_MODAL": {
      return {
        ...state,
        modalExerciseListVisible: false,
      };
    }

    case "SHOW_EXERCISE_CREATE_MODAL": {
      return {
        ...state,
        modalExerciseListVisible: false, // Закрываем основной modal
        modalExerciseCreateVisible: true, // Открываем modal создания упражнения
      };
    }

    case "HIDE_EXERCISE_CREATE_MODAL": {
      return {
        ...state,
        modalExerciseCreateVisible: false,
        modalExerciseListVisible: true, // Возвращаемся к основному modal
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

export function useWorkoutsEditorReducer() {
  return useReducer(workoutsEditorReducer, initialState);
}
