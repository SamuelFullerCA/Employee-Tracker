const inquirer = require('inquirer');
const { Pool } = require('pg');

//fuction that prompts the suer with the choices for the main actions
const mainPrompt = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees', 
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Quit'
                ]
            }
        ])
        .then((data) => {
            //runs the main logic function with the users selection as the argument
            mainLogic(data)
        });
}

//runs the main prompt on load
mainPrompt()

//creates the pool to extract database info from
const employees_db = new Pool (
    {
        user: 'postgres',
        password: 'password',
        host: 'localhost',
        database: 'employees_db'
    },
console.log('connected to employees_db!')
)

//Prompt to ask the user of they want to do more actions
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
            //if the user selects yes it will resend the main prompt
            if(data.userAwnser === 'Yes'){
                mainPrompt()
            }else{
                console.log('Thanks for using the Employee Database!')
                console.log('Application has closed, press CTL + C to continue using terminal')

            }
        });
}

//main function for actions that run based off of user selection
function mainLogic(data) {

    //connects to the employees database
    employees_db.connect()
    // (SELECT e.first_name ||' '|| e.last_name employee, m.last_name ||' '|| m.first_name manager FROM employee e INNER JOIN employee m ON m.id = e.manager_id)
    if(data.action === 'View All Employees'){
        employees_db.query("SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, r.salary AS salary, d.name AS department, m.last_name ||', '|| m.first_name manager FROM employee e INNER JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id", (err, {rows}) => {
            if (err) {
              console.log(err);
            }
            console.table(rows);
            //runs the loop prompt
            loopPrompt()
        })

    //executles if the user selects 'View All Roles'
    }else if(data.action === 'View All Roles'){
        employees_db.query('SELECT role.id AS Role_ID, title AS Job_Title, salary as Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id', (err, {rows}) => {
            if (err) {
              console.log(err);
            }
            console.table(rows);
            //runs the loop prompt
            loopPrompt()
        })

    //executles if the user selects 'View All Departments'
    }else if(data.action === 'View All Departments'){
        employees_db.query('SELECT name AS Department_Name, id AS Department_ID FROM department', (err, {rows}) => {
            if (err) {
              console.log(err);
            }
            console.table(rows);
            //runs the loop prompt
            loopPrompt()
        })

    //executles if the user selects 'Add Employee'
    }else if(data.action === 'Add Employee'){
        //creates an array called roleArray
        let roleArray = []
        let managerArray = []
        let idPingArray = []
        //extracts data from the role table in the database
        employees_db.query('SELECT role.title AS title, id AS role_id FROM role', (err, {rows}) => {
            //pulls all the role titles from the above database query and pushes them into roleArray
            for (let i = 0; i < rows.length; i++){
                roleArray.push(rows[i].title)
            }
        })
        employees_db.query('SELECT employee.first_name AS first_name, employee.last_name AS last_name, employee.id AS id FROM employee', (err, {rows}) => {
            for (let i = 0; i < rows.length; i++){
                let arrayItem = `${rows[i].last_name}, ${rows[i].first_name}`
                managerArray.push(arrayItem)
                idPingArray.push(rows[i])
            }
        })
        //prompt for getting user inputs
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
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the employees manager?',
                    choices: managerArray
                }
                ])
                .then((data) => {
                    let jobId;
                    let managerId;
                    //finds at what index in roleArray matches the users selected option
                    //this is done to ensure the correct role id is pulled and used
                    for (let j = 0; j < roleArray.length; j++){
                        if(roleArray[j].includes(data.job)){
                            //once the match is found it pulls role data from the database using the matching title in roleArray
                            employees_db.query('SELECT role.id, role.title FROM role WHERE role.title = $1', [roleArray[j]], (err, {rows}) => {
                                jobId = rows[0].id
                                //finds at what index in managerArray matches the users selected option
                                //this is done to ensure the correct manager id is pulled and used
                                for (let k = 0; k < managerArray.length; k++){
                                    if(`${idPingArray[k].last_name}, ${idPingArray[k].first_name}`.includes(data.manager)){
                                        managerId = idPingArray[k].id
                                        //inserts the new employee into the database with the role.id and manager_id being pulled from the above query and array respectively.
                                        employees_db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [data.firstName, data.lastName, jobId, managerId])
                                        console.log(`Employee, ${data.firstName} ${data.lastName}, added!`)
                                        //runs the loop prompt
                                        loopPrompt()
                                    }
                                }
                            })
                        }
                    }   
                })
    //executes if the user selects 'Quit'
    }else if(data.action === 'Quit'){
        console.log('Quiting Employee Tracker Application...')
        return(console.log("Application Exited, hit CTL + C to continue using terminal"));
        //*note does not run loop prompt

    //executes if the user selects 'Add Role'
    }else if (data.action === 'Add Role'){
        //creates an array called departmentArray
        let dapartmentArray = []
        //extracts data from the department table in the database
        employees_db.query('SELECT name AS name, id AS department_id FROM department', (err, {rows}) => {
            //pulls all the department names from the above database query and pushes them into departmentArray
            for (let i = 0; i < rows.length; i++){
                dapartmentArray.push(rows[i].name)
        }
        })
        //prompt for getting user inputs
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'newRole',
                    message: 'what is the name of the new role?',
                },
                {
                    type: 'input',
                    name: 'newSalary',
                    message: 'what is the salary of the new role?',
                },
                {
                    type: 'list',
                    name: 'roleDepart',
                    message: 'Which department is this new role in?',
                    choices: dapartmentArray
                }
            ])
            .then((data) => {
                let departId;
                //finds at what index in departmentArray matches the users selected option
                //this is done to ensure the correct department id is pulled and used
                for (let j = 0; j < dapartmentArray.length; j++){
                    if(dapartmentArray[j].includes(data.roleDepart)){
                        //once the match is found it pulls department data from the database using the matching name in roleArray
                        employees_db.query('SELECT id, name FROM department WHERE department.name = $1', [dapartmentArray[j]], (err, {rows}) => {
                            departId = rows[0].id
                            //inserts the new role into the database with the department.id being pulled from the above query
                            employees_db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [data.newRole, data.newSalary, departId])
                            console.log(`${data.newRole} role added!`)
                            //runs the loop prompt
                            loopPrompt()
                        })
                    }
                }   
            })
     //executes if the user selects 'Add department'
    }else if(data.action === 'Add Department'){
        //prompt for user inputs
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'newDept',
                    message: 'what is the name of the new department?',
                },
            ])
                .then((data) => {
                    //inserts the department into the database
                    employees_db.query('INSERT INTO department (name) VALUES ($1)', [data.newDept])
                    console.log(`${data.newDept} department added!`)
                    //runs the loop prompt
                    loopPrompt()
                })

    //executes when the user selects 'Update Employee Role'
    }else if(data.action ==='Update Employee Role'){
        let idArray = []
        let employeeArray = []
        let roleArray = []

        //creates an array of employees
        employees_db.query('SELECT employee.first_name AS first_name, employee.last_name AS last_name, employee.id AS id FROM employee', (err, {rows}) => {
            for (let i = 0; i < rows.length; i++){
                let arrayItem = `${rows[i].last_name}, ${rows[i].first_name}`
                employeeArray.push(arrayItem)
                idArray.push(rows[i])
            }
            //creates an array of roles
            employees_db.query('SELECT role.title AS title, id AS role_id FROM role', (err, {rows}) => {
                for (let i = 0; i < rows.length; i++){
                    roleArray.push(rows[i].title)
                }
            })
            //prompts the user
            inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'EmployeeUpdate',
                    message: 'Which employee do you want to update?',
                    choices: employeeArray
                },
                {
                    type: 'list',
                    name: 'roleUpdate',
                    message: 'What is the new role?',
                    choices: roleArray
                }
            ])
            .then((data) => {
                let employeeRoleId
                let employeeId
                //finds at what index in idArray matches the users selected option
                //this is done to ensure the correct role id is pulled and used
                for (let j = 0; j < idArray.length; j++){
                    if(`${idArray[j].last_name}, ${idArray[j].first_name}`.includes(data.EmployeeUpdate)){
                        employeeId = idArray[j].id
                        employees_db.query('SELECT id FROM role WHERE role.title = $1', [data.roleUpdate], (err, {rows}) => {
                            employeeRoleId = rows[0].id
                            employees_db.query('UPDATE employee SET role_id = $1 WHERE id = $2', [employeeRoleId, employeeId])
                            loopPrompt()
                        })
                    }   
                }
            })
        })
    }
}


