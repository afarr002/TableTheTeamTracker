const inquirer = require("inquirer");
const mysql = require("mysql2");
const figlet = require("figlet");
require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "emp_db",
});

const startMenuQ = [
  "View All Departments",
  "View All Roles",
  "View All Staff",
  "Add a Department",
  "Add a Role",
  "Add an Employee",
  "Update an Employee's Role",
  "Update an Employee's Manager",
  "View All Staff by Manager",
  /* "View Specific Manager's Employees",
  "View Specific Department's Employees", */
  "View Staff by Department",
  "Delete Department",
  "Delete Role",
  "Delete Employee",
  /* "View Department's Budgets", */
  "Quit",
];

const init = () => {
  console.clear();
  largeLogo("Table the Team Tracker");

  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do:",
      name: "startMenuChoice",
      choices: startMenuQ,
    })
    .then((startMenuA) => {
      switch (startMenuA.startMenuChoice) {
        case "View All Departments":
          viewAllDepts();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Staff":
          viewAllEmps();
          break;
        case "Add a Department":
          addDept();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmp();
          break;
        case "Update an Employee's Role":
          updEmpRole();
          break;
        case "Update an Employee's Manager":
          updEmpMgr();
          break;
        case "View Staff by Manager":
          viewEmpByMgr();
          break;
        /* case "View Specific Manager's Employees":
          viewMgrsEmps();
          break;
        case "View Specific Department's Employees":
          viewDeptsEmps();
          break; */
        case "View Staff by Department":
          viewEmpByDept();
          break;
        case "Delete Department":
          dltDept();
          break;
        case "Delete Role":
          dltRole();
          break;
        case "Delete Employee":
          dltEmp();
          break;
        /* case "View Department's Budgets":
          viewDeptBdgt();
          break; */
        case "Quit":
          console.clear();
          smallLogo("See you later!");
          connection.end();
          break;
        default:
          console.log("Enter a valid answer");
          init();
          break;
      }
    });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`Now connected as ID ${connection.threadId}!`);
  init();
});

const viewAllDepts = () => {
  console.clear();
  smallLogo("Departments:");
  // presented with a formatted table showing department names and department ids
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table("All Departments:", res);
    terminate();
  });
};

const viewAllRoles = () => {
  console.clear();
  smallLogo("Roles:");
  // presented with the job title, role id, the department that role belongs to, and the salary for that role
  connection.query(
    `SELECT
      roles.id,
      roles.title,
      departments.name AS departments,
      roles.salary
    FROM roles 
      LEFT JOIN departments on roles.department_id = departments.id
    ORDER BY
      department_id`,
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("All Roles:", res);
      terminate();
    }
  );
};

const viewAllEmps = () => {
  console.clear();
  smallLogo("Staff:");
  // presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
  connection.query(
    `SELECT 
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.name AS departments,
      roles.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM
      employees
        LEFT JOIN roles on employees.role_id = roles.id 
        LEFT JOIN departments on roles.department_id = departments.id 
        LEFT JOIN employees manager on manager.id = employees.manager_id
    ORDER BY
      employees.role_id`,
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Total Staff:", res);
      terminate();
    }
  );
};

const addDeptQ = [
  {
    type: "input",
    message: "Enter new department:",
    name: "addDept",
  },
];

const addDept = () => {
  console.clear();
  smallLogo("Add Department");
  // prompted to enter the name of the department and that department is added to the database
  inquirer.prompt(addDeptQ).then((addDeptA) => {
    connection.query("INSERT INTO departments SET ?", {
      name: addDeptA.addDept,
    });
    connection.query("SELECT * FROM departments", (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Updated Departments:", res);
      terminate();
    });
  });
};

const addRoleQ = [
  {
    type: "input",
    message: "Enter the title of the new role to be added:",
    name: "addRoleTitle",
  },
  {
    type: "input",
    message: "Enter the salary for the new role:",
    name: "addRoleSalary",
  },
  {
    type: "input",
    message: "Enter the Department ID for the new role:",
    name: "addRoleDeptID",
  },
];

const addRole = () => {
  console.clear();
  smallLogo("Add Role");
  // prompted to enter the name, salary, and department for the role and that role is added to the database
  inquirer.prompt(addRoleQ).then((addRoleA) => {
    connection.query("INSERT INTO roles SET ?", {
      title: addRoleA.addRoleTitle,
      salary: addRoleA.addRoleSalary,
      department_id: addRoleA.addRoleDeptID,
    });
    connection.query(
      `SELECT
      roles.id,
      roles.title,
      departments.name AS departments,
      roles.salary
    FROM roles 
      LEFT JOIN departments on roles.department_id = departments.id
    ORDER BY
      department_id`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table("Updated Roles:", res);
        terminate();
      }
    );
  });
};

