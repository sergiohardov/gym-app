import { exercises, workouts } from "db/schema";

export type Exercise = typeof exercises.$inferSelect;
export type Workout = typeof workouts.$inferSelect;