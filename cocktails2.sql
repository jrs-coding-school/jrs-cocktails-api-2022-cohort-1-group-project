
-- Update email by user ID 
UPDATE `cocktails`.`user` 
  SET `email` = '23322' 
  WHERE (`id` = 'sdfdsf');

-- Update password by user ID
UPDATE `cocktails`.`user` 
  SET `password` = 'sdfd' 
  WHERE (`id` = '23322');

-- FAVORITE TABLE
-- SELECT ALL
SELECT * FROM cocktails.favorite;

-- ADD favorite by user ID
INSERT INTO `cocktails`.`favorite` 
  (`id`, `userId`) 
VALUES 
  ('ddfs', 'sdfds');

-- REMOVE cocktail by user ID


-- EDIT

-- Add favorite drinks
-- Do FK for all Tables


-- cast(rating as TINYINT)
