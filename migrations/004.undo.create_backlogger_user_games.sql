ALTER TABLE backlogger_user_games
  DROP COLUMN IF EXISTS game_cover;

ALTER TABLE backlogger_user_games
  DROP COLUMN IF EXISTS console_id;

DROP TABLE IF EXISTS backlogger_game_images;

DROP TABLE IF EXISTS backlogger_user_games;