CREATE TABLE `template_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`template_workout_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`template_workout_id`) REFERENCES `template_workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`template_exercise_id` integer NOT NULL,
	`order` integer NOT NULL,
	`weight` integer,
	`reps` integer,
	`rest` integer,
	FOREIGN KEY (`template_exercise_id`) REFERENCES `template_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template_workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
