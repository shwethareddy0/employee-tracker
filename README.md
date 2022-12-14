# Employee Tracker

## Description

Employee Tracker is a command-line application that manages employees database using Node.js, Inquirer and MySQL.

This application uses the MySQL2 package to connect to the MySQL database and perform queries, the Inquirer package to interact with the user via the command line, and the console.table package to print MySQL rows to the console.

Here is a walkthrough [video](https://drive.google.com/file/d/1wfGhfiuCLSTRUJlbZK6WPWktvV8ZWUKZ/view) demonstrating the functionality of the application.

### Features

- Easy to modify
- Provides choices to view and add more employees,roles, managers and departments and also updates roles.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Credits](#credits)
- [License](#license)

## Installation

- Create a new repository on your GitHub account.
- Clone this repository.
- Run `npm i`
- Run `node server.js`

## Usage

This project can be used in any command-line.

Following is a code snippet of the application page.

Here it refers to the async function with a do while loop. It prompts questions to the user to select an option to view,add or update the database in a loop until the user opts to quit and awaits for the response. It creates a employee database object with the given input.

```Node.js

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

```

## Technologies Used

- Node.js
- Inquirer package
- MySQL2
- Console.Table
- Git
- GitHub

## Credits

- npmjs.com
- MDN / W3Schools

## License

This project is licensed under the [MIT](./LICENSE) license.
