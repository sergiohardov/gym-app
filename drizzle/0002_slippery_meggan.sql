PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_exercise_id` integer NOT NULL,
	`order` integer NOT NULL,
	`weight` integer,
	`reps` integer,
	`rest` integer,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sets`("id", "workout_exercise_id", "order", "weight", "reps", "rest") SELECT "id", "workout_exercise_id", "order", "weight", "reps", "rest" FROM `sets`;--> statement-breakpoint
DROP TABLE `sets`;--> statement-breakpoint
ALTER TABLE `__new_sets` RENAME TO `sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `workout_exercises` DROP COLUMN `created_at`;