INSERT INTO department (id, name) 
VALUES  (1, "Human Resources"),
        (2, "Finance"),
        (3, "Engineering"),
        (4, "Sales"),
        (5, "Legal");

INSERT INTO role (id, title, salary, department_id) 
VALUES  (1, "HR Manager", 160000, 1),
        (2, "HR Executive", 90000, 1),
        (3, "Accounts Manager", 165000, 2),
        (4, "Accountant", 85000, 2),
        (5, "Lead Engineer", 150000, 3),
        (6, "Software Engineer", 110000, 3),
        (7, "Sales Manager", 180000, 4),
        (8, "Sales Executive", 80000, 4),
        (9, "Legal Head", 200000, 5),
        (10, "Lawyer", 180000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
VALUES  (1, "James", "Smith", 1, null),
        (2, "David", "Thomas", 2, 1),
        (3, "Mary", "Martha", 3, null),
        (4, "Daniel", "Brown", 4, 3),
        (5, "Joseph", "Carl", 5, null),
        (6, "Maria", "Garcia", 6, 5),
        (7, "Isabella", "Carlos", 7, null),
        (8, "Shiva", "Kumar", 8, 7),
        (9, "Rashmi", "Sharma", 9, null),
        (10, "Juan", "Charles", 10, 9);