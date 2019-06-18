CREATE TABLE backlogger_user_games (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL ,
  time_to_complete TEXT NOT NULL,
  notes TEXT NOT NULL,
  current_game BOOLEAN NOT NULL,
  summary TEXT,
  storyline TEXT,
  game_rating FLOAT,
  game_cover INT,
  game_id INTEGER,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE backlogger_user_games
  ADD COLUMN
    user_console_id INTEGER REFERENCES backlogger_consoles(id)
    ON DELETE SET NULL;

ALTER TABLE backlogger_user_games
  ADD COLUMN
    game_user_id INTEGER REFERENCES backlogger_users(id)
    ON DELETE SET NULL;