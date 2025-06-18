import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/* Tables */
export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const templateWorkouts = sqliteTable("template_workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const templateExercises = sqliteTable("template_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  templateWorkoutId: integer("template_workout_id")
    .notNull()
    .references(() => templateWorkouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
});

export const templateSets = sqliteTable("template_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  templateExerciseId: integer("template_exercise_id")
    .notNull()
    .references(() => templateExercises.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  weight: integer("weight"),
  reps: integer("reps"),
  rest: integer("rest"),
});

export const historyWorkouts = sqliteTable("history_workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  templateWorkoutId: integer("template_workout_id").references(() => templateWorkouts.id, { onDelete: "set null" }),
  name: text("name").notNull(), // save workout name if workout removed
  duration: integer("duration"),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const historyExercises = sqliteTable("history_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  historyWorkoutId: integer("history_workout_id")
    .notNull()
    .references(() => historyWorkouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").references(() => exercises.id, { onDelete: "set null" }),
  name: text("name").notNull(), // save exercise name if exercise removed
  order: integer("order").notNull(),
});

export const historySets = sqliteTable("history_sets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  historyExerciseId: integer("history_exercise_id")
    .notNull()
    .references(() => historyExercises.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  weight: integer("weight"),
  reps: integer("reps"),
  rest: integer("rest"),
});

/* Relations */
export const exercisesRelations = relations(exercises, ({ many }) => ({
  templateExercises: many(templateExercises),
  historyExercises: many(historyExercises),
}));

export const templateWorkoutsRelations = relations(templateWorkouts, ({ many }) => ({
  templateExercises: many(templateExercises),
  historyWorkouts: many(historyWorkouts),
}));

export const templateExercisesRelations = relations(templateExercises, ({ one, many }) => ({
  workout: one(templateWorkouts, {
    fields: [templateExercises.templateWorkoutId],
    references: [templateWorkouts.id],
  }),
  exercise: one(exercises, {
    fields: [templateExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(templateSets),
}));

export const templateSetsRelations = relations(templateSets, ({ one }) => ({
  exercise: one(templateExercises, {
    fields: [templateSets.templateExerciseId],
    references: [templateExercises.id],
  }),
}));

export const historyWorkoutsRelations = relations(historyWorkouts, ({ one, many }) => ({
  workout: one(templateWorkouts, {
    fields: [historyWorkouts.templateWorkoutId],
    references: [templateWorkouts.id],
  }),
  exercises: many(historyExercises),
}));

export const historyExercisesRelations = relations(historyExercises, ({ one, many }) => ({
  workout: one(historyWorkouts, {
    fields: [historyExercises.historyWorkoutId],
    references: [historyWorkouts.id],
  }),
  exercise: one(exercises, {
    fields: [historyExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(historySets),
}));

export const sessionSetsRelations = relations(historySets, ({ one }) => ({
  exercise: one(historyExercises, {
    fields: [historySets.historyExerciseId],
    references: [historyExercises.id],
  }),
}));
