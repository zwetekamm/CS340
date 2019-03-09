-------------------------------------------------
-- Bart Hough and Zachary Wetekamm
-- SQL DMQ - Project Step 3 Draft
-------------------------------------------------
-------------------------------------------------

--|| resorts.html ||
--Table uses SELECT to show existing resorts in the database.
--User interacts with forms to INSERT, UPDATE, and DELETE in the resorts database.

--Query to get all values of the resorts table except id.
--Displayed in table at top of page. Ideally, this will be formatted by the client side.
SELECT name, location, size, price
FROM resorts
ORDER BY name;

--Query to insert a new resort into the database.
--In the "Add Resort" form, user inputs each field; resort_id is updated automatically.
INSERT INTO resorts (name, location, size, price)
VALUES (':name', ':location', ':size', ':price');

--Query to update an exisitng resort in the database.
--In the "Update Resort" form, user selects existing resort by name from the dropdown.
--Ideally, this will perform a check where if input field is blank, that value will be ignored (not changed to empty).

UPDATE resorts
SET name = ':name', location = ':location',  size = ':size', price = ':price'
WHERE name = ':name';

--Query to remove an existing resort in the database.
--In the "Remove Resort" form, user selects an existing resort by name from the dropdown.
DELETE FROM resorts 
WHERE name = ':name';

-------------------------------------------------
--|| lifts.html ||
--Table uses SELECT to show existing lifts in the database.
--User interacts with forms to INSERT, UPDATE, and DELETE in the lifts database.

--Query to get all values of the lifts table except id.
--Displayed in table at top of page. Ideally, this will be formatted by the client side.
--INNER JOIN includes the resort name into the lifts table.
SELECT lifts.name, lifts.capacity, lifts.highspeed, resorts.name
FROM lifts
INNER JOIN resorts ON lifts.resort_id = resorts.id
ORDER BY lifts.name;

--Query to insert a new lift into the database.
--In the "Add Lift" form, user inputs each field; lift_id is updated automatically.
INSERT INTO lifts (name, capacity, highspeed, resort_id)
VALUES (':name', ':capacity', ':highspeed', ':resort');

--Query to update an exisitng lift in the database.
--In the "Update Lift" form, user selects existing lift from the dropdown.
--Ideally, this will perform a check where if input field is blank, that value will be ignored (not changed to empty).
UPDATE lifts
SET name = ':name', capacity = ':capacity', highspeed = ':highspeed', resort_id = ':resort';
WHERE name = ':name';

--Query to remove an existing lift in the database.
--In the "Remove Lift" form, user selects an existing lift from the dropdown.
DELETE FROM lifts 
WHERE name = ':name';

-- || Below are the queries used in the dropdown selectors for each form ||

--Query to select a parent resort and assign to new lift. Used by:
--"Add Lift" - Parent Resort:
--"Update Lift" - Parent Resort:
SELECT name FROM resorts;

--Query to select an existing lift from database. Used by:
--"Update Lift" - Select Lift:
--"Remove Lift" - Select Lift:
SELECT name FROM lifts;


-------------------------------------------------
--|| employees.html ||
--Table uses SELECT to show existing employees in the database.
--User interacts with forms to INSERT, UPDATE and DELETE in the employees database.

--Query to get all values of the employees table except id.
--Displayed in table at top of page. Ideally, this will be formatted by the client side.
SELECT employees.fname, employees.lname, employees.birthday, resorts.name, lifts.name
FROM ((employees
INNER JOIN resorts ON employees.resort_id = resorts.id)
INNER JOIN resorts ON employees.lift_id = lifts.id)
ORDER BY employees.fname;

--Query to insert a new employee into the database.
--In the "Add Employee" form, user inputs each field; employee_id is updated automatically.
INSERT INTO employees (fname, lname, birthday, resort_id, lift_id)
VALUES (':fname', ':lname', ':birthday', ':resort', ':lift');

--Query to update an exisitng employee in the database.
--In the "Update Employee" form, user selects existing employee from the dropdown by first and last name.
--Ideally, this will perform a check where if input field is blank, that value will be ignored (not changed to empty).

UPDATE employees
SET fname = ':fname', lname = ':lname', birthday = ':birthday', resort_id = ':resort', lift_id = ':lift'

--Query to remove an existing employee in the database.
--A user will select an empolyee by first and last name from the dropdown menu.
DELETE FROM employees
WHERE fname = ':fname' AND lname = ':lname';

