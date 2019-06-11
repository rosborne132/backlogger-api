ALTER TABLE backlogger_user_consoles
  DROP COLUMN IF EXISTS user_id;

ALTER TABLE backlogger_user_consoles
  DROP COLUMN IF EXISTS console_id;

DROP TABLE IF EXISTS backlogger_user_consoles;
