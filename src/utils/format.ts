import { WorkoutsSessionExerciseSet } from "@/types/workouts";

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const formatSetSubtitle = (setCurrent: number, setTotal: number, set: WorkoutsSessionExerciseSet) => {
  return `Подход ${setCurrent}/${setTotal} • ${set.weight}кг × ${set.reps}`;
};
