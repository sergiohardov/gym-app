import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/* Tables */
export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull().unique(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const workoutExercises = sqliteTable("workout_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }), // ИСПРАВЛЕНО: добавлен cascade
  order: integer("order").notNull(),
});

export const workoutExerciseSets = sqliteTable("workout_exercise_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutExerciseId: integer("workout_exercise_id")
    .notNull()
    .references(() => workoutExercises.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  weight: integer("weight"),
  reps: integer("reps"),
  rest: integer("rest"),
});

export const historyWorkouts = sqliteTable("history_workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutId: integer("workout_id").references(() => workouts.id, { onDelete: "set null" }), // ИСПРАВЛЕНО: set null вместо cascade
  title: text("title").notNull(),
  date: text("date").notNull(),
  duration: integer("duration").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const historyWorkoutExercises = sqliteTable("history_workout_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  historyWorkoutId: integer("history_workout_id")
    .notNull()
    .references(() => historyWorkouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").references(() => exercises.id, { onDelete: "set null" }), // ИСПРАВЛЕНО: set null вместо cascade
  title: text("title").notNull(),
  order: integer("order").notNull(),
});

export const historyWorkoutExerciseSets = sqliteTable("history_workout_exercise_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  historyWorkoutExerciseId: integer("history_workout_exercise_id")
    .notNull()
    .references(() => historyWorkoutExercises.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  weight: integer("weight"),
  reps: integer("reps"),
});

/* Relations */
export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercise: many(workoutExercises),
  historyWorkoutExercise: many(historyWorkoutExercises),
}));

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
  historyWorkout: many(historyWorkouts),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  workoutExercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  workoutExerciseSets: many(workoutExerciseSets),
}));

export const workoutExerciseSetsRelations = relations(workoutExerciseSets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [workoutExerciseSets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

export const historyWorkoutsRelations = relations(historyWorkouts, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [historyWorkouts.workoutId],
    references: [workouts.id],
  }),
  historyWorkoutExercises: many(historyWorkoutExercises),
}));

export const historyWorkoutExercisesRelations = relations(historyWorkoutExercises, ({ one, many }) => ({
  historyWorkout: one(historyWorkouts, {
    fields: [historyWorkoutExercises.historyWorkoutId],
    references: [historyWorkouts.id],
  }),
  historyWorkoutExercises: one(exercises, {
    fields: [historyWorkoutExercises.exerciseId],
    references: [exercises.id],
  }),
  historyWorkoutExerciseSets: many(historyWorkoutExerciseSets),
}));

export const historyWorkoutExerciseSetsRelations = relations(historyWorkoutExerciseSets, ({ one }) => ({
  historyWorkoutExercise: one(historyWorkoutExercises, {
    fields: [historyWorkoutExerciseSets.historyWorkoutExerciseId],
    references: [historyWorkoutExercises.id],
  }),
}));
