import { asc, eq } from "drizzle-orm";
import { db } from "./client";
import { exercises, workoutExercises, workoutExerciseSets, workouts } from "./schema";
import { NewExercise,  NewWorkout, NewWorkoutExercise,  NewWorkoutExerciseSet,  WorkoutExercise, WorkoutExerciseSet } from "@/types/db";
import {
  Exercise,
  NewExercise,
} from "@/types/db";

/* Exercises */
export const getExercises = async (): Promise<Exercise[]> => {
  return await db.select().from(exercises).orderBy(asc(exercises.title));
};

export const createExercise = async (exerciseData: NewExercise): Promise<{ id: Exercise["id"] }[]> => {
  return await db
    .insert(exercises)
    .values({
      ...exerciseData,
    })
    .returning({ id: exercises.id });
};

export const removeExercise = async (id: Exercise["id"]): Promise<{ id: Exercise["id"] }[]> => {
  return await db.delete(exercises).where(eq(exercises.id, id)).returning({ id: exercises.id });
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
  return await db.select().from(workoutExerciseSets);
}

export async function addSetToWorkoutExercise(data: NewWorkoutExerciseSet): Promise<WorkoutExerciseSet[]> {
  return await db.insert(workoutExerciseSets).values(data).returning();
}

export async function removeWorkoutExerciseSet(id: number) {
  return await db.delete(workoutExerciseSets).where(eq(workoutExerciseSets.id, id));
}
