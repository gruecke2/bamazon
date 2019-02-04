/**
 * @author Garret Rueckert
 * 
 * U of U Bootcamp Spring 2019
 * 
 * "Bamazon" store-front node console-app with mySQL database
 */


//Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var sprintf = require("sprintf-js").sprintf;

// MySQL connection object
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "7890",
    database: "bamazon"
});


/**
 * To be run once database is connected. 
 */
function afterConnect(){

    connection.query(`SELECT * FROM products`, function(err, result){
        if(err) throw err;

        var items = [];
        result.forEach(item => {
            items.push(item);
        });

        // console.log(cTable.getTable(items));
        console.log(
            sprintf(`|%-8s |`,"Id:") +
            sprintf(`%-35s |`, "Product Name:") +
            sprintf(`%-13s |`, "Price:") +
            sprintf(`%-25s |`, "Department:") +
            sprintf(`%-10s |`, "Quantity:")
            );
        console.log(sprintf("|%'_100s|", ""));    

        result.forEach(item => {
            console.log(
            sprintf(`|%-8s |`, item.item_id) +
            sprintf(`%-35s |`, item.product_name) +
            sprintf(`$%-12.2f |`, item.price) +
            sprintf(`%-25s |`, item.department_name) +
            sprintf(`%-10s |`, item.stock_quantity)
            );  
        });

        promptUser();
    })
}


/**
 * Allows user to choose a product to purchase.
 */
function promptUser(){
    inquirer.prompt([
        {
            name: "productSelect",
            message: "What item would you like to purchase?",
            type: "entry"
        },
        {
            name: "productAmount",
            message: "How many would you like?",
            type: "entry"
        }
        
    ]).then(function(user){
        connection.query(`SELECT * FROM products WHERE item_id = ${user.productSelect}`, function(err, result){
            if(err) console.log(err);
            if(result[0].stock_quantity > user.productAmount){
                console.log(`(${user.productAmount}) ${result[0].product_name} ${(user.productAmount > 1) ? "were" : "was"} added to your cart!`);
                console.log(`Your total is $${result[0].price * user.productAmount}`);
                connection.query(`UPDATE products 
                SET stock_quantity = stock_quantity - ${user.productAmount}
                WHERE item_id = ${result[0].item_id}`);
            } else {
                console.log(`Oh no, it looks like we don't have enough of ${result[0].product_name} for your order!`);
            }
            connection.end();
        })
    })
}


/**
 * Main app to run
 */
connection.connect(function(err){
    if(err) throw err;
    console.log("\nWelcome to our online store!");
    afterConnect();
});