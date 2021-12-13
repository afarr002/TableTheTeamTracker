const inquirer = require("inquirer");
const mysql = require("mysql2");
const figlet = require("figlet");
require("console.table");

const db = mysql.createConnection({
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
  "View All Staff by Department",
  "Delete Role",
  "Delete Department",
  "Delete Employee",
  // View Department's Budgets",
  "Quit",
];

const init = () => {
  console.clear();
  logo("Team Tracker");

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
        case "View All Staff by Manager":
          viewEmpByMgr();
          break;
        /* case "View Specific Manager's Employees":
          viewMgrsEmps();
          break;
        case "View Specific Department's Employees":
          viewDeptsEmps();
          break; */
        case "Delete Department":
          dltDept();
          break;
        case "View All Staff by Department":
          viewEmpByDept();
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
          logo("See you later!");
          db.end();
          break;
        default:
          console.log("Enter a valid answer");
          init();
          break;
      }
    });
};

db.connect((err) => {
  if (err) throw err;
  init();
});

const viewAllDepts = () => {
  console.clear();
  logo("Departments:");
  // presented with a formatted table showing department names and department ids
  db.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table("Departments:", res);
    terminate();
  });
};

const viewAllRoles = () => {
  console.clear();
  logo("Roles:");
  // presented with the job title, role id, the department that role belongs to, and the salary for that role
  db.query(
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
      console.table("Roles:", res);
      terminate();
    }
  );
};

