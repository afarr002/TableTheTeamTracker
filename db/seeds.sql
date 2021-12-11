USE emp_db;
INSERT INTO departments (name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Manager", 80000.00, 1), ("Sales Associate", 50000.00, 1), ("Lead Engineer", 150000.00, 2), ("Software Engineer", 120000.00, 2), ("Account Manager", 160000.00, 3), ("Accountant", 125000.00, 3), ("Legal Team Lead", 250000.00, 4), ("Lawyer", 175000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Billy", "Krueger", 1, 1),
("Carter James", "Kreuger", 2, 2),
("Sammy", "Zorich", 2, 3),
("Cristiano", "Caraveo", 2, 4),
("Aaron", "Farrell", 3, 5),
("Nick", "Strong", 4, 6),
("Ben", "Zorich", 4, 7),
("Gerardo", "Caraveo", 5, 8),
("Dani", "Rowland", 6, 9),
("Nick", "Krueger", 7, 10),
("Evan", "Bartels", 8, 11);
