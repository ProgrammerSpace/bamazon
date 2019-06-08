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
    managerActions();
});

// Let user to purchase
function managerActions() {
    inquirer.prompt([

        {
            type: "list",
            message: "",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "action"
        }
    ]).then(function (managerResponse) {
        let newAction = managerResponse.action;
        switch (newAction) {
            case "View Products for Sale":
                displayInventory("productsOnSale");
                break;
            case "View Low Inventory":
                displayInventory("lowInventoryStock");
                break;
            case "Add to Inventory":
                updateInvetory();
                break;
            case "Add New Product":
                newProduct();
                break;
        }
    });
}

// Function to handle case 1 and 2
function displayInventory(actionKey) {
    let query = "";
    if (actionKey == "productsOnSale") {
        query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity > 0";
    } else if (actionKey = "lowInventoryStock") {
        query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
    }
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        continueActions();
    });
}

// Function to update product quantity in stock
function updateInvetory() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([

            {
                type: "input",
                message: "Select item with ID",
                name: "updateItem"
            },
            {
                type: "input",
                message: "How many units would you like to add?",
                name: "addUnits"
            }
        ]).then(function (inventoryUpdate) {
            let updateItem = inventoryUpdate.updateItem;
            let addUnits = inventoryUpdate.addUnits;
            let currentStock = 0, newStock = 0;
            console.log("updateItem: " + updateItem);
            connection.query("SELECT stock_quantity FROM products WHERE ?",
                {
                    item_id: updateItem
                },
                function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    currentStock = res[0].stock_quantity;
                    newStock = parseInt(currentStock) + parseInt(addUnits);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newStock
                            },
                            {
                                item_id: updateItem
                            }
                        ],
                        function (err, res) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("Successfully updated!");
                            continueActions();
                        }

                    );
                });
        });
    });
}

// Function to add new product
function newProduct() {
    inquirer.prompt([

        {
            type: "input",
            message: "Product name?",
            name: "name"
        },
        {
            type: "input",
            message: "Product Category?",
            name: "dept"
        },
        {
            type: "input",
            message: "Unit price?",
            name: "price"
        },
        {
            type: "input",
            message: "Quantity?",
            name: "quant"
        }
    ]).then(function (productDetails) {
        connection.query("INSERT INTO products SET ?",
            {
                product_name: productDetails.name,
                department_name: productDetails.dept,
                price: productDetails.price,
                stock_quantity: productDetails.quant
            },
            function (err, res) {
                if (err) {
                    return console.log(err);
                }
                console.log(res.affectedRows + " product added!");
                continueActions();
            })
    });
}

// Getting user choice if to continue or not
function continueActions() {
    inquirer.prompt([

        {
            type: "confirm",
            message: "Would you like to continue?",
            name: "confirm",
            default: true
        }
    ]).then(function (managerResponse) {
        if (managerResponse.confirm) {
            managerActions();
        } else {
            connection.end();
        }
    });
}
