const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: "employees_db",
});

db.connect(function (err) {
  if (err) throw err;
  init();
});

const allEmployees = () => {
  db.query('SELECT * FROM employee', function (err, results) {
    if (err) return console.error(err);
    console.table(results);
    init();
  });
}

const allRoles = () => {
  db.query('SELECT * FROM role', function (err, results) {
    if (err) return console.error(err);
    console.table(results);
    init();
  });
}

const allDepartments = () => {
  db.query('SELECT * FROM department', function (err, results) {
    if (err) return console.error(err);
    console.table(results);
    init();
  });
}

const addEmployee = () => {
  inquirer.prompt(
    {
      type: 'input',
      name: 'employeeFirstName',
      message: 'What is the first name of the employee you would like to add?'
    },
    {
      type: 'input',
      name: 'employeeLastName',
      message: 'What is the last name of the employee?'
    },
    {
      type: 'input',
      name: 'employeeRoleId',
      message: 'What is the role id of the employee?'
    },
    {
      type: 'input',
      name: 'employeeManagerId',
      message: 'What is the manager id of the employee?'
    }
  ).then(function (answer) {
    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [answer.employeeFirstName, answer.employeeLastName, answer.employeeRoleId, answer.employeeManagerId], function (err, res) {
      if (err) throw err;
      console.log(res)
      init();
    });
  });
}
const addRole = () => {
  inquirer.prompt(
    {
      type: 'input',
      name: 'roleName',
      message: 'What is the role you would like to add?'
    },
    {
      type: 'input',
      name: 'roleDeptId',
      message: 'What is the department id?'
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: 'What is the salary of the role?'
    }
  ).then(function (answer) {
    db.query('INSERT INTO role (title, department_id, salary) VALUES (?,?,?)', [answer.roleName, answer.roleSalary, roleDeptId], function (err, res) {
      if (err) throw err;
      console.log(res)
      init();
    });
  });
}

const addDept = () => {
  inquirer.prompt({
    type: 'input',
    name: 'departmentName',
    message: 'What is the name of the department you would like to add?'
  }).then(function (answer) {
    db.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName], function (err, res) {
      if (err) throw err;
      console.log(res)
      init();
    });
  });
}

const updateRole = () => {
  inquirer.prompt({
    type: 'input',
    name: 'updateRole',
    message: 'What is the id of the role you would like to update the employee to?'
  }).then(function (answer) {
    db.query('INSERT INTO role (department_id) VALUES (?)', [answer.updateRole], function (err, res) {
      if (err) throw err;
      console.log(res)
      init();
    });
  });
}


const init = () => {
  const choices = [
    { name: 'View All Employees', value: { allEmployees } },
    { name: 'Add Employee', value: { addEmployee }, },
    { name: 'Update Employee Role', value: { updateRole } },
    { name: 'View All Roles', value: { allRoles } },
    { name: 'Add Role', value: { addRole } },
    { name: 'View All Departments', value: { allDepartments } },
    { name: 'Add Departments', value: { addDept } },
    { name: 'Exit', value: 'exit' },
  ];

  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'query',
      message: 'What what you like to do?',
      choices,
    }
  ]).then((answers) => (answers.query));
};

init();