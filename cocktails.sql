DROP SCHEMA IF EXISTS `cocktails`;
-- Created Schema
CREATE SCHEMA `cocktails` ;

-- Created 3 Tables with FK
CREATE TABLE `cocktails`.`user` (
  `id` VARCHAR(255) NOT NULL UNIQUE,
  `username` VARCHAR(255) NOT NULL UNIQUE,
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
  (`id`, `username`, `password`) 
VALUES 
  ('7801ff44-d79f-11ec-856c-6b8b7bc362a1', 'user1', '$2b$10$wt2o2lmxk8TIoiYVVKRDsewoUbFY75FngwpcITXxFQPoSfs0J38Ke'),
  ('78021592-d79f-11ec-856c-6b8b7bc362a1', 'user2', '$2b$10$KQa1Av63mMe506ccmzCOZO9nCaIKpcO4Fpwk75o8R5v80ScazfjWi'),
  ('7802168c-d79f-11ec-856c-6b8b7bc362a1', 'user3', '$2b$10$d0yM6cCrMSO6tff3toxfFurhzFxI7wS6G1kcMA8Od3jGmi.LWHtba'),
  ('7802170e-d79f-11ec-856c-6b8b7bc362a1', 'user4', '$2b$10$SeMGQhm.gsfvqkk6.pJA5ukTHHTaJZPMKnT6AwMp6mjSKNob.Jxim'),
  ('78021790-d79f-11ec-856c-6b8b7bc362a1', 'user5', '$2b$10$oq2vFyknns8ADkzXN1T75uBQco7fnyh7P5thaBc0FZXdq2Dj9J5Ga'),
  ('78021808-d79f-11ec-856c-6b8b7bc362a1', 'user6', '$2b$10$naF6Cg99jZIIqCBECE6yueA7QbCLXkn1FgthPbz/Z0.rHrE/qsTwe'),
  ('7802186c-d79f-11ec-856c-6b8b7bc362a1', 'user7', '$2b$10$/yWXvXW1YOq1tfHAcxN7aeoe1mhjekbBdYqcgrbVPaQ24Gs8lyJcq'),
  ('780218da-d79f-11ec-856c-6b8b7bc362a1', 'user8', '$2b$10$K8zpzjVU.BLCkLpcNGZHLux65IqBmSbR87ZG4mvlJ6xLtSG9rbOs6'),
  ('78021948-d79f-11ec-856c-6b8b7bc362a1', 'user9', '$2b$10$rWVg6//YHif2.aUMlfdd..zpwqulFPl1aLA1nTde2l2iIvs7LSOka'),
  ('780219d4-d79f-11ec-856c-6b8b7bc362a1', 'user10', '$2b$10$QvBgK0fkXSnmDCLhltPnfuUZMabPmgV9kgQyHlW1JzU9UVSEJraJ2');
