ALTER TABLE `sets` RENAME TO `history_workout_exercise_sets`;--> statement-breakpoint
ALTER TABLE `history_workout_exercise_sets` RENAME COLUMN "workout_exercise_id" TO "history_workout_exercise_id";--> statement-breakpoint
CREATE TABLE `history_workout_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`history_workout_id` integer NOT NULL,
	`exercise_id` integer,
	`title` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`history_workout_id`) REFERENCES `history_workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `history_workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer,
	`title` text NOT NULL,
	`date` text NOT NULL,
	`duration` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `workout_exercise_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_exercise_id` integer NOT NULL,
	`order` integer NOT NULL,
	`weight` integer,
	`reps` integer,
	`rest` integer,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_history_workout_exercise_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`history_workout_exercise_id` integer NOT NULL,
	`order` integer NOT NULL,
	`weight` integer,
	`reps` integer,
	FOREIGN KEY (`history_workout_exercise_id`) REFERENCES `history_workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_history_workout_exercise_sets`("id", "history_workout_exercise_id", "order", "weight", "reps") SELECT "id", "history_workout_exercise_id", "order", "weight", "reps" FROM `history_workout_exercise_sets`;--> statement-breakpoint
DROP TABLE `history_workout_exercise_sets`;--> statement-breakpoint
ALTER TABLE `__new_history_workout_exercise_sets` RENAME TO `history_workout_exercise_sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_workout_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_workout_exercises`("id", "workout_id", "exercise_id", "order") SELECT "id", "workout_id", "exercise_id", "order" FROM `workout_exercises`;--> statement-breakpoint
DROP TABLE `workout_exercises`;--> statement-breakpoint
ALTER TABLE `__new_workout_exercises` RENAME TO `workout_exercises`;