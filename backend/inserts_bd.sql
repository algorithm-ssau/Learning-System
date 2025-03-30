-- Заполнение таблицы goal (тексты заданий)
INSERT INTO learning_sys_db.goal (id_goal, text) VALUES
  (1, 'Соберите все монеты.'),
  (2, 'Заполните лунки камнями.'),
  (3, 'Соберите все монеты и заполните лунки камнями.');

-- Заполнение таблицы game_field с минимальными размерами 10x10 (100 клеток)
INSERT INTO learning_sys_db.game_field (id_game_field, length, width, layaout_array, energy) VALUES 
  (1, 10, 10, '0 1 2 3 4 0 0 1 2 3 0 1 2 3 4 0 0 1 2 3 0 1 2 3 4 0 0 1 2 3 0 1 2 3 4 5 0 1 2 3 0 1 2 3 4 0 0 1 2 3 0 1 2 3 4 0 0 1 2 3 0 1 2 3 4 0 0 1 2 3 0 1 2 3 4 0 0 1 2 3 0 1 2 3 4 0 0 1 2 3 0 1 2 3 4 0 0 1 2 3', 100),
  (2, 10, 10, '0 0 0 0 0 1 0 0 2 0 0 00 0 0 1 0 0 2 0 0 0 0 0 0 1 0 0 2 0 0 0 0 0 1 0 0 2 0 0 0 0 0 0 1 0 0 2 0 0 0 5 0 0 1 0 0 2 0 0 0 0 0 1 0 0 2 0 0 0 0 0 0 1 0 0 2 0 0 0 0 0 0 1 0 0 2 0 0 0 0 0 0 1 0 0 2 0', 150),
  (3, 10, 10, '3 4 0 1 2 3 4 0 0 0 3 4 0 1 2 3 4 0 0 0 3 4 0 1 2 3 4 0 0 0 3 4 0 1 2 3 4 0 0 0 3 4 0 1 2 3 4 0 0 0 3 4 0 1 2 3 4 5 0 0 3 4 0 1 2 3 4 0 0 0 3 4 0 1 2 3 4 0 0 0 3 4 0 1 2 3 4 0 0 0 3 4 0 1 2 3 4 0 0 0', 200);

-- Заполнение таблицы task (связь игрового поля и цели)
INSERT INTO learning_sys_db.task (id_task, name, id_game_field, id_goal) VALUES
  (1, 'Домашнее задание 1', 1, 1),
  (2, 'Домашнее задание 2', 2, 2),
  (3, 'Домашнее задание 3', 3, 3),
  (4, 'Домашнее задание 4', 2, 1),
  (5, 'Домашнее задание 5', 1, 2);
  
-- Заполнение таблицы student (20 учеников: 10 в классе 10A и 10 в классе 10B)
-- Класс 10A
INSERT INTO learning_sys_db.student (name, surname, patronymic, login, password, class) VALUES
  ('Ivan', 'Ivanov', 'Ivanovich', 'student10A1', 'pass1', '10A'),
  ('Petr', 'Petrov', 'Petrovich', 'student10A2', 'pass2', '10A'),
  ('Sidor', 'Sidorov', 'Sidorovich', 'student10A3', 'pass3', '10A'),
  ('Alexey', 'Alexeev', 'Alexeevich', 'student10A4', 'pass4', '10A'),
  ('Dmitry', 'Dmitriev', 'Dmitrievich', 'student10A5', 'pass5', '10A'),
  ('Sergey', 'Sergeev', 'Sergeevich', 'student10A6', 'pass6', '10A'),
  ('Nikolay', 'Nikolaev', 'Nikolaevich', 'student10A7', 'pass7', '10A'),
  ('Mikhail', 'Mikhailov', 'Mikhailovich', 'student10A8', 'pass8', '10A'),
  ('Andrey', 'Andreev', 'Andreevich', 'student10A9', 'pass9', '10A'),
  ('Victor', 'Victorov', 'Victorovich', 'student10A10', 'pass10', '10A');

-- Класс 10B
INSERT INTO learning_sys_db.student (name, surname, patronymic, login, password, class) VALUES
  ('Olga', 'Smirnova', 'Ivanovna', 'student10B1', 'pass11', '10B'),
  ('Elena', 'Sidorova', 'Petrovna', 'student10B2', 'pass12', '10B'),
  ('Maria', 'Alexandrova', 'Sergeevna', 'student10B3', 'pass13', '10B'),
  ('Tatiana', 'Dmitrieva', 'Nikolayevna', 'student10B4', 'pass14', '10B'),
  ('Irina', 'Fedorova', 'Alexandrovna', 'student10B5', 'pass15', '10B'),
  ('Svetlana', 'Mikhailova', 'Dmitrievna', 'student10B6', 'pass16', '10B'),
  ('Natalia', 'Andreeva', 'Mikhailovna', 'student10B7', 'pass17', '10B'),
  ('Marina', 'Vladimirova', 'Sergeevna', 'student10B8', 'pass18', '10B'),
  ('Yulia', 'Petrova', 'Ivanovna', 'student10B9', 'pass19', '10B'),
  ('Galina', 'Nikolaeva', 'Petrovna', 'student10B10', 'pass20', '10B');
  
  -- Заполнение таблицы journal (записи оценок за задания)
