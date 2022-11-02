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
  console.log("rows.length", rows.length);
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

async function addDepartment() {
  await dbConnection();
  const [rows] = await db.execute(`SELECT COUNT(*) AS Total FROM department`);
  console.log(rows[0].Total);
}

//addDepartment();

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
      "Quit",
    ],
  },
];

let mainSelection;
async function init() {
  await dbConnection();
  console / log("\n");
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
    }
  } while (mainSelection.selection != "Quit");
  db.end();
}

init();
