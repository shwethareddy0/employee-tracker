const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const cTable = require("console.table");

let db = {};

async function dbConnection() {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  });
}
async function selectDepartments() {
  const [rows] = await db.execute("SELECT * FROM department");
  console.log("\n");
  const table = cTable.getTable(rows);
  console.log(table);
}

async function selectRoles() {
  const [rows] = await db.execute(
    "SELECT role.id, title, name as department, salary FROM role INNER JOIN department ON role.department_id=department.id"
  );
  console.log("\n");
  const table = cTable.getTable(rows);
  console.log(table);
}

async function selectEmployees() {
  const [rows] = await db.execute(
    `SELECT emp.id,emp.first_name,emp.last_name,title, name as department,salary,CONCAT(mgr.first_name," ",mgr.last_name) as manager FROM employee emp
LEFT JOIN employee mgr ON emp.manager_id= mgr.id
INNER JOIN role ON emp.role_id=role.id 
INNER JOIN department ON role.department_id=department.id`
  );
  console.log("\n");
  const table = cTable.getTable(rows);
  console.log(table);
}

async function viewTotalBudgetByDepartment() {
  const [rows] =
    await db.execute(`SELECT name AS department, SUM(salary) AS budget
FROM role,department WHERE role.department_id=department.id GROUP BY role.department_id`);
  console.log("\n");
  const table = cTable.getTable(rows);
  console.log(table);
}
async function viewEmployeesByManager() {
  const [rows] =
    await db.execute(`SELECT CONCAT(mgr.first_name,' ',mgr.last_name) AS manager, CONCAT(emp.first_name,' ',emp.last_name) AS employee
  FROM employee emp ,employee mgr WHERE emp.manager_id=mgr.id ORDER BY mgr.id`);
  console.log("\n");
  const table = cTable.getTable(rows);
  console.log(table);
}
async function viewEmployeesByDepartment() {
  const [rows] =
    await db.execute(`SELECT name AS department, CONCAT(first_name,' ',last_name) AS employee
  FROM department,employee,role WHERE employee.role_id=role.id AND role.department_id=department.id ORDER BY department.id`);
  console.log("\n");
  const table = cTable.getTable(rows);
  console.log(table);
}

async function addDepartment() {
  const deptQuestions = [
    {
      type: "input",
      name: "deptName",
      message: "What is the name of the department?",
    },
  ];
  const newDepartmentName = await inquirer.prompt(deptQuestions);
  const [rows] = await db.execute(`SELECT COUNT(*) AS Total FROM department`);
  const totalRows = rows[0].Total;
  await db.execute(
    `INSERT INTO department (id,name) VALUES (${totalRows + 1},"${
      newDepartmentName.deptName
    }")`
  );
  console.log(`Added ${newDepartmentName.deptName} to the database`);
}

async function addRole() {
  const listOfDepartments = await db.execute(`SELECT id,name FROM department`);
  const listOfDepartmentNames = listOfDepartments[0].map((e) => e.name);
  const roleQuestions = [
    {
      type: "input",
      name: "title",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "deptName",
      message: "Which department does the role belong to?",
      choices: listOfDepartmentNames,
    },
  ];

  const newRole = await inquirer.prompt(roleQuestions);
  const [rows] = await db.execute(`SELECT COUNT(*) AS Total FROM role`);
  const totalRows = rows[0].Total;
  const selectedDepartmentId = listOfDepartments[0].find(
    (e) => e.name == newRole.deptName
  ).id;
  await db.execute(
    `INSERT INTO role (id,title,salary,department_id) VALUES (${
      totalRows + 1
    },"${newRole.title}",${newRole.salary},${selectedDepartmentId})`
  );
  console.log(`Added ${newRole.title} to the database`);
}

