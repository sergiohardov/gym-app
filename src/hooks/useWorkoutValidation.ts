import { useMemo } from "react";
import { WorkoutState } from "../reducers/useWorkoutReducer";

export function useWorkoutValidation(state: WorkoutState) {
  return useMemo(() => {
    if (!state.title.trim()) return false;

    return state.exercises.some(
      (exercise) =>
        exercise.exercise_id &&
        Array.isArray(exercise.sets) &&
        exercise.sets.some(
          (set) =>
            set.weight.trim() &&
            set.reps.trim() &&
            parseFloat(set.weight) > 0 &&
            parseInt(set.reps) > 0
        )
    );
  }, [state.title, state.exercises]);
}
