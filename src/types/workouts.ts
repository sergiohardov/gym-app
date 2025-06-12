import { Dispatch } from "react";
import { Exercise } from "./db";

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
