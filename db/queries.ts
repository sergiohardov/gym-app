import { asc, eq } from "drizzle-orm";
import { db } from "./client";
import { exercises, workoutExercises, workoutExerciseSets, workouts } from "./schema";
import {
  NewFullWorkout,
  Exercise,
  FullWorkout,
  NewExercise,
  NewWorkout,
  NewWorkoutExercise,
  NewWorkoutExerciseSet,
  Workout,
  WorkoutExercise,
  WorkoutExerciseSet,
} from "@/types/db";

/* Exercises */
export const getExercises = async (): Promise<Exercise[]> => {
  return await db.select().from(exercises).orderBy(asc(exercises.title));
};

export const createExercise = async (data: NewExercise): Promise<{ id: Exercise["id"] }[]> => {
  return await db
    .insert(exercises)
    .values({
      ...data,
    })
    .returning({ id: exercises.id });
};

export const removeExercise = async (id: Exercise["id"]): Promise<{ id: Exercise["id"] }[]> => {
  return await db.delete(exercises).where(eq(exercises.id, id)).returning({ id: exercises.id });
};

/* Workouts */
export const getWorkouts = async (): Promise<Workout[]> => {
  return await db.select().from(workouts).orderBy(asc(workouts.createdAt));
};

export const getFullWorkout = async (id: Workout["id"]): Promise<FullWorkout | undefined> => {
  return await db.query.workouts.findFirst({
    where: eq(workouts.id, id),
    with: {
      workoutExercises: {
        with: {
          workoutExercise: true,
          workoutExerciseSets: true,
        },
      },
    },
  });
};

export const createWorkout = async (data: NewWorkout): Promise<{ id: Workout["id"] }[]> => {
  return await db
    .insert(workouts)
    .values({ ...data })
    .returning({ id: workouts.id });
};

export const createFullWorkout = async (data: NewFullWorkout): Promise<{ id: Workout["id"] }> => {
  return await db.transaction(async (tx) => {
    // 1. Create workout
    const [workout] = await tx.insert(workouts).values({ title: data.title }).returning({ id: workouts.id });
    if (!workout.id) throw new Error("Failed to create workout");

    // 2. Create exercises for workout
    const workoutExercisesData: NewWorkoutExercise[] = data.exercises.map((exercise, index) => ({
      workoutId: workout.id,
      exerciseId: exercise.exerciseId,
      order: index + 1,
    }));

    const createdWorkoutExercises = await tx
      .insert(workoutExercises)
      .values(workoutExercisesData)
      .returning({ id: workoutExercises.id });

    // 3. Create sets for exercises
    const workoutExerciseSetsData: NewWorkoutExerciseSet[] = data.exercises.reduce<NewWorkoutExerciseSet[]>(
      (acc, exercise, exerciseIndex) => {
        const workoutExerciseId = createdWorkoutExercises[exerciseIndex].id;

        if (!workoutExerciseId) throw new Error(`Failed to get workout exercise ID for exercise ${exerciseIndex}`);

        const workoutSets: NewWorkoutExerciseSet[] = exercise.sets.map((set, setIndex) => ({
          workoutExerciseId: workoutExerciseId,
          order: setIndex + 1,
          weight: set.weight,
          reps: set.reps,
          rest: set.rest,
        }));

        return [...acc, ...workoutSets];
      },
      []
    );

    const createdWorkoutExerciseSets = await tx
      .insert(workoutExerciseSets)
      .values(workoutExerciseSetsData)
      .returning({ id: workoutExerciseSets.id });

    // 4. If all right returning workout ID
    return { id: workout.id };
  });
};

export const removeWorkout = async (id: Workout["id"]): Promise<{ id: Workout["id"] }[]> => {
  return await db.delete(workouts).where(eq(workouts.id, id)).returning({ id: workouts.id });
};

/* WorkoutExercises */
export async function getWorkoutExercises() {
  return await db.select().from(workoutExercises);
}

export const createWorkoutExercise = async (data: NewWorkoutExercise): Promise<{ id: WorkoutExercise["id"] }[]> => {
  return await db.insert(workoutExercises).values(data).returning({ id: workoutExercises.id });
};

export async function removeWorkoutExercise(id: number) {
  return await db.delete(workoutExercises).where(eq(workoutExercises.id, id));
}

/* Sets */
export async function getWorkoutExercisesSets() {
  return await db.select().from(workoutExerciseSets);
}

export async function createWorkoutExerciseSet(
  data: NewWorkoutExerciseSet
): Promise<{ id: WorkoutExerciseSet["id"] }[]> {
  return await db.insert(workoutExerciseSets).values(data).returning({ id: workoutExerciseSets.id });
}

export async function removeWorkoutExerciseSet(id: number) {
  return await db.delete(workoutExerciseSets).where(eq(workoutExerciseSets.id, id));
}
