USE emp_db;
INSERT INTO departments (name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales", 80000.00, 1), ("Engineering", 100000.00, 2), ("Finance", 100000.00, 3), ("Legal", 120000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Billy", "Krueger", 1, NULL),
("Carter James", "Kreuger", 1, 1),
("Sammy", "Zorich", 1, 1),
("Cristiano", "Caraveo", 1, 1),
("Aaron", "Farrell", 2, NULL),
("Nick", "Strong", 2, 5),
("Ben", "Zorich", 2, 5),
("Gerardo", "Caraveo", 3, NULL),
("Dani", "Rowland", 3, 8),
("Nick", "Krueger", 4, NULL),
("Evan", "Bartels", 4, 10);

SELECT * FROM employees;