-- Для каждого ученика количество заданий может быть разным, и некоторые задания повторяются у разных учеников
INSERT INTO learning_sys_db.journal (id_journal, mark, student_login, id_task) VALUES
  (1, 4, 'student10A1', 1),
  (2, -1, 'student10A1', 2),
  (3, 5, 'student10A2', 3),
  (4, 3, 'student10A3', 1),
  (5, 4, 'student10A3', 3),
  (6, 5, 'student10A3', 5),
  (7, -1, 'student10A4', 2),
  (8, 4, 'student10A5', 4),
  (9, 3, 'student10A5', 5),
  (10, 4, 'student10A6', 1),
  (11, 5, 'student10A7', 2),
  (12, 3, 'student10A7', 3),
  (13, 0, 'student10A8', 4),
  (14, 3, 'student10A9', 1),
  (15, 4, 'student10A9', 2),
  (16, 5, 'student10A9', 3),
  (17, 4, 'student10A10', 5),
  (18, 3, 'student10B1', 1),
  (19, 4, 'student10B1', 2),
  (20, 5, 'student10B2', 3),
  (21, 4, 'student10B3', 1),
  (22, -1, 'student10B3', 4),
  (23, 0, 'student10B4', 2),
  (24, 4, 'student10B4', 5),
  (25, 3, 'student10B5', 3),
  (26, 4, 'student10B5', 4),
  (27, 5, 'student10B5', 5),
  (28, 4, 'student10B6', 1),
  (29, 0, 'student10B7', 2),
  (30, 5, 'student10B7', 3),
  (31, 0, 'student10B8', 4),
  (32, 4, 'student10B9', 1),
  (33, 3, 'student10B9', 2),
  (34, 5, 'student10B9', 3),
  (35, 4, 'student10B10', 5),
  (36, 0, 'student10B10', 2);

-- Заполнение таблицы solution (решения учеников)
-- Для каждого решения указаны: алгоритм (строка с цифрами, например, "1 2 3"), логин ученика и задание, к которому относится решение.
INSERT INTO learning_sys_db.solution (id_solution, algorithm, student_login, id_task) VALUES
  ('sol_A1_1', '1 2 3', 'student10A1', 1),
  ('sol_A1_2', '2 3 1', 'student10A1', 2),
  ('sol_A2_3', '3 4 1', 'student10A2', 3),
  ('sol_A3_1', '1 1 2', 'student10A3', 1),
  ('sol_A3_3', '2 1 3', 'student10A3', 3),
  ('sol_A3_5', '3 2 1', 'student10A3', 5),
  ('sol_A4_2', '2 2 3', 'student10A4', 2),
  ('sol_A5_4', '1 3 2', 'student10A5', 4),
  ('sol_A5_5', '3 1 2', 'student10A5', 5),
  ('sol_A6_1', '1 2 2', 'student10A6', 1),
  ('sol_A7_2', '2 3 3', 'student10A7', 2),
  ('sol_A7_3', '3 2 2', 'student10A7', 3),
  ('sol_A8_4', '1 1 1', 'student10A8', 4),
  ('sol_A9_1', '2 1 1', 'student10A9', 1),
  ('sol_A9_2', '3 3 2', 'student10A9', 2),
  ('sol_A9_3', '1 3 1', 'student10A9', 3),
  ('sol_A10_5', '2 2 2', 'student10A10', 5),
  ('sol_B1_1', '1 2 1', 'student10B1', 1),
  ('sol_B1_2', '2 1 2', 'student10B1', 2),
  ('sol_B2_3', '3 4 2', 'student10B2', 3),
  ('sol_B3_1', '1 1 3', 'student10B3', 1),
  ('sol_B3_4', '2 2 4', 'student10B3', 4),
  ('sol_B4_2', '3 2 1', 'student10B4', 2),
  ('sol_B4_5', '1 2 3', 'student10B4', 5),
  ('sol_B5_3', '2 3 4', 'student10B5', 3),
  ('sol_B5_4', '4 3 2', 'student10B5', 4),
  ('sol_B5_5', '3 1 2', 'student10B5', 5),
  ('sol_B6_1', '1 3 2', 'student10B6', 1),
  ('sol_B7_2', '2 2 2', 'student10B7', 2),
  ('sol_B7_3', '3 3 3', 'student10B7', 3),
  ('sol_B8_4', '1 2 3', 'student10B8', 4),
  ('sol_B9_1', '2 3 1', 'student10B9', 1),
  ('sol_B9_2', '3 1 2', 'student10B9', 2),
  ('sol_B9_3', '1 3 2', 'student10B9', 3),
  ('sol_B10_5', '2 1 3', 'student10B10', 5),
  ('sol_B10_2', '3 2 1', 'student10B10', 2);