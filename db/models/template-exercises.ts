import { Exercise, NewTemplateExercise, TemplateExercise, TemplateSet } from "@/types/db";
import { db } from "db/client";
import { templateExercises, templateSets } from "db/schema";
import { eq } from "drizzle-orm";

export class TemplateExercisesModel {
  /**
   * Получить все сеты упражнения
   */
  // TODO: описать тип возвращаемого значения
  static async getExerciseWithSets(id: TemplateExercise["id"]) {
    return await db.query.templateExercises.findFirst({
      where: eq(templateExercises.id, id),
      with: {
        exercise: {},
        sets: {},
      },
    });
  }

  /**
   * Создать упражнение для тренировки
   */
  static async create(data: NewTemplateExercise) {
    return await db.insert(templateExercises).values(data).returning({ id: templateExercises.id });
  }

  /**
   * Удалить Упражнение
   */
  static async remove(id: TemplateExercise["id"]): Promise<{ id: TemplateExercise["id"] }[]> {
    return await db
      .delete(templateExercises)
      .where(eq(templateExercises.id, id))
      .returning({ id: templateExercises.id });
  }
}
