import { exercises, workoutExercises, workoutExerciseSets, workouts } from "db/schema";

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;

export type WorkoutExerciseSet = typeof workoutExerciseSets.$inferSelect;
export type NewWorkoutExerciseSet = typeof workoutExerciseSets.$inferInsert;
