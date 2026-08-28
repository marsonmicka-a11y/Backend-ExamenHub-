USE exam_online;


INSERT INTO users (email, password, first_name, last_name, role, is_active) VALUES
('admin@exam.com', '$2a$10$rQZ5K5Y5Y5Y5Y5Y5Y5Y5YuGqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Admin', 'System', 'admin', TRUE);



DELETE FROM users;

INSERT INTO users (email, password, first_name, last_name, role, is_active) VALUES
('admin@exam.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'System', 'admin', TRUE),
('student1@exam.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jean', 'Dupont', 'student', TRUE),
('student2@exam.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Marie', 'Martin', 'student', TRUE),
('student3@exam.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Pierre', 'Bernard', 'student', TRUE);

INSERT INTO courses (title, description, code) VALUES
('Introduction à la Programmation', 'Cours de base sur les concepts de programmation', 'INFO101'),
('Bases de Données', 'Conception et manipulation de bases de données relationnelles', 'INFO201'),
('Développement Web', 'HTML, CSS, JavaScript et frameworks modernes', 'INFO301');

INSERT INTO exams (course_id, title, description, duration_minutes, total_points, is_published, start_date, end_date) VALUES
(1, 'Examen Final - Programmation', 'Examen portant sur les bases de la programmation', 60, 20, TRUE, '2025-01-01 00:00:00', '2026-12-31 23:59:59'),
(2, 'Contrôle Continu - SQL', 'Questions sur les requêtes SQL', 45, 15, TRUE, '2025-01-01 00:00:00', '2026-12-31 23:59:59'),
(3, 'Quiz JavaScript', 'Notions fondamentales de JavaScript', 30, 10, TRUE, '2025-01-01 00:00:00', '2026-12-31 23:59:59');

-- Questions for Exam 1
INSERT INTO questions (exam_id, text, points, order_index) VALUES
(1, 'Quel mot-clé est utilisé pour déclarer une variable en JavaScript (ES6) ?', 2, 1),
(1, 'Quelle structure de données suit le principe LIFO ?', 2, 2),
(1, 'Que signifie HTML ?', 2, 3),
(1, 'Quelle méthode HTTP est utilisée pour récupérer des données ?', 2, 4),
(1, 'Quel est le résultat de 2 + "2" en JavaScript ?', 2, 5);

INSERT INTO choices (question_id, text, is_correct, order_index) VALUES
(1, 'var', FALSE, 1),
(1, 'let', TRUE, 2),
(1, 'const', FALSE, 3),
(1, 'variable', FALSE, 4),
(2, 'Queue', FALSE, 1),
(2, 'Stack', TRUE, 2),
(2, 'Array', FALSE, 3),
(2, 'LinkedList', FALSE, 4),
(3, 'HyperText Markup Language', TRUE, 1),
(3, 'High Tech Modern Language', FALSE, 2),
(3, 'Hyper Transfer Markup Language', FALSE, 3),
(3, 'Home Tool Markup Language', FALSE, 4),
(4, 'POST', FALSE, 1),
(4, 'GET', TRUE, 2),
(4, 'PUT', FALSE, 3),
(4, 'DELETE', FALSE, 4),
(5, '4', FALSE, 1),
(5, '22', TRUE, 2),
(5, 'Error', FALSE, 3),
(5, 'undefined', FALSE, 4);

-- Questions for Exam 2
INSERT INTO questions (exam_id, text, points, order_index) VALUES
(2, 'Quelle commande SQL permet de sélectionner des données ?', 3, 1),
(2, 'Quelle clause est utilisée pour filtrer les résultats ?', 3, 2),
(2, 'Que signifie la contrainte PRIMARY KEY ?', 3, 3),
(2, 'Quelle jointure retourne toutes les lignes de la table de gauche ?', 3, 4),
(2, 'Quelle fonction agrège le nombre de lignes ?', 3, 5);

INSERT INTO choices (question_id, text, is_correct, order_index) VALUES
(6, 'SELECT', TRUE, 1),
(6, 'GET', FALSE, 2),
(6, 'FETCH', FALSE, 3),
(6, 'QUERY', FALSE, 4),
(7, 'WHERE', TRUE, 1),
(7, 'HAVING', FALSE, 2),
(7, 'FILTER', FALSE, 3),
(7, 'IF', FALSE, 4),
(8, 'Une clé unique non nulle', TRUE, 1),
(8, 'Une clé étrangère', FALSE, 2),
(8, 'Un index', FALSE, 3),
(8, 'Une contrainte de check', FALSE, 4),
(9, 'INNER JOIN', FALSE, 1),
(9, 'LEFT JOIN', TRUE, 2),
(9, 'RIGHT JOIN', FALSE, 3),
(9, 'FULL JOIN', FALSE, 4),
(10, 'SUM()', FALSE, 1),
(10, 'COUNT()', TRUE, 2),
(10, 'AVG()', FALSE, 3),
(10, 'MAX()', FALSE, 4);


INSERT INTO questions (exam_id, text, points, order_index) VALUES
(3, 'Quel type de données représente une chaîne de caractères en JavaScript ?', 2, 1),
(3, 'Quelle méthode convertit un objet en JSON ?', 2, 2),
(3, 'Que retourne typeof null ?', 2, 3),
(3, 'Quelle boucle est adaptée pour parcourir un tableau ?', 2, 4),
(3, 'Comment déclarer une fonction fléchée ?', 2, 5);

INSERT INTO choices (question_id, text, is_correct, order_index) VALUES
(11, 'string', TRUE, 1),
(11, 'String', FALSE, 2),
(11, 'text', FALSE, 3),
(11, 'char', FALSE, 4),
(12, 'JSON.parse()', FALSE, 1),
(12, 'JSON.stringify()', TRUE, 2),
(12, 'toJSON()', FALSE, 3),
(12, 'Object.toJSON()', FALSE, 4),
(13, 'null', FALSE, 1),
(13, 'object', TRUE, 2),
(13, 'undefined', FALSE, 3),
(13, 'number', FALSE, 4),
(14, 'for...in', FALSE, 1),
(14, 'for...of', TRUE, 2),
(14, 'while', FALSE, 3),
(14, 'do...while', FALSE, 4),
(15, 'function() => {}', FALSE, 1),
(15, '() => {}', TRUE, 2),
(15, '=> function() {}', FALSE, 3),
(15, 'arrow() {}', FALSE, 4);


UPDATE exams SET total_points = 10 WHERE id = 1;
UPDATE exams SET total_points = 15 WHERE id = 2;
UPDATE exams SET total_points = 10 WHERE id = 3;
