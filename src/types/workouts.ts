import { Dispatch } from "react";
import { Exercise, FullTemplateWorkout, TemplateExercise, TemplateWorkout } from "./db";

export type WorkoutsEditorState = {
  name: string;
  exercises: {
    _id: string;
    exercise: Exercise;
    sets: {
      _id: string;
      weight: string;
      reps: string;
      rest: string;
    }[];
  }[];
  isEditMode: boolean;
  isLoading: boolean;
  workoutId: number | null;
  modalExerciseListVisible: boolean;
  modalExerciseCreateVisible: boolean;
};

export type WorkoutsEditorAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_WORKOUT_ID"; payload: number | null }
  | { type: "SET_IS_EDIT_MODE"; payload: boolean }
  | { type: "LOAD_WORKOUT"; payload: FullTemplateWorkout }
  | { type: "ADD_EXERCISE"; payload: Exercise }
  | { type: "ADD_EXERCISE_SET"; payload: { _id: string } }
  | {
      type: "UPDATE_EXERCISE_SET";
      payload: {
        exerciseId: string;
        setId: string;
        field: keyof WorkoutsEditorState["exercises"][number]["sets"][number];
        value: WorkoutsEditorState["exercises"][number]["sets"][number][keyof WorkoutsEditorState["exercises"][number]["sets"][number]];
      };
    }
  | { type: "REMOVE_EXERCISE_SET"; payload: { exerciseId: string; setId: string } }
  | { type: "REMOVE_EXERCISE"; payload: { _id: string } }
  | { type: "SHOW_EXERCISE_LIST_MODAL" }
  | { type: "HIDE_EXERCISE_LIST_MODAL" }
  | { type: "SHOW_EXERCISE_CREATE_MODAL" }
  | { type: "HIDE_EXERCISE_CREATE_MODAL" }
  | { type: "RESET" };

export interface WorkoutsEditorContextProps {
  isLoading: boolean;
  exercises: Exercise[];
  state: WorkoutsEditorState;
  dispatch: Dispatch<WorkoutsEditorAction>;
  handleCancel: () => void;
  handleSave: () => void;
  fetchExercises: () => void;
}

export type WorkoutSession = {
  title: string;
  complete: boolean;
  exercises: {
    _id: string;
    id: number;
    title: string;
    complete: boolean;
    sets: {
      _id: string;
      id: number;
      complete: boolean;
      weight: number | null;
      reps: number | null;
      rest: number | null;
    }[];
  }[];
};

// Тип результата сохранения тренировки
export interface SaveWorkoutResult {
  success: boolean;
  historyId?: number;
  message?: string;
  error?: string;
}

export interface WorkoutsEditStore {
  workout: FullTemplateWorkout | null;
  currentExerciseId: TemplateExercise["id"] | null;
  isLoading: boolean;
  refreshing: boolean;
  isAddModalVisible: boolean;
  isCreateModalVisible: boolean;
  isEditModalVisible: boolean;

  loadWorkout: (id: TemplateWorkout["id"]) => void;
  refreshWorkout: (id: TemplateWorkout["id"]) => void;
  setCurrentExerciseId: (id: TemplateExercise["id"] | null) => void;
  setIsAddModalVisible: (status: boolean) => void;
  setIsCreateModalVisible: (status: boolean) => void;
  setIsEditModalVisible: (status: boolean) => void;
}

export interface WorkoutsSessionStore {
  workout: WorkoutSession;
  templateWorkoutId: TemplateWorkout["id"] | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  durationTime: number;
  restTime: number;
  restTimer: ReturnType<typeof setTimeout> | null;
  status: "start" | "playing" | "pause" | "end";
  isResting: boolean;
  isPlaying: boolean;
  isWorkoutStart: boolean;
  isWorkoutEnd: boolean;
  playerTitle: string;
  playerSubtitle: string;
  isLoading: boolean;
  isSaving: boolean;

  loadWorkout: (fullWorkout: FullTemplateWorkout) => void;
  resetStore: () => void;
  startSession: () => void;
  togglePlayPause: () => void;
  setCurrentExercise: (exerciseIndex: number) => void;
  setCurrentSet: (setIndex: number) => void;
  setPlayerTitle: (title: string) => void;
  setPlayerSubtitle: (subtitle: string) => void;
  incrementDurationTime: () => void;
  startRest: (restDuration: number) => void;
  stopRest: () => void;
  completeCurrentSet: () => void;
  completeCurrentExercise: () => void;
  completeWorkout: () => void;
  proceedToNextStep: () => void;
  isWorkoutCompleted: () => boolean;
  pauseRest: () => void;
  resumeRest: () => void;
  saveWorkoutSession: (forced?: boolean) => Promise<SaveWorkoutResult>;
  forceCompleteAndSave: () => Promise<SaveWorkoutResult>;
}
