const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "emp_db",
});

const viewAllDepts = () => {
  // presented with a foramtted table showing department names and department ids
};

const viewAllRoles = () => {
  // presented with the job title, role id, the department that role belongs to, and the salary for that role
};

const viewAllEmps = () => {
  // presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
};

const addDept = () => {
  // prompted to enter the name of the department and that department is added to the database
};

const addRole = () => {
  // prompted to enter the name, salary, and department for the role and that role is added to the database
};

const addEmp = () => {
  // prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
};

const updEmpRole = () => {
  // prompted to select an employee to update and their new role and this information is updated in the database
};

module.exports = {
  viewAllDepts,
  viewAllRoles,
  viewAllEmps,
  addDept,
  addRole,
  addEmp,
  updEmpRole,
};
