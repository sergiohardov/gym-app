import { FullTemplateWorkout, NewFullHistoryWorkout, NewFullTemplateWorkout } from "@/types/db";
import { WorkoutCreateState, WorkoutSession, WorkoutsSessionStore } from "@/types/workouts";
import { v4 as uuidv4 } from "uuid";

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}ч ${mins}м`;
  }
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const formatSetSubtitle = (
  setCurrent: number,
  setTotal: number,
  set: WorkoutSession["exercises"][number]["sets"][number]
) => {
  return `Подход ${setCurrent}/${setTotal} • ${set.weight}кг × ${set.reps}`;
};

export const convertWorkoutCreateStateToNewFullTemplateWorkout = (
  workoutCreateState: WorkoutCreateState
): NewFullTemplateWorkout => {
  return {
    name: workoutCreateState.name,
    exercises: workoutCreateState.exercises.map((exerciseItem) => ({
      exerciseId: exerciseItem.exercise.id,
      sets: exerciseItem.sets.map((set) => ({
        weight: +set.weight,
        reps: +set.reps,
        rest: +set.rest,
      })),
    })),
  };
};

export const convertFullWorkoutToSession = (fullWorkout: FullTemplateWorkout): WorkoutSession => {
  return {
    title: fullWorkout.name,
    complete: false,
    exercises: fullWorkout.templateExercises.map((workoutExercise) => ({
      _id: uuidv4(),
      id: workoutExercise.exercise.id,
      title: workoutExercise.exercise.name,
      complete: false,
      sets: workoutExercise.sets.map((set) => ({
        _id: uuidv4(),
        id: set.id,
        complete: false,
        weight: set.weight,
        reps: set.reps,
        rest: set.rest,
      })),
    })),
  };
};

export const convertSessionToHistoryData = (data: WorkoutsSessionStore): NewFullHistoryWorkout => {
  return {
    templateWorkoutId: data.templateWorkoutId || null,
    name: data.workout.title,
    duration: data.durationTime,
    exercises: data.workout.exercises
      .filter((exercise) => {
        // Сохраняем только упражнения с выполненными подходами
        return exercise.sets.some((set) => set.complete);
      })
      .map((exercise) => ({
        exerciseId: exercise.id || null,
        name: exercise.title,
        sets: exercise.sets
          .filter((set) => set.complete) // Сохраняем только выполненные подходы
          .map((set) => ({
            weight: set.weight,
            reps: set.reps,
            rest: set.rest,
          })),
      }))
      .filter((exercise) => exercise.sets.length > 0), // Исключаем упражнения без выполненных подходов
  };
};
