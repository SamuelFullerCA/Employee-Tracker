INSERT INTO department (name)
VALUES ('Sales'), ('Supervisor'), ('Warehouse'), ('Admin');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Associate', 300000, 001),
    ('General Manager', 200000, 004),
    ('Front End Checkout', 30000, 001),
    ('Operations Manager', 85000, 004),
    ('Product Flow', 30000, 003),
    ('SWAT', 35000, 003),
    ('Shift Lead', 40000, 002),
    ('Keyholder', 35000, 002),
    ('Seasonal Sales', 10000, 001),
    ('Season WH', 10000, 003),
    ('Sales Manager', 85000, 004);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Samuel', 'Fuller', 007, 004),
    ('Ricky', 'Meldina', 002, 002),
    ('Luis', 'Tuttle', 007, 004),
    ('Paul', 'Tenson', 004, 002),
    ('Richard', 'smith', 011, 002),
    ('Tim', 'Dic', 006, 004),
    ('Carissa', 'Nonne', 005, 005),
    ('Isaiah', 'Bonele', 008, 004),
    ('Chris', 'Benet', 010, 004),
    ('Leo', 'panz', 009, 004),
    ('Rofit', 'Ramaswuamy', 001, 005),
    ('Justin', 'Time', 001, 005),
    ('Pier', 'Gordo', 005, 004);





