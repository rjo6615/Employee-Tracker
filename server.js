const mysql = require('mysql2')
const inquirer = require('inquirer'); 
const cTable = require('console.table'); 

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gk5e79zl0p2ws',
  database: 'employee_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('You are connected!');
  afterConnect();
});
afterConnect = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE TRACKER         *")
    console.log("*                                 *")
    console.log("***********************************")
    Startprompt();
  };
  const Startprompt = () => {
    inquirer.prompt ([
      {
        type: 'list',
        name: 'choices', 
        message: 'What would you like to do?',
        choices: ['View All Employees', 
                  'Add Employee',
                  'Update Employee Role',
                  'View All Roles',
                  'Add Role',
                  'View All Departments',
                  'Add Department',
                  'Exit'
                ]
      }
    ])
      .then((answers) => {
        const { choices } = answers; 
        if (choices === "View All Employees") {
            showEmployees();
          }
        if (choices === "Add Employee") {
            addEmployee();
          }
        if (choices === "Update Employee Role") {
            updateEmployee();
          }
        if (choices === "View All Roles") {
            showRoles();
          }
        if (choices === "Add Role") {
            addRole();
          }  
        if (choices === "View All Departments") {
          showDepartments();
        }  
        if (choices === "Add Department") {
          addDepartment();
        }
        if (choices === "Exit") {
          connection.end()
      };
    });
  };
  