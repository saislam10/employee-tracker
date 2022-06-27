

INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, department_id, salary)
VALUES ("Sales Lead", 1, 100000),
       ("Sales Person", 1, 80000),
       ("Lead Engineer", 2, 150000),
       ("Software Engineer", 2, 120000),
       ("Account Manager", 3, 160000),
       ("Accountant", 3, 125000),
       ("Legal Team Lead", 4, 250000),
       ("Lawyer", 4, 190000);

INSERT INTO department (first_name, last_name, title, department_id, role_id, manager_id)
VALUES ("John", "Doe", "Sales Lead", 1, 1, NULL),
       ("Mike", "Chan", "Salesperson", 1, 2, 1),
       ("Ashley", "Rodgriguez", "Lead Engineer", 2, 3, NULL),
       ("Kevin", "Tupik", "Software Engineer", 2, 4, 3),
       ("Kunal", "Singh", "Account Manager", 3, 5, NULL),
       ("Malia", "Brown", "Accountant", 3, 6, 5),
       ("Sarah", "Lourd", "Legal Team Lead", 4, 7, NULL),
       ("Tom", "Allen", "Lawyer", 4, 8, 7),
       
       
