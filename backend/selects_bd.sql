-- 1) вывести рейтинг выбранного класса
WITH ratings AS (
  SELECT 
    s.login,
    s.name,
    s.surname,
    s.class,
    COUNT(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.id_task END) AS completed_tasks,
    COALESCE(AVG(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.mark END), 0) AS average_grade,
    CASE 
      WHEN COUNT(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.id_task END) > 0 
        THEN COUNT(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.id_task END) * AVG(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.mark END)
      ELSE 0 
    END AS raw_rating
  FROM learning_sys_db.student s
  LEFT JOIN learning_sys_db.journal j ON s.login = j.student_login
  GROUP BY s.login, s.name, s.surname, s.class
),
final_ratings AS (
  SELECT 
    r.*,
    RANK() OVER (PARTITION BY r.class ORDER BY r.raw_rating DESC) AS rank_position
  FROM ratings r
)
SELECT *
FROM final_ratings
WHERE class = '10A'
ORDER BY raw_rating DESC;


-- 2) вывести имя, фамилию выбранного ученика, с количеством выполненных(оценненых) заданий, средним баллом и местом в рейтинге класса
WITH ratings AS (
  SELECT 
    s.login,
    s.name,
    s.surname,
    s.class,
    COUNT(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.id_task END) AS completed_tasks,
    COALESCE(AVG(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.mark END), 0) AS average_grade,
    CASE 
      WHEN COUNT(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.id_task END) > 0 
        THEN COUNT(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.id_task END) * AVG(CASE WHEN j.mark BETWEEN 1 AND 5 THEN j.mark END)
      ELSE 0 
    END AS raw_rating
  FROM learning_sys_db.student s
  LEFT JOIN learning_sys_db.journal j ON s.login = j.student_login
  GROUP BY s.login, s.name, s.surname, s.class
),
final_ratings AS (
  SELECT 
    r.*,
    RANK() OVER (PARTITION BY r.class ORDER BY r.raw_rating DESC) AS rank_position
  FROM ratings r
)
SELECT *
FROM final_ratings
WHERE login = 'student10B8';

-- 3)вывести все классы с количеством учеников в этих классах
SELECT class, COUNT(*) AS student_count
FROM learning_sys_db.student
GROUP BY class;

-- 4)вывести всех учеников выбранного класса, с указанием всех заданий учеников
SELECT 
  s.name,
  s.surname,
  t.id_task,
  t.name AS task_name,
  j.mark
FROM learning_sys_db.student s
CROSS JOIN learning_sys_db.task t
LEFT JOIN learning_sys_db.journal j 
  ON s.login = j.student_login 
  AND t.id_task = j.id_task
WHERE s.class = '10B'
ORDER BY s.surname, s.name, t.id_task;

-- 5)вывести все задания выбранного ученика
SELECT 
  s.name,
  s.surname,
  t.id_task,
  t.name AS task_name,
  j.mark
FROM learning_sys_db.student s
CROSS JOIN learning_sys_db.task t
LEFT JOIN learning_sys_db.journal j 
  ON s.login = j.student_login 
  AND t.id_task = j.id_task
WHERE s.login = 'student10A1'
ORDER BY t.id_task;

-- 6) вывести всех учеников выбранного класса
SELECT surname, name, patronymic
FROM learning_sys_db.student
WHERE class = '10A'
ORDER BY surname, name, patronymic;

-- 7) вывести все классы
SELECT DISTINCT class
FROM learning_sys_db.student
ORDER BY class;

-- 8) вывести все задания
SELECT name
FROM learning_sys_db.task
ORDER BY name;