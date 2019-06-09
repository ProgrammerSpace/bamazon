// Import packages to use
var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");
var mysql = require("mysql");

// MySQL connection setup
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon"
});

// Establish MySQL Connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    supervisorActions();
});

function supervisorActions() {
    inquirer.prompt([

        {
            type: "list",
            message: "",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "action"
        }
    ]).then(function (supervisorResponse) {
        let newAction = supervisorResponse.action;

        switch (newAction) {
            case "View Product Sales by Department":
                deptView();
                break;
            case "Create New Department":
                newDept();
                break;
        }
    });
}

function deptView() {
    // connection.query("SELECT d.dept_id AS department_id, d.dept_name, d.ohc AS over_head_cost, sum(p.product_sales) AS total_sales FROM products p JOIN departments d ON d.dept_name=p.department_name GROUP BY d.dept_name ORDER BY department_id",
    // Above select statement says "this is incompatible with sql_mode=only_full_group_by"

    connection.query("SELECT max(d.dept_id) AS department_id, d.dept_name, max(d.ohc) AS over_head_cost, sum(p.product_sales) AS total_sales FROM products p JOIN departments d ON d.dept_name=p.department_name GROUP BY d.dept_name ORDER BY department_id",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            continueAction();
        });
}

function newDept() {
    inquirer.prompt([

        {
            type: "input",
            message: "Enter new department to be added",
            name: "newDept"
        },
        {
            type: "input",
            message: "Over head cost of added department",
            name: "ohc"
        }
    ]).then(function (deptDetails) {
        connection.query("INSERT INTO departments SET ?",
            [
                {
                    dept_name: deptDetails.newDept,
                    ohc: deptDetails.ohc
                }
            ],
            function (err, res) {
                if (err) throw err;
                console.log("Department added!");
                continueAction();
            });
    });
}

// Getting user choice if to continue or not
function continueAction() {
    inquirer.prompt([

        {
            type: "confirm",
            message: "Would you like to continue?",
            name: "confirm",
            default: true
        }
    ]).then(function (userResponse) {
        if (userResponse.confirm) {
            supervisorActions();
        } else {
            connection.end();
        }
    });
}