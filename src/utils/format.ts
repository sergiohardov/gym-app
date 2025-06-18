import { FullTemplateWorkout } from "@/types/db";
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

export const convertFullWorkoutToSession = (fullWorkout: FullTemplateWorkout): WorkoutSession => {
  return {
    title: fullWorkout.name,
    complete: false,
    exercises: fullWorkout.templateExercises.map((workoutExercise) => ({
      id: workoutExercise.exercise.id,
      title: workoutExercise.exercise.name,
      complete: false,
      sets: workoutExercise.sets.map((set) => ({
        id: set.id,
        complete: false,
        weight: set.weight,
        reps: set.reps,
        rest: set.rest,
      })),
    })),
  };
};
