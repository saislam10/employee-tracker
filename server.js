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
  db.query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id', function (err, res) {
    if (err) return console.error(err);
    const employeeChoices = res.map(({ id, employee }) => ({
      name: employee,
      value: id
    })).filter(e => e);
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id=department.id', function (err, results) {
      if (err) return console.error(err);
      console.table(results);
      const roleChoices = results.map(({ id, title }) => ({
        name: title,
        value: id
      }));
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
          type: 'list',
          name: 'employeeRoleId',
          message: 'What is the role of the employee?',
          choices: roleChoices
        },
        {
          type: 'list',
          name: 'employeeManagerId',
          message: 'Who is the manager of the employee?',
          choices: 
            employeeChoices.concat({ name: 'No Manager', value: null }),
        }
      ]).then(function (answer) {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [answer.employeeFirstName, answer.employeeLastName, answer.employeeRoleId, answer.employeeManagerId], function (err, res) {
          if (err) throw err;
          console.table(res);
          init();
        });
      });
    });
  });
}

const addRole = () => {
  db.query('SELECT * FROM department', function (err, results) {
    if (err) return console.error(err);
    const deptChoices = results.map(({ id, name }) => ({
      name: name,
      value: id
    }));
    inquirer.prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of role you would like to add?'
      },
      {
        type: 'list',
        name: 'roleDeptId',
        message: 'What is the department name?',
        choices: deptChoices
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
  });
}

const addDepartment = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'departmentName',
    message: 'What is the name of the department you would like to add?'
  }]).then(function (answer) {
    db.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName], function (err, res) {
      if (err) throw err;
      console.table(res);
      init();
    });
  });
}

const updateRole = () => {
  db.query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id', function (err, res) {
    if (err) return console.error(err);
    const employeeChoices = res.map(({ id, employee }) => ({
      name: employee,
      value: id
    })).filter(e => e);
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id=department.id', function (err, results) {
      if (err) return console.error(err);
      const roleChoices = results.map(({ id, title }) => ({
        name: title,
        value: id
      }));
      inquirer.prompt([
        {
          type: 'list',
          name: 'updateEmployee',
          message: 'Who would you like to update?',
          choices: employeeChoices
        },
        {
          type: 'list',
          name: 'updateRole',
          message: 'What would you like to update their role to?',
          choices: roleChoices
        },
      ]).then(function (answer) {
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.updateRole, answer.updateEmployee], function (err, res) {
          if (err) throw err;
          console.table(res);
          init();
        });
      });
    });
  });
}

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