-- || Below are the queries used in the dropdown selectors for each form ||

--Query to select resort name. Used by:
--"Add Employee" - Select Resort:
--"Update Employee" - Select Resort:
SELECT name FROM resorts;

--Query to select lift name. Used by:
--"Add Employee" - Select Lift:
--"Update Employee" - Select Lift:
SELECT name FROM lifts;

-------------------------------------------------
--|| roles.html ||
--Table uses SELECT to show existing roles in the database.
--User interacts with forms to INSERT, UPDATE, and DELETE in the roles database.

--Query to get all values of the roles table except id.
--Displayed in table at top of page. Ideally, this will be formatted by the client side.
SELECT title 
FROM roles
ORDER BY title;

--Query to insert a new role into the database.
--In the "Add Role" form, user inputs each field; role_id is updated automatically.
INSERT INTO roles (title)
VALUES (':title');

--Query to update an exisitng role in the database.
--In the "Update Role" form, user selects existing role from the dropdown.
--Ideally, this will perform a check where if input field is blank, that value will be ignored (not changed to empty).
UPDATE roles
SET title = ':title'
WHERE title = ':title';

--Query to remove an existing role in the database.
--In the "Remove Role" form, user selects an existing role from the dropdown.
DELETE FROM roles 
WHERE title = ':title';

-- || Below are the queries used in the dropdown selectors for each form ||

--Query to select existing role in the database. Used by:
--"Update Role" - Select Role:
--"Remove Role" - Select Role:
SELECT title FROM role;

-------------------------------------------------
--|| schedule.html ||
--Table uses SELECT to show existing schedule in the database.
--User interacts with forms to INSERT, UPDATE, and DELETE in the schedule database.

--Query to get all values of the schedule. Entity id is displayed specifically for use in UPDATE and DELETE.
--Displayed in table at top of page. Ideally, this will be formatted by the client side.
--The INNER JOINs allow inclusion of employee lname employee fname, role title, and lift name.
--Ordered by date DESC for accessibility, so the most recent dates are displayed first (but can be duplicate values).
SELECT schedule.date, schedule.id, employees.fname, employees.lname, roles.title, lifts.name
FROM (((schedule
INNER JOIN employees ON schedule.employee_id = employees.id)
INNER JOIN roles ON schedule.role_id = roles.id)
INNER JOIN lifts ON schedule.lift_id = lifts.id)
ORDER BY schedule.date DESC;

SELECT schedule.date, schedule.id, employees.fname, employees.lname, roles.title, lifts.name
FROM (((schedule
LEFT JOIN employees ON schedule.employee_id = employees.id)
LEFT JOIN roles ON schedule.role_id = roles.id)
LEFT JOIN lifts ON schedule.lift_id = lifts.id)
ORDER BY schedule.date DESC;



--Query to insert a new schedule assignment into the database.
--In the "Add Schedule" form, user selects each field; id is updated automatically.
INSERT INTO schedule (employee_id, role_id, lift_id date)
VALUES (':employee', ':role', ':lift', ':date');

--Query to update an exisitng schedule assignment in the database.
--In the "Update Schedule" form, user selects existing schedule assignment from the dropdown.
--Ideally, this will perform a check where if input field is blank, that value will be ignored (not changed to empty).
UPDATE schedule
SET employee_id = ':employee', role_id = ':role', lift_id = ':lift', date = ':date';
WHERE id = ':id';

--Query to remove an existing assignment in the database.
--In the "Remove Schedule" form, user selects an existing assignment from the dropdown.
DELETE FROM schedule
WHERE id = ':id';

-- || Below are the queries used in the dropdown selectors for each form ||

--Query to select employee fname and lname. Used by:
--"Add Schedule" - Select Employee:
--"Update Schedule" - Select Employee:
SELECT fname, lname FROM employees ORDER BY fname;

--Query to select role title. Used by:
--"Add Daily Assignment" - Select Role:
--"Update Daily Assignment" - Select Role:
SELECT title FROM roles;

--Query to select lift name. Used by:
--"Add Daily Assignment" - Select Lift:
--"Update Daily Assignment" - Select Lift:
SELECT name FROM lifts;

--Query to select schedule id. Used by:
--"Update Schedule" - Select Id:
--"Remove Schedule" - Select Id:
SELECT id FROM schedule;

--Query to select resort name. Used by:
--"Add Employee" - Select Employee:
--"Update Employee" - Select Employee:
SELECT name FROM resorts;
