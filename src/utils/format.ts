import { FullWorkout } from "@/types/db";
import { WorkoutSession } from "@/types/workouts";

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const formatSetSubtitle = (
  setCurrent: number,
  setTotal: number,
  set: WorkoutSession["exercises"][number]["sets"][number]
) => {
  return `Подход ${setCurrent}/${setTotal} • ${set.weight}кг × ${set.reps}`;
};

export const convertFullWorkoutToSession = (fullWorkout: FullWorkout): WorkoutSession => {
  return {
    title: fullWorkout.title,
    complete: false,
    exercises: fullWorkout.workoutExercises.map((workoutExercise) => ({
      id: workoutExercise.workoutExercise.id,
      title: workoutExercise.workoutExercise.title,
      complete: false,
      sets: workoutExercise.workoutExerciseSets.map((set) => ({
        id: set.id,
        complete: false,
        weight: set.weight,
        reps: set.reps,
        rest: set.rest,
      })),
    })),
  };
};
