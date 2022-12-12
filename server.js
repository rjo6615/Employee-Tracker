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
    startPrompt();
  };
  const startPrompt = () => {
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

  showEmployees = () => {
    console.log('Showing all employees...\n'); 
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department,
                        role.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                 FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  
    connection.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
      startPrompt();
    });
  };

  addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name?",
        validate: addFName => {
          if (addFName) {
              return true;
          } else {
              console.log("Please enter the employee's first name");
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLName => {
          if (addLName) {
              return true;
          } else {
              console.log("Please enter the employee's last name");
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.fistName, answer.lastName]  
      const roleSql = `SELECT role.id, role.title FROM role`;
    
      connection.query(roleSql, (err, data) => {
        if (err) throw err; 
        
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerSql = `SELECT * FROM employee`;
  
                connection.query(managerSql, (err, data) => {
                  if (err) throw err;
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
  
                      connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added!")
  
                      showEmployees();
                });
              });
            });
          });
       });
    });
  };
  updateEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;
  
    connection.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM role`;
  
          connection.query(roleSql, (err, data) => {
            if (err) throw err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
  
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;                
                  updateManager();
            });
          });
        });
      });
    });
  };
  updateManager = () => {
    const employeeSql = `SELECT * FROM employee`;
  
    connection.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const managerSql = `SELECT * FROM employee`;
  
            connection.query(managerSql, (err, data) => {
              if (err) throw err; 
  
            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
              
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager); 
                      
                      let employee = params[0]
                      params[0] = manager
                      params[1] = employee   
                      const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
  
                      connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                      console.log("Employee has been updated!");
                    
                      showEmployees();
            });
          });
        });
      });
    });
  };
  showRoles = () => {
    console.log('Showing all roles...\n');
  
    const sql = `SELECT role.id, role.title, department.name AS department
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;
    
    connection.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      startPrompt();
    })
  };
  addRole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'role',
        message: "What role do you want to add?",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log('Please enter a role');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        validate: addSalary => {
          if ((addSalary)) {
              return true;
          } else {
              console.log('Please enter a salary');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const params = [answer.role, answer.salary];
        const roleSql = `SELECT name, id FROM department`; 
  
        connection.query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "What department is this role in?",
            choices: dept
          }
          ])
            .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);
  
              const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;
  
              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.role + " to roles!"); 
  
                showRoles();
         });
       });
     });
   });
  };
  showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
  
    connection.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      startPrompt();
    });
  };
  addDepartment = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDept',
        message: "What department do you want to add?",
        validate: addDept => {
          if (addDept) {
              return true;
          } else {
              console.log('Please enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        connection.query(sql, answer.addDept, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDept + " to departments!"); 
  
          showDepartments();
      });
    });
  };