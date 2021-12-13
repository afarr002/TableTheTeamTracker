USE emp_db;
INSERT INTO departments (name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Manager", 80000.00, 1),
("Sales Associate", 50000.00, 1),
("Lead Engineer", 150000.00, 2),
("Software Engineer", 120000.00, 2),
("Account Manager", 160000.00, 3),
("Accountant", 125000.00, 3),
("Legal Team Lead", 250000.00, 4),
("Lawyer", 175000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Billy", "Krueger", 1, NULL),
("Carter James", "Kreuger", 2, 1),
("Sammy", "Zorich", 2, 1),
("Cristiano", "Caraveo", 2, 1),
("Nick", "Strong", 3, NULL),
("Aaron", "Farrell", 4, 5),
("Ben", "Zorich", 4, 5),
("Gerardo", "Caraveo", 5, NULL),
("Dani", "Rowland", 6, 8),
("Nick", "Krueger", 7, NULL),
("Evan", "Bartels", 8, 10);
