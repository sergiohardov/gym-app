import {
  FullTemplateWorkout,
  NewFullTemplateWorkout,
  NewTemplateExercise,
  NewTemplateSet,
  NewTemplateWorkout,
  TemplateExercise,
  TemplateSet,
  TemplateWorkout,
} from "@/types/db";
import { db } from "db/client";
import { templateExercises, templateSets, templateWorkouts } from "db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";

export class TemplateWorkoutsModel {
  /**
   * Получить все шаблоны тренировок, отсортированные по дате создания
   */
  static async getAll(): Promise<TemplateWorkout[]> {
    return await db.select().from(templateWorkouts).orderBy(desc(templateWorkouts.createdAt));
  }

  /**
   * Получить все тренировки полностью
   */
  static async getAllFull(): Promise<FullTemplateWorkout[]> {
    const result = await db.query.templateWorkouts.findMany({
      orderBy:(templateWorkouts, {desc}) => [desc(templateWorkouts.createdAt)],
      with: {
        templateExercises: {
          orderBy: asc(templateExercises.order),
          with: {
            exercise: true,
            sets: {
              orderBy: asc(templateSets.order),
            },
          },
        },
      },
    });

    return result;
  }

  /**
   * Получить шаблон тренировки по ID
   */
  static async getById(id: TemplateWorkout["id"]): Promise<TemplateWorkout | null> {
    const result = await db.select().from(templateWorkouts).where(eq(templateWorkouts.id, id)).limit(1);

    return result[0] || null;
  }

  /**
   * Найти шаблон тренировки по имени
   */
  static async getByName(name: string): Promise<TemplateWorkout | null> {
    const result = await db.select().from(templateWorkouts).where(eq(templateWorkouts.name, name)).limit(1);

    return result[0] || null;
  }

  /**
   * Получить полный шаблон тренировки со всеми упражнениями и подходами
   */
  static async getFullById(id: TemplateWorkout["id"]): Promise<FullTemplateWorkout | null> {
    const result = await db.query.templateWorkouts.findFirst({
      where: eq(templateWorkouts.id, id),
      with: {
        templateExercises: {
          orderBy: asc(templateExercises.order),
          with: {
            exercise: true,
            sets: {
              orderBy: asc(templateSets.order),
            },
          },
        },
      },
    });

    return result || null;
  }

  /**
   * Создать простой шаблон тренировки
   */
  static async create(data: NewTemplateWorkout): Promise<{ id: TemplateWorkout["id"] }[]> {
    return await db.insert(templateWorkouts).values(data).returning({ id: templateWorkouts.id });
  }

  /**
   * Создать и вернуть полный объект шаблона тренировки
   */
  static async createAndReturn(data: NewTemplateWorkout): Promise<TemplateWorkout> {
    const [created] = await db.insert(templateWorkouts).values(data).returning();

    return created;
  }

  /**
   * Создать полный шаблон тренировки с упражнениями и подходами
   */
  static async createFull(data: NewFullTemplateWorkout): Promise<{ id: TemplateWorkout["id"] }> {
    return await db.transaction(async (tx) => {
      // 1. Создаем шаблон тренировки
      const [templateWorkout] = await tx
        .insert(templateWorkouts)
        .values({ name: data.name })
        .returning({ id: templateWorkouts.id });

      if (!templateWorkout.id) {
        throw new Error("Failed to create template workout");
      }

      // 2. Создаем упражнения для шаблона
      const templateExercisesData: NewTemplateExercise[] = data.exercises.map((exercise, index) => ({
        templateWorkoutId: templateWorkout.id,
        exerciseId: exercise.exerciseId,
        order: index + 1,
      }));

      const createdTemplateExercises = await tx
        .insert(templateExercises)
        .values(templateExercisesData)
        .returning({ id: templateExercises.id });

      // 3. Создаем подходы для упражнений
      const templateSetsData: NewTemplateSet[] = data.exercises.reduce<NewTemplateSet[]>(
        (acc, exercise, exerciseIndex) => {
          const templateExerciseId = createdTemplateExercises[exerciseIndex].id;

          if (!templateExerciseId) {
            throw new Error(`Failed to get template exercise ID for exercise ${exerciseIndex}`);
          }

          const sets: NewTemplateSet[] = exercise.sets.map((set, setIndex) => ({
            templateExerciseId: templateExerciseId,
            order: setIndex + 1,
            weight: set.weight,
            reps: set.reps,
            rest: set.rest,
          }));

          return [...acc, ...sets];
        },
        []
      );

      if (templateSetsData.length > 0) {
        await tx.insert(templateSets).values(templateSetsData).returning({ id: templateSets.id });
      }

      return { id: templateWorkout.id };
    });
  }

  /**
   * Удалить упражнение из тренировки
   */
  static async removeExercise(id: TemplateExercise["id"]): Promise<{ id: TemplateExercise["id"] }[]> {
    return await db
      .delete(templateExercises)
      .where(eq(templateExercises.id, id))
      .returning({ id: templateExercises.id });
  }

