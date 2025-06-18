import { Dispatch } from "react";
import { Exercise, FullTemplateWorkout } from "./db";

export type WorkoutCreateState = {
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
  modalVisible: boolean;
  createExerciseModalVisible: boolean;
};

export type WorkoutCreateAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "ADD_EXERCISE"; payload: Exercise }
  | { type: "ADD_EXERCISE_SET"; payload: { _id: string } }
  | {
      type: "UPDATE_EXERCISE_SET";
      payload: {
        exerciseId: string;
        setId: string;
        field: keyof WorkoutCreateState["exercises"][number]["sets"][number];
        value: WorkoutCreateState["exercises"][number]["sets"][number][keyof WorkoutCreateState["exercises"][number]["sets"][number]];
      };
    }
  | { type: "REMOVE_EXERCISE_SET"; payload: { exerciseId: string; setId: string } }
  | { type: "REMOVE_EXERCISE"; payload: { _id: string } }
  | { type: "SHOW_MODAL" }
  | { type: "HIDE_MODAL" }
  | { type: "SHOW_CREATE_EXERCISE_MODAL" }
  | { type: "HIDE_CREATE_EXERCISE_MODAL" }
  | { type: "RESET" };

export interface WorkoutCreateContextProps {
  state: WorkoutCreateState;
  dispatch: Dispatch<WorkoutCreateAction>;
  exercises: Exercise[];
  handleCancel: () => void;
  handleSave: () => void;
  refetchExercises: () => void;
}

export type WorkoutSession = {
  title: string;
  complete: boolean;
  exercises: {
    id: number;
    title: string;
    complete: boolean;
    sets: {
      id: number;
      complete: boolean;
      weight: number | null;
      reps: number | null;
      rest: number | null;
    }[];
  }[];
};

export interface WorkoutsSessionStore {
  workout: WorkoutSession;
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
}
