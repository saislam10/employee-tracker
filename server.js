const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection(
  {
    user: 'root',
    database: 'employees_db',
  }
);

const fn = (options) => {
  if (options === 'exit') return process.exit();

  const query = 'SELECT * FROM department' + (('enrolled' in options) ? ' WHERE ?' : '');

  db.query(query, options, function (err, results) {
    if (err) return console.error(err);
    console.table(results);
    return init();
  });
};

const init = () => {
  const choices = [
    { name: 'View All Employees', value: { } },
    { name: 'Add Employee', value: {}, },
    { name: 'Update Employee Role', value: {} },
    { name: 'View All Roles', value: {} },
    { name: 'Add Role', value: {} },
    { name: 'View All Departments', value: { department: 1 } },
    { name: 'Add Departments', value: {} },
    { name: 'Exit', value: 'exit' },
  ];

  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'query',
      message: 'What what you like to do?',
      choices,
    }
  ]).then((answers) => fn(answers.query));
};

init();