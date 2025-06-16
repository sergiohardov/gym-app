import {
  exercises,
  historyWorkoutExercises,
  historyWorkoutExerciseSets,
  historyWorkouts,
  workoutExercises,
  workoutExerciseSets,
  workouts,
} from "db/schema";

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;

export type WorkoutExerciseSet = typeof workoutExerciseSets.$inferSelect;
export type NewWorkoutExerciseSet = typeof workoutExerciseSets.$inferInsert;

export type HistoryWorkout = typeof historyWorkouts.$inferSelect;
export type NewHistoryWorkout = typeof historyWorkouts.$inferInsert;

export type HistoryWorkoutExercise = typeof historyWorkoutExercises.$inferSelect;
export type NewHistoryWorkoutExercise = typeof historyWorkoutExercises.$inferInsert;

export type HistoryWorkoutExerciseSet = typeof historyWorkoutExerciseSets.$inferSelect;
export type NewHistoryWorkoutExerciseSet = typeof historyWorkoutExerciseSets.$inferInsert;

export type FullWorkout = Workout & {
  workoutExercises: (WorkoutExercise & {
    workoutExercise: Exercise;
    workoutExerciseSets: WorkoutExerciseSet[];
  })[];
};

export type NewFullWorkout = {
  title: string;
  exercises: {
    exerciseId: Exercise["id"];
    sets: {
      weight: number;
      reps: number;
      rest: number;
    }[];
  }[];
}
