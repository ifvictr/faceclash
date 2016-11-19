-- Players
DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
    `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(35) NOT NULL,
    `last_name` VARCHAR(35),
    `gender` CHAR(1) NOT NULL DEFAULT 'f',
    `score` INT UNSIGNED NOT NULL DEFAULT '0',
    `wins` INT UNSIGNED NOT NULL DEFAULT '0',
    `losses` INT UNSIGNED NOT NULL DEFAULT '0',
    `ip` VARCHAR(45),
    `ip_hash` CHAR(32),
    `ready` CHAR(1) NOT NULL DEFAULT '0',
    `created_at` INT UNSIGNED NOT NULL
);
-- Reports
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
    `id` INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(70) DEFAULT 'Anonymous',
    `email` VARCHAR(64),
    `message` VARCHAR(510) NOT NULL,
    `created_at` INT UNSIGNED NOT NULL
);