import {
  HistoryWorkout,
  NewHistoryWorkout,
  NewHistoryExercise,
  NewHistorySet,
  NewFullHistoryWorkout,
} from "@/types/db";

import { db } from "db/client";
import { historyWorkouts, historyExercises, historySets } from "db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";

export class HistoryWorkoutsModel {
  /**
   * Получить все тренировки из истории, отсортированные по дате
   */
  static async getAll(): Promise<HistoryWorkout[]> {
    return await db.select().from(historyWorkouts).orderBy(desc(historyWorkouts.createdAt));
  }

  /**
   * Получить тренировку из истории по ID
   */
  static async getById(id: HistoryWorkout["id"]): Promise<HistoryWorkout | null> {
    const result = await db.select().from(historyWorkouts).where(eq(historyWorkouts.id, id)).limit(1);
    return result[0] || null;
  }

  /**
   * Получить полную тренировку из истории со всеми упражнениями и подходами
   */
  static async getFullById(id: HistoryWorkout["id"]) {
    const result = await db.query.historyWorkouts.findFirst({
      where: eq(historyWorkouts.id, id),
      with: {
        exercises: {
          orderBy: asc(historyExercises.order),
          with: {
            sets: {
              orderBy: asc(historySets.order),
            },
          },
        },
      },
    });

    return result || null;
  }

  /**
   * Создать простую запись в истории тренировок
   */
  static async create(data: NewHistoryWorkout): Promise<{ id: HistoryWorkout["id"] }[]> {
    return await db.insert(historyWorkouts).values(data).returning({ id: historyWorkouts.id });
  }

  /**
   * Сохранить полную тренировку в историю
   */
  static async createFull(data: NewFullHistoryWorkout): Promise<{ id: HistoryWorkout["id"] }> {
    return await db.transaction(async (tx) => {
      // 1. Создаем запись в истории тренировок
      const [historyWorkout] = await tx
        .insert(historyWorkouts)
        .values({
          templateWorkoutId: data.templateWorkoutId || null,
          name: data.name,
          duration: data.duration,
        })
        .returning({ id: historyWorkouts.id });

      if (!historyWorkout.id) {
        throw new Error("Failed to create history workout");
      }

      // 2. Создаем упражнения в истории
      const historyExercisesData: NewHistoryExercise[] = data.exercises.map((exercise, index) => ({
        historyWorkoutId: historyWorkout.id,
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        order: index + 1,
      }));

      const createdHistoryExercises = await tx
        .insert(historyExercises)
        .values(historyExercisesData)
        .returning({ id: historyExercises.id });

      // 3. Создаем подходы в истории
      const historySetsData: NewHistorySet[] = data.exercises.reduce<NewHistorySet[]>(
        (acc, exercise, exerciseIndex) => {
          const historyExerciseId = createdHistoryExercises[exerciseIndex].id;

          if (!historyExerciseId) {
            throw new Error(`Failed to get history exercise ID for exercise ${exerciseIndex}`);
          }

          const sets: NewHistorySet[] = exercise.sets.map((set, setIndex) => ({
            historyExerciseId: historyExerciseId,
            order: setIndex + 1,
            weight: set.weight,
            reps: set.reps,
            rest: set.rest,
          }));

          return [...acc, ...sets];
        },
        []
      );

      if (historySetsData.length > 0) {
        await tx.insert(historySets).values(historySetsData).returning({ id: historySets.id });
      }

      return { id: historyWorkout.id };
    });
  }

  /**
   * Удалить тренировку из истории
   */
  static async remove(id: HistoryWorkout["id"]): Promise<{ id: HistoryWorkout["id"] }[]> {
    return await db.delete(historyWorkouts).where(eq(historyWorkouts.id, id)).returning({ id: historyWorkouts.id });
  }

  /**
   * Получить количество тренировок в истории
   */
  static async count(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(historyWorkouts);
    return result.count;
  }

  /**
   * Получить недавние тренировки из истории
   */
  static async getRecent(limit: number = 10): Promise<HistoryWorkout[]> {
    return await db.select().from(historyWorkouts).orderBy(desc(historyWorkouts.createdAt)).limit(limit);
  }

  /**
   * Поиск тренировок в истории по названию
   */
  static async search(query: string): Promise<HistoryWorkout[]> {
    return await db
      .select()
      .from(historyWorkouts)
      .where(sql`${historyWorkouts.name} LIKE ${`%${query}%`}`)
      .orderBy(desc(historyWorkouts.createdAt));
  }

  /**
   * Получить статистику тренировок за период
   */
  static async getStatsForPeriod(startDate: string, endDate: string) {
    const result = await db
      .select({
        count: sql<number>`count(*)`,
        totalDuration: sql<number>`sum(${historyWorkouts.duration})`,
        avgDuration: sql<number>`avg(${historyWorkouts.duration})`,
      })
      .from(historyWorkouts)
      .where(sql`${historyWorkouts.createdAt} >= ${startDate} AND ${historyWorkouts.createdAt} <= ${endDate}`);

    return result[0] || { count: 0, totalDuration: 0, avgDuration: 0 };
  }
}
