import { NewTemplateExercise, TemplateSet } from "@/types/db";
import { db } from "db/client";
import { templateExercises, templateSets } from "db/schema";
import { eq } from "drizzle-orm";

export class TemplateExercisesModel {
  /**
   * Создать упражнение для тренировки
   */
  static async create(data: NewTemplateExercise) {
    return await db.insert(templateExercises).values(data).returning({ id: templateExercises.id });
  }
}
