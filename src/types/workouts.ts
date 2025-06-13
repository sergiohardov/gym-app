import { Dispatch } from "react";
import { Exercise } from "./db";
import { workoutSessionMock } from "@/mock/workouts";

export type Workout = {
  title: string;
  exercises: WorkoutExercise[];
};

export type WorkoutExercise = {
  _id: string;
  exerciseId: number;
  sets: WorkoutExerciseSet[];
};

export type WorkoutExerciseSet = {
  _id: string;
  weight: string;
  reps: string;
  rest: string;
};

export type WorkoutCreateState = {
  title: string;
  exercises: WorkoutExercise[];
  modalVisible: boolean;
};

export type WorkoutCreateAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "ADD_EXERCISE"; payload: { exerciseId: number } }
  | { type: "ADD_EXERCISE_SET"; payload: { _id: string } }
  | {
      type: "UPDATE_EXERCISE_SET";
      payload: { exercise_id: string; set_id: string; field: keyof WorkoutExerciseSet; value: string };
    }
  | { type: "REMOVE_EXERCISE_SET"; payload: { exercise_id: string; set_id: string } }
  | { type: "REMOVE_EXERCISE"; payload: { _id: string } }
  | { type: "SHOW_MODAL" }
  | { type: "HIDE_MODAL" }
  | { type: "RESET" };

export interface WorkoutCreateContextProps {
  state: WorkoutCreateState;
  dispatch: Dispatch<WorkoutCreateAction>;
  dbExercises: Exercise[];
  getExerciseTitle: (id: number) => string;
  handleCancel: () => void;
  handleSave: () => void;
}

export type WorkoutsSessionWorkout = typeof workoutSessionMock;
export type WorkoutsSessionExercise = WorkoutsSessionWorkout["exercises"][number];
export type WorkoutsSessionExerciseSet = WorkoutsSessionExercise["sets"][number];

export interface WorkoutsSessionStore {
  // Существующие поля
  workout: WorkoutsSessionWorkout;
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
