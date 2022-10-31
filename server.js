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
