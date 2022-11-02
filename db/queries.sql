//View the total utilized budget of a department
SELECT name, SUM(salary) AS budget
FROM role,department WHERE role.department_id=department.id GROUP BY role.department_id;

//View employees by manager
SELECT CONCAT(mgr.first_name,' ',mgr.last_name) AS manager, CONCAT(emp.first_name,' ',emp.last_name) AS employee
  FROM employee emp ,employee mgr WHERE emp.manager_id=mgr.id ORDER BY mgr.id;
//View employees by dept
SELECT name, CONCAT(first_name,' ',last_name) AS employee
  FROM department,employee,role WHERE employee.role_id=role.id AND role.department_id=department.id ORDER BY department.id;