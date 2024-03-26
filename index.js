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
    // SELECT employee.id AS id, first_name AS First_Name, last_name AS Last_Name, manager_id AS manager FROM employee JOIN employee ON employee.manager_id = employee.id
    //executles if the user selects 'View All Employees'
    if(data.action === 'View All Employees'){
        employees_db.query('SELECT employee.id AS employee_id, first_name AS First_Name, last_name AS Last_Name, role.title AS role, (employee.manager_id) AS manager_id FROM employee JOIN role ON employee.role_id = role.id', (err, {rows}) => {
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
        employees_db.query('SELECT name AS Department, id AS Department_ID FROM department', (err, {rows}) => {
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
        //extracts data from the role table in the database
        employees_db.query('SELECT role.title AS title, id AS role_id FROM role', (err, {rows}) => {
            //pulls all the role titles from the above database query and pushes them into roleArray
            for (let i = 0; i < rows.length; i++){
                roleArray.push(rows[i].title)
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
                }
                ])
                .then((data) => {
                    let jobId;
                    //finds at what index in roleArray matches the users selected option
                    //this is done to ensure the correct role id is pulled and used
                    for (let j = 0; j < roleArray.length; j++){
                        if(roleArray[j].includes(data.job)){
                            //once the match is found it pulls role data from the database using the matching title in roleArray
                            employees_db.query('SELECT role.id, role.title FROM role WHERE role.title = $1', [roleArray[j]], (err, {rows}) => {
                                jobId = rows[0].id
                                //inserts the new employee into the database with the role.id being pulled from the above query.
                                employees_db.query('INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)', [data.firstName, data.lastName, jobId])
                                console.log(`Employee, ${data.firstName} ${data.lastName}, added!`)
                                //runs the loop prompt
                                loopPrompt()
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
                
                //WORK IN PROGRESS
    //executes when the user selects 'Update Employee Role'
    }else if(data.action ==='Update Employee Role'){
        let idArray = []
        let employeeArray = []
        let roleArray = []

        employees_db.query('SELECT employee.first_name AS first_name, employee.last_name AS last_name, employee.id AS id FROM employee', (err, {rows}) => {
            for (let i = 0; i < rows.length; i++){
                let arrayItem = `${rows[i].last_name}, ${rows[i].first_name}`
                employeeArray.push(arrayItem)
                idArray.push(rows[i])
            }
            employees_db.query('SELECT role.title AS title, id AS role_id FROM role', (err, {rows}) => {
                for (let i = 0; i < rows.length; i++){
                    roleArray.push(rows[i].title)
                }
            })
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