const addEmpQ = [
  {
    type: "input",
    message: "Enter your new employee's first name",
    name: "firstName",
  },
  {
    type: "input",
    message: "Enter your new employee's last name:",
    name: "lastName",
  },
  {
    type: "input",
    message: "Enter the Id for your employee's new role:",
    name: "empRoleID",
  },
  {
    type: "input",
    message: "Enter the ID for your employee's new manager:",
    name: "empMgrID",
  },
];

const addEmp = () => {
  console.clear();
  smallLogo("Add Employee");

  // prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
  inquirer.prompt(addEmpQ).then((addEmpA) => {
    connection.query("INSERT INTO employees SET ?", {
      first_name: addEmpA.firstName,
      last_name: addEmpA.lastName,
      role_id: addEmpA.empRoleID,
      manager_id: addEmpA.empMgrID === "" ? null : addEmpA.empMgrID,
    });
    connection.query(
      `SELECT 
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.name AS departments,
      roles.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM
      employees
        LEFT JOIN roles on employees.role_id = roles.id 
        LEFT JOIN departments on roles.department_id = departments.id 
        LEFT JOIN employees manager on manager.id = employees.manager_id
    ORDER BY
      employees.role_id`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table("Updated Staff List:", res);
        terminate();
      }
    );
  });
};

const updEmpRoleQ = [
  {
    type: "input",
    message:
      "Enter the last name of the employee who's role you need to update:",
    name: "updRoleName",
  },
  {
    type: "input",
    message: "Enter the ID for your employee's new role:",
    name: "updRoleID",
  },
];

const updEmpRole = () => {
  console.clear();
  smallLogo("Update Employee Role");
  // prompted to select an employee to update and their new role and this information is updated in the database
  inquirer.prompt(updEmpRoleQ).then((updEmpRoleA) => {
    connection.query("UPDATE employees SET role_id = ? WHERE last_name = ?", [
      updEmpRoleA.updRoleID,
      updEmpRoleA.updRoleName,
    ]);
    connection.query(
      `SELECT 
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.name AS departments,
      roles.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM
      employees
        LEFT JOIN roles on employees.role_id = roles.id 
        LEFT JOIN departments on roles.department_id = departments.id 
        LEFT JOIN employees manager on manager.id = employees.manager_id
    ORDER BY
      employees.role_id`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table("Updated Staff List:", res);
        terminate();
      }
    );
  });
};

const updEmpMgrQ = [
  {
    type: "input",
    message:
      "Enter the last name of the employee who's manager you need to update:",
    name: "updMgrLastName",
  },
  {
    type: "input",
    message:
      "Enter the first name of the employee who's manager you need to update:",
    name: "updMgrFirstName",
  },
  {
    type: "input",
    message: "Enter the ID for your employee's new manager (99 if Null):",
    name: "updMgrID",
  },
];

const updEmpMgr = () => {
  console.clear();
  smallLogo("Update Employee's Manager");
  inquirer.prompt(updEmpMgrQ).then((updEmpMgrA) => {
    connection.query(
      "UPDATE employees SET manager_id = ? WHERE last_name = ? AND first_name = ?",
      [
        updEmpMgrA.updMgrID >= 99 ? null : updEmpMgrA.updMgrID,
        updEmpMgrA.updMgrLastName,
        updEmpMgrA.updMgrFirstName,
      ]
    );
    connection.query(
      `SELECT 
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.name AS departments,
      roles.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM
      employees
        LEFT JOIN roles on employees.role_id = roles.id 
        LEFT JOIN departments on roles.department_id = departments.id 
        LEFT JOIN employees manager on manager.id = employees.manager_id
    ORDER BY
      employees.manager_id`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table("Updated Staff List:", res);
        terminate();
      }
    );
  });
};

const viewEmpByMgr = () => {
  console.clear();
  smallLogo("Staff by Manager:");
  connection.query(
    `SELECT 
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.name AS departments,
      roles.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM
      employees
        LEFT JOIN roles on employees.role_id = roles.id 
        LEFT JOIN departments on roles.department_id = departments.id 
        LEFT JOIN employees manager on manager.id = employees.manager_id
    ORDER BY
      employees.manager_id`,
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table(res);
      terminate();
    }
  );
};

