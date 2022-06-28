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
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id', function (err, results) {
    if (err) return console.error(err);
    console.table(results);
    init();
  });
}

const allRoles = () => {
  db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id=department.id', function (err, results) {
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
  inquirer.prompt([
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
  ]).then(function (answer) {
    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [answer.employeeFirstName, answer.employeeLastName, answer.employeeRoleId, answer.employeeManagerId], function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
    });
  });
}
const addRole = () => {
  inquirer.prompt([
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
  ]).then(function (answer) {
    db.query("INSERT INTO role (title, department_id, salary) VALUES (?,?,?)", [answer.roleName, answer.roleDeptId, answer.roleSalary], function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
    });
  });
}

const addDepartment = () => {
  inquirer.prompt({
    type: 'input',
    name: 'departmentName',
    message: 'What is the name of the department you would like to add?'
  }).then(function (answer) {
    db.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName], function (err, res) {
      if (err) throw err;
      console.table(res)
      init();
    });
  });
}

// const updateRole = () => {

//   inquirer.prompt({
//     type: 'list',
//     name: 'updateEmployee',
//     message: 'Who would you like to update?'
//   },
//   {
//     type: 'list',
//     name: 'updateRole',
//     message: 'What would you like to update their role to?'
//   }).then(function (answer) {
//     db.query('INSERT INTO role (department_id) VALUES (?)', [answer.updateRole], function (err, res) {
//       if (err) throw err;
//       console.table(res)
//       init();
//     });
//   });
// }


const init = () => {
  const choices = [
    'View All Employees',
    'Add Employee',
    'Update Employee Role',
    'View All Roles',
    'Add Role',
    'View All Departments',
    'Add Department',
    'Exit',
  ];

  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'query',
      message: 'What what you like to do?',
      choices,
    }

  ]).then(data => {
    if (data.query === 'View All Employees') { allEmployees(); };
    if (data.query === 'Add Employee') { addEmployee(); };
    if (data.query === "Update Employee Role") { updateRole(); };
    if (data.query === "View All Roles") { allRoles(); };
    if (data.query === "Add Role") { addRole(); };
    if (data.query === "View All Departments") { allDepartments(); };
    if (data.query === "Add Department") { addDepartment(); };
    if (data.query === "Exit") { db.end(); };

})
};

