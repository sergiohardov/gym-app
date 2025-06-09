import { asc, eq } from "drizzle-orm";
import { db } from "./client";
import { exercises } from "./schema";
import { NewExercise } from "@/types/db";

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
