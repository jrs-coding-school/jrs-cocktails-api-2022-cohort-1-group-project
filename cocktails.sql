DROP SCHEMA IF EXISTS `cocktails`;
-- Created Schema
CREATE SCHEMA `cocktails` ;

-- Created 3 Tables with FK
CREATE TABLE `cocktails`.`user` (
  `id` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,

  PRIMARY KEY (`id`)
);

CREATE TABLE `cocktails`.`favorite` (
  `id` INT NOT NULL AUTO_INCREMENT UNIQUE,
  `userId` VARCHAR(255) NOT NULL,
  `drinkId` VARCHAR(255) NOT NULL,

  PRIMARY KEY (`id`),
  FOREIGN KEY(`userId`)
		REFERENCES `user`(`id`)
);

CREATE TABLE `cocktails`.`review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` VARCHAR(255) NOT NULL,
  `drinkId` VARCHAR(6) NOT NULL,
  `rating` ENUM('1', '2', '3', '4', '5') NULL,
  `comment` VARCHAR(255) NULL,

  PRIMARY KEY (`id`),
  FOREIGN KEY(`userId`)
		REFERENCES `user`(`id`)
);

-- USER TABLE
-- Add users to User table
INSERT INTO `cocktails`.`user` 
  (`id`, `email`, `password`) 
VALUES 
  ('uuid0', 'user1@email.com', 'password'),
  ('uuid1', 'user2@email.com', 'password'),
  ('uuid2', 'user3@email.com', 'password'),
  ('uuid3', 'user4@email.com', 'password'),
  ('uuid4', 'user5@email.com', 'password'),
  ('uuid5', 'user6@email.com', 'password');
