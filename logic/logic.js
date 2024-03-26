const { Pool } = require('pg');
const inquirer = require('inquirer');

const employees_db = new Pool (
    {
        user: 'postgres',
        password: 'password',
        host: 'localhost',
        database: 'employees_db'
    },
console.log('connected to employees_db!')
)

function loopPrompt() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'userAwnser',
                message: 'Whould you like to preform another action?',
                choices: [
                    'Yes', 
                    'No',
                ]
            }
        ])
        .then((data) => {
            if(data.userAwnser === 'Yes'){
                mainPrompt()
            }else{
                console.log('Thanks for using the Employee Database!')
            }
        });
}

function mainLogic(data) {
    employees_db.connect()

    if(data.action === 'View All Employees'){
        employees_db.query('SELECT employee.id AS id, first_name AS First_Name, last_name AS Last_Name, role.title AS Job FROM employee JOIN role ON employee.role_id = role.id', (err, {rows}) => {
            if (err) {
              console.log(err);
            }
            console.table(rows);
            loopPrompt()
        })

    }else if(data.action === 'View All Roles'){
        employees_db.query('SELECT role.id AS Role_ID, title AS Job_Title, salary as Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id', (err, {rows}) => {
            if (err) {
              console.log(err);
            }
            console.table(rows);
            loopPrompt()
        })

    }else if(data.action === 'View All Departments'){
        employees_db.query('SELECT name AS Department FROM department', (err, {rows}) => {
            if (err) {
              console.log(err);
            }
            console.table(rows);
        })

    }else if(data.action === 'Add Employee'){
        // 'SELECT employee.role_id AS role_id, role.title AS title FROM employee JOIN role ON employee.role_id = role.id'
        let roleArray = []
        employees_db.query('SELECT role.title AS title, id AS role_id FROM role', (err, {rows}) => {
        for (let i = 0; i < rows.length; i++){
            roleArray.push(rows[i].title)
        }
        })
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employees first name?',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the employees last name?', 
                },
                {
                    type: 'list',
                    name: 'job',
                    message: 'What is the employees role?',
                    choices: roleArray
                }
                ])
                .then((data) => {
                    let jobId;
                    for (let j = 0; j < roleArray.length; j++){
                        if(roleArray[j].includes(data.job)){
                            employees_db.query('SELECT role.id, role.title FROM role WHERE role.title = $1', [roleArray[j]], (err, {rows}) => {
                                console.log(rows[0].id)
                             jobId = rows[0].id
                                console.log(jobId, 'testttt')
                            })
                        }
                    }   
                    console.log(jobId, 'test')
                    employees_db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)', [data.firstname, data.lastname, jobId])
                    console.log(`${data.firstName} ${data.lastName} added!`)
                })
    }
}









module.exports = mainLogic