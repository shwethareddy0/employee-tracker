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
  await dbConnection();
  const [rows] = await db.execute("SELECT * FROM department");
  //function (err, res) {
  //if (err) {
  //console.log(err);
  //} else {
  console.log("\n");
  const table = cTable.getTable(rows);
  console.log(table);
}
selectDepartments();

async function selectRoles() {
  await dbConnection();
  const [rows] = await db.execute(
    "SELECT role.id, title, name as department, salary FROM role INNER JOIN department ON role.department_id=department.id"
  );
  //function (err, res) {
  //if (err) {
  //console.log(err);
  //} else {
  console.log("\n");
  const table = cTable.getTable(rows);
  console.log(table);
}
selectRoles();

async function selectEmployees() {
  await dbConnection();
  const [rows] = await db.execute(
    `SELECT emp.id,emp.first_name,emp.last_name,title, name as department,salary,CONCAT(mgr.first_name," ",mgr.last_name) as manager FROM employee emp
LEFT JOIN employee mgr ON emp.manager_id= mgr.id
INNER JOIN role ON emp.role_id=role.id 
INNER JOIN department ON role.department_id=department.id`
  );
  //function (err, res) {
  //if (err) {
  // console.log(err);
  //} else {
  console.log("\n");
  const table = cTable.getTable(rows);
  console.log(table);
}
selectEmployees();

async function addDepartment() {
  await dbConnection();
  const [rows] = await db.execute(`SELECT COUNT(*) AS Total FROM department`);
  console.log(rows[0].Total);
}
addDepartment();

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

async function init() {
  do {
    mainSelection = await inquirer.prompt(initialQuestions);
    if (mainSelection.selection == "View All Employees") {
      selectEmployees();
    } else if (mainSelection.selection == "View All Roles") {
      selectRoles();
    } else if (mainSelection.selection == "View All Departments") {
      selectDepartments();
    }
  } while (mainSelection.selection != "Quit");
  db.end();
}
init();
