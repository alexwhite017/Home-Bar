CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`parent_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ingredients_name_unique` ON `ingredients` (`name`);--> statement-breakpoint
CREATE TABLE `recipe_ingredients` (
	`recipe_id` integer NOT NULL,
	`ingredient_id` integer NOT NULL,
	`position` integer NOT NULL,
	`amount` real,
	`unit` text,
	`notation` text NOT NULL,
	`optional` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`recipe_id`, `position`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text,
	`name` text NOT NULL,
	`instructions` text NOT NULL,
	`glass` text,
	`garnish` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_external_id_unique` ON `recipes` (`external_id`);--> statement-breakpoint
CREATE TABLE `substitution_group_members` (
	`group_id` integer NOT NULL,
	`ingredient_id` integer NOT NULL,
	PRIMARY KEY(`group_id`, `ingredient_id`),
	FOREIGN KEY (`group_id`) REFERENCES `substitution_groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `substitution_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