const viewEmpByDept = () => {
  console.clear();
  smallLogo("Staff by Department:");
  connection.query(
    `SELECT 
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.name AS departments,
      roles.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM
      employees
        LEFT JOIN roles on employees.role_id = roles.id 
        LEFT JOIN departments on roles.department_id = departments.id 
        LEFT JOIN employees manager on manager.id = employees.manager_id
    ORDER BY
      departments.id`,
    (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Total Staff by Department:", res);
      terminate();
    }
  );
};

const dltDeptQ = [
  {
    type: "input",
    message: "Enter department to delete:",
    name: "dltDept",
  },
];

const dltDept = () => {
  console.clear();
  smallLogo("Delete Department");
  inquirer.prompt(dltDeptQ).then((dltDeptA) => {
    connection.query("DELETE FROM departments WHERE ?", {
      name: dltDeptA.dltDept,
    });
    connection.query("SELECT * FROM departments", (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Updated Departments:", res);
      terminate();
    });
  });
};

const dltRoleQ = [
  {
    type: "input",
    message: "Enter role to delete:",
    name: "dltRole",
  },
];

const dltRole = () => {
  console.clear();
  smallLogo("Delete Roll");
  inquirer.prompt(dltRoleQ).then((dltRoleA) => {
    connection.query("DELETE FROM roles WHERE ?", {
      title: dltRoleA.dltRole,
    });
    connection.query(
      `SELECT * FROM roles ORDER BY department_id`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table("Updated Roles:", res);
        terminate();
      }
    );
  });
};

const dltEmpQ = [
  {
    type: "input",
    message: "Enter employee's first name to delete:",
    name: "dltEmpFirstName",
  },
  {
    type: "input",
    message: "Enter employee's last name to delete:",
    name: "dltEmpLastName",
  },
];

const dltEmp = () => {
  console.clear();
  smallLogo("Delete Employee");
  inquirer.prompt(dltEmpQ).then((dltEmpA) => {
    connection.query(
      "DELETE FROM employees WHERE first_name = ? AND last_name = ?",
      [dltEmpA.dltEmpFirstName, dltEmpA.dltEmpLastName]
    );
    connection.query(
      `SELECT 
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.name AS departments,
      roles.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM
      employees
        LEFT JOIN roles on employees.role_id = roles.id 
        LEFT JOIN departments on roles.department_id = departments.id 
        LEFT JOIN employees manager on manager.id = employees.manager_id
    ORDER BY
      employees.role_id`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table("Updated Staff List:", res);
        terminate();
      }
    );
  });
};

/*

const viewDeptBdgtQ = [
  {
    type: "input",
    message: "Enter department ID whos budget you would like to see:",
    name: "viewDeptBdgt",
  },
];

const viewDeptBdgt = () => {
  console.clear();
  smallLogo("Department Budgets");
  inquirer.prompt(viewDeptBdgtQ).then((viewDeptBdgtA) => {
    connection.query(
      `SELECT
        roles.salary AS budget
      FROM
        roles
      WHERE
          department_id = ?`,
      viewDeptBdgtA.viewDeptBdgt
    );
    connection.query(
      `SELECT 
      employees.id,
      employees.first_name,
      employees.last_name,
      roles.title,
      departments.name AS departments,
      roles.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM
      employees
        LEFT JOIN roles on employees.role_id = roles.id 
        LEFT JOIN departments on roles.department_id = departments.id 
        LEFT JOIN employees manager on manager.id = employees.manager_id
    ORDER BY
      employees.role_id`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table("Updated Staff List:", res);
        terminate();
      }
    );
  });
};

*/

const terminateQ = [
  {
    type: "confirm",
    message: "Return to main menu?",
    name: "temrinate",
  },
];

const terminate = () => {
  inquirer.prompt(terminateQ).then((temrinateA) => {
    if (temrinateA.terminate === true) {
      init();
    } else {
      console.clear();
      smallLogo("See you next time!");
      connection.end();
    }
  });
};

const largeLogo = (string) => {
  console.log(
    figlet.textSync(string, {
      font: "Ghost",
      horizontalLayout: "controlled smushing",
      verticalLayout: "default",
    })
  );
};

const smallLogo = (string) => {
  console.log(
    figlet.textSync(string, {
      font: "Ghost",
      horizontalLayout: "controlled smushing",
      verticalLayout: "default",
    })
  );
};
