/*
Query for creating a consult_user table, where the user's role is
either 'Doctor' or 'Patient'.
*/
CREATE TABLE consult_user (
  user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_full_name VARCHAR(255) NOT NULL, 
  user_role VARCHAR(255) NOT NULL
);


/*
Query for adding actual users to consult_user table.
*/
INSERT INTO consult_user (user_full_name, user_role) VALUES
  ('John Smith', 'Doctor'),
  ('Isabella Chen', 'Doctor'),
  ('Linh Nguyen', 'Patient'),
  ('David Wang', 'Patient');


/*
Short query to create a consultation table.
*/
CREATE TABLE consultation (
  consultation_id INT PRIMARY KEY
);


/*
Adding 2 consultations for the consultation table.
*/
INSERT INTO consultation VALUES
 (1), 
 (2);


/*
Query to create a message table.
*/
CREATE TABLE message (
  message_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message_content TEXT NOT NULL,
  time_sent TIMESTAMP (2) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL REFERENCES consult_user (user_id),
  consultation_id INT NOT NULL REFERENCES consultation (consultation_id)
);



/*
Query to add messages to consultation 1 between users with ids 2 and 4,
after each insert statement, we will wait for some amount of seconds 
before executing another statement.
*/
INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (4, 1, 'Hi, I''m experiencing some side effects from the new medication', '2025-10-25 14:30:36.20Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (2, 1, 'Sorry to hear that. What kind of side effects are you noticing?', '2025-10-25 14:36:23.21Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (4, 1, 'I''ve been feeling dizzy and a bit nauseous since yesterday.', '2025-10-25 14:41:11.59Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (2, 1, 'Those can happen at first, try taking it with food. If it persists more than 2 days, let me know.', '2025-10-25 14:49:42.26Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (4, 1, 'Got it, I’ll do that. Thanks, doctor.', '2025-10-25 14:56:34.54Z');



/*
Query to add messages to consultation 2 between users with ids 1 and 3,
after each insert statement, we will wait for some amount of seconds 
before executing another statement.
*/
INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (1, 2, 'Hi Linh, just checking in, how''s your knee feeling after yesterday''s procedure?', '2025-10-24 10:01:22.29Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (3, 2, 'Hey doc, a bit sore but not too bad. Been icing it like you said.', '2025-10-24 10:15:28.11Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (1, 2, 'Perfect. Any swelling or redness around the area?', '2025-10-24 10:20:10.23Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (3, 2, 'A little swelling, but no redness or heat.', '2025-10-24 10:30:40.45Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (1, 2, 'That''s normal for day one. Keep it elevated when you can.', '2025-10-24 10:36:23.50Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (3, 2, 'Got it. When can I start walking without the brace?', '2025-10-24 10:49:32.18Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (1, 2, 'Give it at least 3 days, then try short walks around the house.', '2025-10-24 10:55:12.31Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (3, 2, 'Okay, I''ll take it easy. Should I still take the painkillers if it doesn''t hurt much?', '2025-10-24 11:01:43.05Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (1, 2, 'Only if you need them. No point taking extra if you''re comfortable.', '2025-10-24 11:07:20.11Z');

INSERT INTO message (user_id, consultation_id, message_content, time_sent) VALUES 
  (3, 2, 'Sweet, thanks for the check-in.', '2025-10-24 11:14:23.55Z');



/*
Query to create an index on the user_id foreign key column for message table.
*/
CREATE INDEX index_message_user_id ON message (user_id);