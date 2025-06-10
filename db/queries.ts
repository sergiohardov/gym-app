import { asc, eq } from "drizzle-orm";
import { db } from "./client";
import { exercises, sets, workoutExercises, workouts } from "./schema";
import { NewExercise, NewSet, NewWorkout, NewWorkoutExercise, Set, WorkoutExercise } from "@/types/db";

/* Exercises */
export const getExercises = async () => {
  return await db.select().from(exercises).orderBy(asc(exercises.title));
};

export const createExercise = async (exerciseData: NewExercise) => {
  const [exercise] = await db
    .insert(exercises)
    .values({
      ...exerciseData,
    })
    .returning();

  return exercise;
};

export const removeExercise = async (id: number) => {
  return await db.delete(exercises).where(eq(exercises.id, id));
};

/* Workouts */
export const getWorkouts = async () => {
  return await db.select().from(workouts).orderBy(asc(workouts.title));
};

export const createWorkout = async (workoutData: NewWorkout) => {
  const [workout] = await db
    .insert(workouts)
    .values({
      ...workoutData,
    })
    .returning();

  return workout;
};

export const removeWorkout = async (id: number) => {
  return await db.delete(workouts).where(eq(workouts.id, id));
};

/* WorkoutExercises */
export async function getWorkoutExercises() {
  return await db.select().from(workoutExercises);
}

export async function addExerciseToWorkout(data: NewWorkoutExercise): Promise<WorkoutExercise[]> {
  return await db.insert(workoutExercises).values(data).returning();
}

export async function removeWorkoutExercise(id: number) {
  return await db.delete(workoutExercises).where(eq(workoutExercises.id, id));
}

/* Sets */
export async function getWorkoutExercisesSets() {
  return await db.select().from(sets);
}

export async function addSetToWorkoutExercise(data: NewSet): Promise<Set[]> {
  return await db.insert(sets).values(data).returning();
}

export async function removeWorkoutExerciseSet(id: number) {
  return await db.delete(sets).where(eq(sets.id, id));
}
