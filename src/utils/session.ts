import { Exercise } from "@/types/session";

export const workoutUtils = {
  findNextIncompleteExercise: (exercises: Exercise[], currentIndex: number): number => {
    // Ищем после текущего упражнения
    for (let i = currentIndex + 1; i < exercises.length; i++) {
      if (!exercises[i].complete) return i;
    }

    // Ищем с начала до текущего
    for (let i = 0; i < currentIndex; i++) {
      if (!exercises[i].complete) return i;
    }

    return -1;
  },

  findFirstIncompleteSet: (exercise: Exercise): number => {
    return exercise.sets.findIndex((set) => !set.complete);
  },

  areAllExercisesComplete: (exercises: Exercise[]): boolean => {
    return exercises.every((exercise) => exercise.complete);
  },

  getCompletedSetsCount: (exercise: Exercise): number => {
    return exercise.sets.filter((set) => set.complete).length;
  },

  formatRestTime: (remaining: number): string => {
    return `Отдых: ${remaining} сек`;
  },

  formatSetInfo: (setIndex: number, totalSets: number, weight: number, reps: number): string => {
    return `Подход ${setIndex + 1}/${totalSets} • ${weight}кг × ${reps}`;
  },
};
