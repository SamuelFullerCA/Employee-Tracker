const inquirer = require('inquirer');

inquirer
    .prompt([

        {
            type: 'list',
            name: 'title',
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
        },

    ])
    .then((data) => {
        console.log('test')
    });