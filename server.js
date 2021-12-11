const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "emp_db",
});

const startMenu = [
  "View All Departments",
  "View All Roles",
  "View All Staff",
  "Add a Department",
  "Add a Role",
  "Add an Employee",
  "Update an Employee's Role",
  "Update an Employee's Manager",
  "View All Staff by Manager",
  /* "View Specific Manager's Employees", */
  "View Staff by Department",
  "Delete Department",
  "Delete Role",
  "Delete Employee",
  /* "View Department's Budgets", */
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
      }
    });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`Now connected as ID ${connection.threadId}!`);
  init();
});

const viewAllDepts = () => {
  // presented with a formatted table showing department names and department ids
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table("All Departments:", res);
    init();
  });
};

const viewAllRoles = () => {
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
      init();
    }
  );
};

const viewAllEmps = () => {
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
      init();
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
  // prompted to enter the name of the department and that department is added to the database
  inquirer.prompt(addDeptQ).then((addDeptA) => {
    connection.query("INSERT INTO departments SET ?", {
      name: addDeptA.addDept,
    });
    connection.query("SELECT * FROM departments", (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Updated Departments:", res);
      init();
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
        init();
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
        init();
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
        init();
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
        init();
      }
    );
  });
};

const viewEmpByMgr = () => {
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
      console.table("Total Staff by Manager:", res);
      init();
    }
  );
};

/*
const viewMgrsEmpsQ = [
  {
    type: "input",
    message:
      "Enter the last name of the manager who's employees you need to see:",
    name: "viewMgrsEmpsLastName",
  },
  {
    type: "input",
    message:
      "Enter the first name of the manager who's employees you need to see:",
    name: "viewMgrsEmpsFirstName",
  },
];

const viewMgrsEmps = () => {
  inquirer.prompt(viewMgrsEmpsQ).then((viewMgrsEmpsA) => {
    connection.query(
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
        LEFT JOIN employees manager on manager.id = employees.manager_id
    WHERE
      employees.manager_id = NULL AND employees.last_name = ? AND employees.first_name = ?`,
      [viewMgrsEmpsA.viewMgrsEmpsLastName, viewMgrsEmpsA.viewMgrsEmpsFirstName],
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table("Total Staff by Manager:", res);
        init();
      }
    );
  });
};
*/

const viewEmpByDept = () => {
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
      init();
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
  inquirer.prompt(dltDeptQ).then((dltDeptA) => {
    connection.query("DELETE FROM departments WHERE ?", {
      name: dltDeptA.dltDept,
    });
    connection.query("SELECT * FROM departments", (err, res) => {
      if (err) throw err;
      console.log("\n");
      console.table("Updated Departments:", res);
      init();
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
        init();
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
        init();
      }
    );
  });
};

/*

const viewDeptBdgt = () => {

}

*/
