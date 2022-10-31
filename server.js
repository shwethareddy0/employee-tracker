const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employee_db",
});

function selectDepartments() {
  db.query("SELECT * FROM department", function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log("\n");
      const table = cTable.getTable(res);
      console.log(table);
    }
  });
}

selectDepartments();

function selectRoles() {
  db.query(
    "SELECT role.id, title, name as department, salary FROM role INNER JOIN department ON role.department_id=department.id",
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log("\n");
        const table = cTable.getTable(res);
        console.log(table);
      }
    }
  );
}

selectRoles();

function selectEmployees() {
  db.query(
    `SELECT emp.id,emp.first_name,emp.last_name,title, name as department,salary,CONCAT(mgr.first_name," ",mgr.last_name) as manager FROM employee emp
LEFT JOIN employee mgr ON emp.manager_id= mgr.id
INNER JOIN role ON emp.role_id=role.id 
INNER JOIN department ON role.department_id=department.id`,
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log("\n");
        const table = cTable.getTable(res);
        console.log(table);
      }
    }
  );
}

selectEmployees();
