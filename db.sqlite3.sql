BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `files` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`path_to`	varchar(255),
	`site_number`	INTEGER,
	`type_of`	varchar(50),
	`create_at`	datetime,
	CONSTRAINT `fk_files_site` FOREIGN KEY(`site_number`) REFERENCES `site`(`number`)
);
CREATE TABLE IF NOT EXISTS `cordonnates` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`lat`	varchar(50),
	`long`	varchar(50),
	`alt`	varchar(50),
	`moment`	datetime,
	`site_number`	INTEGER,
	CONSTRAINT `fk_coord_site` FOREIGN KEY(`site_number`) REFERENCES `site`(`number`)
);
CREATE TABLE IF NOT EXISTS `site` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`number`	INTEGER,
	`name`	varchar(50),
	`description`	varchar(255),
	`created_at`	datetime,
	`updated_at`	datetime
);
COMMIT;
