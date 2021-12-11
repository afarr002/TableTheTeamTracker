const inquirer = requier("inquirer");
const server = require("./server");

require("console.table");

// upon start, presented with following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

const startMenu = [
  "View All Departments",
  "View All Roles",
  "View All Employees",
  "Add a Department",
  "Add a Role",
  "Add an Employee",
  "Update an Employee",
];

const init = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do:",
      name: "startMenuChoice",
      choices: startMenu,
    })
    .then((userInput) => {
      switch (userInput.startMenuChoice) {
        case "View All Departments":
          server.viewAllDepts;
          break;
        case "View All Roles":
          server.viewAllRoles;
          break;
        case "View All Employees":
          server.viewAllEmps;
          break;
        case "Add a Department":
          server.addDept;
          break;
        case "Add a Role":
          server.addRole;
          break;
        case "Add an Employee":
          server.addEmp;
          break;
        case "Update an Employee Role":
          server.updEmpRole;
          break;
      }
    });
};