  /**
   * Обновить шаблон тренировки
   */
  static async update(id: TemplateWorkout["id"], data: Partial<NewTemplateWorkout>): Promise<TemplateWorkout | null> {
    const [updated] = await db.update(templateWorkouts).set(data).where(eq(templateWorkouts.id, id)).returning();

    return updated || null;
  }

  /**
   * Обновить полный шаблон тренировки (заменить все упражнения и подходы)
   */
  static async updateFull(
    id: TemplateWorkout["id"],
    data: NewFullTemplateWorkout
  ): Promise<{ id: TemplateWorkout["id"] } | null> {
    return await db.transaction(async (tx) => {
      // 1. Обновляем основную информацию тренировки
      const [updatedWorkout] = await tx
        .update(templateWorkouts)
        .set({ name: data.name })
        .where(eq(templateWorkouts.id, id))
        .returning({ id: templateWorkouts.id });

      if (!updatedWorkout.id) {
        throw new Error("Failed to update template workout");
      }

      // 2. Удаляем все старые упражнения (каскадно удалятся и подходы)
      await tx.delete(templateExercises).where(eq(templateExercises.templateWorkoutId, id));

      // 3. Создаем новые упражнения
      if (data.exercises.length > 0) {
        const templateExercisesData: NewTemplateExercise[] = data.exercises.map((exercise, index) => ({
          templateWorkoutId: id,
          exerciseId: exercise.exerciseId,
          order: index + 1,
        }));

        const createdTemplateExercises = await tx
          .insert(templateExercises)
          .values(templateExercisesData)
          .returning({ id: templateExercises.id });

        // 4. Создаем новые подходы
        const templateSetsData: NewTemplateSet[] = data.exercises.reduce<NewTemplateSet[]>(
          (acc, exercise, exerciseIndex) => {
            const templateExerciseId = createdTemplateExercises[exerciseIndex].id;

            if (!templateExerciseId) {
              throw new Error(`Failed to get template exercise ID for exercise ${exerciseIndex}`);
            }

            const sets: NewTemplateSet[] = exercise.sets.map((set, setIndex) => ({
              templateExerciseId: templateExerciseId,
              order: setIndex + 1,
              weight: set.weight,
              reps: set.reps,
              rest: set.rest,
            }));

            return [...acc, ...sets];
          },
          []
        );

        if (templateSetsData.length > 0) {
          await tx.insert(templateSets).values(templateSetsData);
        }
      }

      return { id: updatedWorkout.id };
    });
  }

  /**
   * Удалить шаблон тренировки
   */
  static async remove(id: TemplateWorkout["id"]): Promise<{ id: TemplateWorkout["id"] }[]> {
    return await db.delete(templateWorkouts).where(eq(templateWorkouts.id, id)).returning({ id: templateWorkouts.id });
  }

  /**
   * Проверить существование шаблона тренировки
   */
  static async exists(id: TemplateWorkout["id"]): Promise<boolean> {
    const result = await db
      .select({ id: templateWorkouts.id })
      .from(templateWorkouts)
      .where(eq(templateWorkouts.id, id))
      .limit(1);

    return result.length > 0;
  }

  /**
   * Проверить существование по имени
   */
  static async existsByName(name: string): Promise<boolean> {
    const result = await db
      .select({ id: templateWorkouts.id })
      .from(templateWorkouts)
      .where(eq(templateWorkouts.name, name))
      .limit(1);

    return result.length > 0;
  }

  /**
   * Поиск шаблонов тренировок по частичному совпадению имени
   */
  static async search(query: string): Promise<TemplateWorkout[]> {
    return await db
      .select()
      .from(templateWorkouts)
      .where(sql`${templateWorkouts.name} LIKE ${`%${query}%`}`)
      .orderBy(asc(templateWorkouts.name));
  }

  /**
   * Получить количество шаблонов тренировок
   */
  static async count(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(templateWorkouts);

    return result.count;
  }

  /**
   * Получить недавно созданные шаблоны тренировок
   */
  static async getRecent(limit: number = 10): Promise<TemplateWorkout[]> {
    return await db.select().from(templateWorkouts).orderBy(desc(templateWorkouts.createdAt)).limit(limit);
  }

  /**
   * Дублировать шаблон тренировки
   */
  static async duplicate(id: TemplateWorkout["id"], newName?: string): Promise<{ id: TemplateWorkout["id"] } | null> {
    const originalTemplate = await this.getFullById(id);

    if (!originalTemplate) {
      return null;
    }

    const duplicateName = newName || `${originalTemplate.name} (копия)`;

    const newTemplateData: NewFullTemplateWorkout = {
      name: duplicateName,
      exercises: originalTemplate.templateExercises.map((te) => ({
        exerciseId: te.exercise.id,
        sets: te.sets.map((ts) => ({
          weight: ts.weight,
          reps: ts.reps,
          rest: ts.rest,
        })),
      })),
    };

    return await this.createFull(newTemplateData);
  }
}
