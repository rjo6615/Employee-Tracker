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
    console.log("*        EMPLOYEE Tracker         *")
    console.log("*                                 *")
    console.log("***********************************")
    // promptUser();
  };