const viewAllEmps = () => {
  console.clear();
  logo("Staff:");
  // presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
  db.query(
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
  logo("Department+");
  // prompted to enter the name of the department and that department is added to the database
  inquirer.prompt(addDeptQ).then((addDeptA) => {
    db.query("INSERT INTO departments SET ?", {
      name: addDeptA.addDept,
    });
    db.query("SELECT * FROM departments", (err, res) => {
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
  logo("Role+");
  // prompted to enter the name, salary, and department for the role and that role is added to the database
  inquirer.prompt(addRoleQ).then((addRoleA) => {
    db.query("INSERT INTO roles SET ?", {
      title: addRoleA.addRoleTitle,
      salary: addRoleA.addRoleSalary,
      department_id: addRoleA.addRoleDeptID,
    });
    db.query(
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
  logo("Employee+");

  // prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
  inquirer.prompt(addEmpQ).then((addEmpA) => {
    db.query("INSERT INTO employees SET ?", {
      first_name: addEmpA.firstName,
      last_name: addEmpA.lastName,
      role_id: addEmpA.empRoleID,
      manager_id: addEmpA.empMgrID === "" ? null : addEmpA.empMgrID,
    });
    db.query(
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
        console.table("Updated Staff:", res);
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
    name: "updRoleLastName",
  },
  {
    type: "input",
    message:
      "Enter the first name of the employee who's role you need to update:",
    name: "updRoleFirstName",
  },
  {
    type: "input",
    message: "Enter the ID for your employee's new role:",
    name: "updRoleID",
  },
];

const updEmpRole = () => {
  console.clear();
  logo("Role<==>");
  // prompted to select an employee to update and their new role and this information is updated in the database
  inquirer.prompt(updEmpRoleQ).then((updEmpRoleA) => {
    db.query(
      "UPDATE employees SET role_id = ? WHERE last_name = ? AND first_name = ?",
      [
        updEmpRoleA.updRoleID,
        updEmpRoleA.updRoleLastName,
        updEmpRoleA.updRoleFirstName,
      ]
    );
    db.query(
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
  logo("Manager<==>");
  inquirer.prompt(updEmpMgrQ).then((updEmpMgrA) => {
    db.query(
      "UPDATE employees SET manager_id = ? WHERE last_name = ? AND first_name = ?",
      [
        updEmpMgrA.updMgrID >= 99 ? null : updEmpMgrA.updMgrID,
        updEmpMgrA.updMgrLastName,
        updEmpMgrA.updMgrFirstName,
      ]
    );
    db.query(
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

/*

const viewMgrsEmpsQ = [
  {
    type: "input",
    message:
      "Enter the first name of the manager who's employees you need to see:",
    name: "viewMgrsEmpsFirstName",
  },
  {
    type: "input",
    message:
      "Enter the last name of the manager who's employees you need to see:",
    name: "viewMgrsEmpsLastName",
  },
];

const viewMgrsEmps = () => {
  console.clear();
  logo("Managers:");
  inquirer.prompt(viewMgrsEmpsQ).then((viewMgrsEmpsA) => {
    db.query(
      `SELECT 
        employees.id,
        employees.first_name,
        employees.last_name,
        roles.title,
        departments.name AS departments,
        roles.salary,
      FROM
        employees
          LEFT JOIN roles on employees.role_id = roles.id 
          LEFT JOIN departments on roles.department_id = departments.id
      WHERE
        employees.manager_id = NULL AND employees.first_name = ? AND employees.last_name = ?`,
      viewMgrsEmpsA.viewMgrsEmpsFirstName,
      viewMgrsEmpsA.viewMgrsEmpsLastName,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table("Total Staff:", res);
        terminate();
      }
    );
  });
};

*/

/* 

const viewDeptsEmpsQ = [
  {
    type: "input",
    message: "Enter department ID whos staff you want to view:",
    name: "viewDeptsEmpsID",
  },
];

const viewDeptsEmps = () => {
  console.clear();
  logo("Staff by Department");

  inquirer.prompt(viewDeptsEmpsQ).then((viewDeptsEmpsA) => {
    db.query(
      `SELECT
        employees.first_name,
        employees.last_name,
        roles.title,
        departments.name AS departments,
        roles.salary,
      FROM
        employees,
        roles
      WHERE
        roles.department_id = ?`,
      viewDeptsEmpsA.viewDeptsEmpsID,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        terminate();
      }
    );
  });
};

*/

const viewEmpByMgr = () => {
  console.clear();
  logo("Manager:");
  db.query(
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
      console.table("Staff by Manager:", res);
      terminate();
    }
  );
};

const viewEmpByDept = () => {
  console.clear();
  logo("Department:");
  db.query(
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
      console.table("Staff by Department:", res);
      terminate();
    }
  );
};

const dltDeptQ = [
  {
    type: "input",
    message:
      "Enter department to delete: (Cannot delete department that has a roll assigned to it)",
    name: "dltDept",
  },
];

const dltDept = () => {
  console.clear();
  logo("Delete Dept");
  inquirer.prompt(dltDeptQ).then((dltDeptA) => {
    db.query("DELETE FROM departments WHERE ?", {
      name: dltDeptA.dltDept,
    });
    db.query("SELECT * FROM departments", (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Departments:", res);
      terminate();
    });
  });
};

const dltRoleQ = [
  {
    type: "input",
    message:
      "Enter role to delete: (Cannot delete role that has an employee assigned to it)",
    name: "dltRole",
  },
];

const dltRole = () => {
  console.clear();
  logo("Roll-");
  inquirer.prompt(dltRoleQ).then((dltRoleA) => {
    db.query("DELETE FROM roles WHERE ?", {
      title: dltRoleA.dltRole,
    });
    db.query(`SELECT * FROM roles ORDER BY department_id`, (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Updated Roles:", res);
      terminate();
    });
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
  logo("Employee-");
  inquirer.prompt(dltEmpQ).then((dltEmpA) => {
    db.query("DELETE FROM employees WHERE first_name = ? AND last_name = ?", [
      dltEmpA.dltEmpFirstName,
      dltEmpA.dltEmpLastName,
    ]);
    db.query(
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

const terminateQ = [
  {
    type: "confirm",
    message: "Return to main menu?",
    name: "terminate",
  },
];

const terminate = () => {
  inquirer.prompt(terminateQ).then((temrinateA) => {
    if (temrinateA.terminate === true) {
      init();
    } else {
      console.clear();
      logo("Bye!!");
      db.end();
    }
  });
};

const logo = (string) => {
  console.log(
    figlet.textSync(string, {
      font: "Ghost",
      horizontalLayout: "fitted",
      verticalLayout: "controlled smushing",
    })
  );
};
