import { Exercise, NewExercise } from "@/types/db";
import { db } from "db/client";
import { exercises } from "db/schema";
import { asc, eq, sql } from "drizzle-orm";

export class ExercisesModel {
  /**
   * Получить все упражнения, отсортированные по имени
   */
  static async getAll(): Promise<Exercise[]> {
    return await db.select().from(exercises).orderBy(asc(exercises.name));
  }

  /**
   * Получить упражнение по ID
   */
  static async getById(id: Exercise["id"]): Promise<Exercise | null> {
    const result = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);

    return result[0] || null;
  }

  /**
   * Найти упражнение по имени
   */
  static async getByName(name: string): Promise<Exercise | null> {
    const result = await db.select().from(exercises).where(eq(exercises.name, name)).limit(1);

    return result[0] || null;
  }

  /**
   * Получить недавно созданные упражнения
   */
  static async getRecent(limit: number = 10): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .orderBy(sql`${exercises.createdAt} DESC`)
      .limit(limit);
  }

  /**
   * Создать новое упражнение
   */
  static async create(data: NewExercise): Promise<{ id: Exercise["id"] }[]> {
    return await db.insert(exercises).values(data).returning({ id: exercises.id });
  }

  /**
   * Создать и вернуть полный объект упражнения
   */
  static async createAndReturn(data: NewExercise): Promise<Exercise> {
    const [created] = await db.insert(exercises).values(data).returning();

    return created;
  }

  /**
   * Обновить упражнение
   */
  static async update(id: Exercise["id"], data: Partial<NewExercise>): Promise<Exercise | null> {
    const [updated] = await db.update(exercises).set(data).where(eq(exercises.id, id)).returning();

    return updated || null;
  }

  /**
   * Удалить упражнение
   */
  static async remove(id: Exercise["id"]): Promise<{ id: Exercise["id"] }[]> {
    return await db.delete(exercises).where(eq(exercises.id, id)).returning({ id: exercises.id });
  }

  /**
   * Проверить существование упражнения
   */
  static async exists(id: Exercise["id"]): Promise<boolean> {
    const result = await db.select({ id: exercises.id }).from(exercises).where(eq(exercises.id, id)).limit(1);

    return result.length > 0;
  }

  /**
   * Проверить существование по имени
   */
  static async existsByName(name: string): Promise<boolean> {
    const result = await db.select({ id: exercises.id }).from(exercises).where(eq(exercises.name, name)).limit(1);

    return result.length > 0;
  }

  /**
   * Поиск упражнений по частичному совпадению имени
   */
  static async search(query: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(sql`${exercises.name} LIKE ${`%${query}%`}`)
      .orderBy(asc(exercises.name));
  }

  /**
   * Получить количество упражнений
   */
  static async count(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(exercises);

    return result.count;
  }
}