async function addEmployee() {
  const listOfRoles = await db.execute(`SELECT id,title FROM role`);
  const listOfRoleNames = listOfRoles[0].map((e) => e.title);

  const listOfManagers = await db.execute(
    `SELECT id, first_name, last_name FROM employee`
  );
  const listOfManagerNames = listOfManagers[0].map(
    (e) => `${e.first_name} ${e.last_name}`
  );
  listOfManagerNames.push("None");

  const employeeQuestions = [
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "roleName",
      message: "What is the employee's role?",
      choices: listOfRoleNames,
    },
    {
      type: "list",
      name: "managerName",
      message: "Who is the employee's manager?",
      choices: listOfManagerNames,
    },
  ];

  const newEmployee = await inquirer.prompt(employeeQuestions);
  const [rows] = await db.execute(`SELECT COUNT(*) AS Total FROM employee`);
  const totalRows = rows[0].Total;
  const selectedRoleId = listOfRoles[0].find(
    (e) => e.title == newEmployee.roleName
  ).id;
  const selectedManagerId = listOfManagers[0].find(
    (e) => `${e.first_name} ${e.last_name}` == newEmployee.managerName
  ).id;
  await db.execute(
    `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${
      totalRows + 1
    },"${newEmployee.first_name}","${
      newEmployee.last_name
    }", "${selectedRoleId}", "${selectedManagerId}")`
  );
  console.log(
    `Added ${newEmployee.first_name} ${newEmployee.last_name} to the database`
  );
}

async function updateEmployeeRole() {
  const listOfRoles = await db.execute(`SELECT id,title FROM role`);
  const listOfRoleNames = listOfRoles[0].map((e) => e.title);

  const listOfEmployees = await db.execute(
    `SELECT id, CONCAT(first_name," ",last_name) AS name FROM employee`
  );
  const listOfEmployeeNames = listOfEmployees[0].map((e) => e.name);
  //listOfManagerNames.push("None");

  const updateEmployeeRoleQuestions = [
    {
      type: "list",
      name: "empName",
      message: "Which employee's role do you want to update?",
      choices: listOfEmployeeNames,
    },
    {
      type: "list",
      name: "roleName",
      message: "Which role do you want to assign the selected employee?",
      choices: listOfRoleNames,
    },
  ];

  const newEmployeeRole = await inquirer.prompt(updateEmployeeRoleQuestions);

  const totalRows = listOfEmployeeNames.length;

  const selectedRoleId = listOfRoles[0].find(
    (e) => e.title == newEmployeeRole.roleName
  ).id;
  const selectedEmployeeId = listOfEmployees[0].find(
    (e) => e.name == newEmployeeRole.empName
  ).id;
  await db.execute(
    `UPDATE employee SET role_id=${selectedRoleId} WHERE id=${selectedEmployeeId}`
  );

  console.log(`Updated employees's role`);
}

const initialQuestions = [
  {
    type: "list",
    name: "selection",
    message: "What would you like yo do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "View employees by manager",
      "View employees by department",
      "View the total utilized budget of a department",
      "Quit",
    ],
  },
];

let mainSelection;
async function init() {
  await dbConnection();
  console.log("\n");
  do {
    mainSelection = await inquirer.prompt(initialQuestions);
    if (mainSelection.selection == "View All Employees") {
      await selectEmployees();
    } else if (mainSelection.selection == "View All Roles") {
      await selectRoles();
    } else if (mainSelection.selection == "View All Departments") {
      await selectDepartments();
    } else if (mainSelection.selection == "Add Department") {
      await addDepartment();
    } else if (mainSelection.selection == "Add Role") {
      await addRole();
    } else if (mainSelection.selection == "Add Employee") {
      await addEmployee();
    } else if (mainSelection.selection == "Update Employee Role") {
      await updateEmployeeRole();
    } else if (mainSelection.selection == "View employees by manager") {
      await viewEmployeesByManager();
    } else if (mainSelection.selection == "View employees by department") {
      await viewEmployeesByDepartment();
    } else if (
      mainSelection.selection ==
      "View the total utilized budget of a department"
    ) {
      await viewTotalBudgetByDepartment();
    }
  } while (mainSelection.selection != "Quit");
  db.end();
}

init();
