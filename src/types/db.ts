import {
  exercises,
  historyExercises,
  historySets,
  historyWorkouts,
  templateExercises,
  templateSets,
  templateWorkouts,
} from "db/schema";

export type Exercise = typeof exercises.$inferSelect;
export type TemplateWorkout = typeof templateWorkouts.$inferSelect;
export type TemplateExercise = typeof templateExercises.$inferSelect;
export type TemplateSet = typeof templateSets.$inferSelect;
// Вместо создания собственных интерфейсов
// export type FullTemplateWorkout = Awaited<ReturnType<typeof TemplateWorkoutsModel.getFullById>>;
export type FullTemplateWorkout = TemplateWorkout & {
  templateExercises: (TemplateExercise & {
    exercise: Exercise;
    sets: TemplateSet[];
  })[];
};
export type HistoryWorkout = typeof historyWorkouts.$inferSelect;
export type HistoryExercise = typeof historyExercises.$inferSelect;
export type HistorySet = typeof historySets.$inferSelect;
export type FullHistoryWorkout = HistoryWorkout & {
  exercises: (HistoryExercise & {
    sets: HistorySet[];
  })[];
};

export type NewExercise = typeof exercises.$inferInsert;
export type NewTemplateWorkout = typeof templateWorkouts.$inferInsert;
export type NewTemplateExercise = typeof templateExercises.$inferInsert;
export type NewTemplateSet = typeof templateSets.$inferInsert;
export type NewFullTemplateWorkout = {
  name: string;
  exercises: {
    exerciseId: Exercise["id"];
    sets: {
      weight: number | null;
      reps: number | null;
      rest: number | null;
    }[];
  }[];
};
export type NewHistoryWorkout = typeof historyWorkouts.$inferInsert;
export type NewHistoryExercise = typeof historyExercises.$inferInsert;
export type NewHistorySet = typeof historySets.$inferInsert;
export type NewFullHistoryWorkout = {
  templateWorkoutId: TemplateWorkout["id"] | null;
  name: string;
  duration: number;
  exercises: {
    exerciseId: Exercise["id"] | null;
    name: string;
    sets: {
      weight: number | null;
      reps: number | null;
      rest: number | null;
    }[];
  }[];
};
