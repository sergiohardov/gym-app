CREATE TABLE `history_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`history_workout_id` integer NOT NULL,
	`exercise_id` integer,
	`name` text NOT NULL,
	`order` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`history_workout_id`) REFERENCES `history_workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `history_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`history_exercise_id` integer NOT NULL,
	`order` integer NOT NULL,
	`weight` integer,
	`reps` integer,
	`rest` integer,
	`completed` integer DEFAULT false,
	`notes` text,
	FOREIGN KEY (`history_exercise_id`) REFERENCES `history_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `history_workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`template_workout_id` integer,
	`name` text NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text,
	`duration` integer,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`template_workout_id`) REFERENCES `template_workouts`(`id`) ON UPDATE no action ON DELETE set null
);
