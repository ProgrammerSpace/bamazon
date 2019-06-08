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
    displayInventory();
});

// Display inventory
function displayInventory() {
    connection.query("SELECT item_id, product_name, price FROM products WHERE stock_quantity > 0", function (err, res) {
        if (err) throw err;
        console.table(res);
        userChoice();
    });
}

// Let user to purchase
function userChoice() {
    inquirer.prompt([

        {
            type: "input",
            message: "Select the ID of item you want to purchase",
            name: "purchaseItem"
        }
    ]).then(function (userResponse) {
        let purchaseItem = userResponse.purchaseItem;
        connection.query("SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: purchaseItem
            },
            function (err, res) {
                if (err) throw err;
                let inStock = res[0].stock_quantity;
                inquirer.prompt([

                    {
                        type: "input",
                        message: "How many units you'd like to purchase?",
                        name: "purchaseQuantity"
                    }
                ]).then(function (purchaseQuantity) {
                    let unitsToPurchase = purchaseQuantity.purchaseQuantity;
                    if (unitsToPurchase > inStock) {
                        console.log("Sorry, Insufficient quantity!\n\n");
                        continueShopping();
                    } else {
                        console.log("\nOrder placed!\n");
                        let inventoryUpdate = inStock - unitsToPurchase;
                        connection.query("SELECT price, product_sales FROM products WHERE ?",
                            {
                                item_id: purchaseItem
                            }, function (err, res) {
                                if (err) throw err;
                                let unitPrice = res[0].price;
                                let currentProdSales = res[0].product_sales;
                                let payable = unitsToPurchase * unitPrice;
                                let newProdSales = currentProdSales + payable;
                                console.log("Total cost: " + payable.toFixed(2));
                                connection.query("update products set ? where ?",
                                    [
                                        {
                                            product_sales: newProdSales,
                                            stock_quantity: inventoryUpdate
                                        },
                                        {
                                            item_id: purchaseItem
                                        }
                                    ],
                                    function (err, res) {
                                        if (err) throw err;
                                    });
                                continueShopping();
                            });
                    }
                });
            });
    });
}

// Getting user choice if to continue or not
function continueShopping() {
    inquirer.prompt([

        {
            type: "confirm",
            message: "Would you like to continue shopping?",
            name: "confirm",
            default: true
        }
    ]).then(function (userResponse) {
        if (userResponse.confirm) {
            displayInventory();
        } else {
            connection.end();
        }
    });
}