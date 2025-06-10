import { WorkoutCreateState } from "@/types/workouts";
import { useMemo } from "react";

export function useWorkoutValidation(state: WorkoutCreateState) {
  return useMemo(() => {
    if (!state.title.trim()) return false;

    return state.exercises.some(
      (exercise) =>
        exercise.exerciseId &&
        Array.isArray(exercise.sets) &&
        exercise.sets.some((set) => set.weight.trim() && set.reps.trim() && set.rest.trim())
    );
  }, [state.title, state.exercises]);
}
