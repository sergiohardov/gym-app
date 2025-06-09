import { asc, desc, eq } from "drizzle-orm";
import { db } from "./client";
import { exercises, workouts } from "./schema";
import { NewExercise, NewWorkout } from "@/types/db";

export const getExercises = async () => {
  return await db.select().from(exercises).orderBy(asc(exercises.title));
};

export const createExercise = async (
  exerciseData: Omit<NewExercise, "id" | "createdAt">
) => {
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

export const getWorkouts = async () => {
  return await db.select().from(workouts).orderBy(asc(workouts.title));
};

export const createWorkout = async (
  workoutData: Omit<NewWorkout, "id" | "createdAt">
) => {
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
