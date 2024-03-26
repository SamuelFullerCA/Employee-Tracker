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
    ('Season WH', 10000, 003);

INSERT INTO employee (first_name, last_name, role_id)
VALUES 
    ('Samuel', 'Fuller', 007),
    ('Ricky', 'Meldina', 002),
    ('Luis', 'Tuttle', 007),
    ('Paul', 'Tenson', 004),
    ('Richard', 'smith', 004),
    ('Tim', 'Dic', 006),
    ('Carissa', 'Nonne', 003),
    ('Isaiah', 'Bonele', 008),
    ('Chris', 'Benet', 010),
    ('Leo', 'panz', 009),
    ('Rofit', 'Ramaswuamy', 001),
    ('Justin', 'Time', 001),
    ('Pier', 'Gordo', 005);




