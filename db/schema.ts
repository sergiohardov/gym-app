import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  created_at: text()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
