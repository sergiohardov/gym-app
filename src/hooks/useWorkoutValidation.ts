import { useMemo } from "react";
import { WorkoutCreateState } from "../reducers/useWorkoutsCreateReducer";

export function useWorkoutValidation(state: WorkoutCreateState) {
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
