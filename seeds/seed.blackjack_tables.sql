TRUNCATE users, game_table;

INSERT INTO users(user_name, password)
VALUES
('Bob', '$2a$10$azdI1Xj6NXCWQGAoNIrTC.SX5GObpuU2mGYHyCXHS.DRPu8UXgkIW'),
('Meg', '$2a$10$l9hLwlSh.22tyu8rqjljZe.naTJifeFeS1IQKJyg6H/.M8KIhEOTa'),
('Stanley', '$2a$10$ZEkCyUsbosoTikUH/fGLdeWOeO5zbZ2j34pNa243KzK8hxBOqo8SG');

INSERT INTO game_table(bank, wins, losses, moneywon, user_id)
VALUES
(250000,3,5,3500,2),
(360055,9,22,37000,1),
(10200,3,5,440,1),
(56000,66,4,25000,1),
(6000,9,88,3500,2),
(40150,3,5,3500,2),
(9440,1,9,41500,3),
(6400,6,5,30000,3),
(2540,9,5,500,3);
 
