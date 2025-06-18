import { exercises, templateExercises, templateSets, templateWorkouts } from "db/schema";

export type Exercise = typeof exercises.$inferSelect;
export type TemplateWorkout = typeof templateWorkouts.$inferSelect;
export type TemplateExercise = typeof templateExercises.$inferSelect;
export type TemplateSet = typeof templateSets.$inferSelect;

export type NewExercise = typeof exercises.$inferInsert;
export type NewTemplateWorkout = typeof templateWorkouts.$inferInsert;
export type NewTemplateExercise = typeof templateExercises.$inferInsert;
export type NewTemplateSet = typeof templateSets.$inferInsert;


// Variant 1
// Вместо создания собственных интерфейсов
// export type FullTemplateWorkout = Awaited<ReturnType<typeof TemplateWorkoutsModel.getFullById>>;

// Variant 2
export type FullTemplateWorkout = TemplateWorkout & {
  templateExercises: (TemplateExercise & {
    exercise: Exercise;
    sets: TemplateSet[];
  })[];
};

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
