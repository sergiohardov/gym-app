import { NewTemplateSet, TemplateSet } from "@/types/db";
import { db } from "db/client";
import { templateSets } from "db/schema";
import { eq } from "drizzle-orm";

export class TemplateSetsModel {
  /**
   * Создать сет для упражнения тренировки
   */
  static async create(data: NewTemplateSet) {
    return await db.insert(templateSets).values(data).returning({ id: templateSets.id });
  }

  /**
   * Удалить сет
   */
  static async remove(id: TemplateSet["id"]): Promise<{ id: TemplateSet["id"] }[]> {
    return await db.delete(templateSets).where(eq(templateSets.id, id)).returning({ id: templateSets.id });
  }

  /**
   * Обновить информацию о сете
   */
  static async update(id: TemplateSet["id"], data: Partial<NewTemplateSet>): Promise<TemplateSet | null> {
    const [updated] = await db.update(templateSets).set(data).where(eq(templateSets.id, id)).returning();

    return updated || null;
  }
}
