let mysql = require('mysql');
let inquirer = require('inquirer');

let connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log(`Welcome to Bamazon!! \nHere's a list of the items you can buy: `);
    showStock();
  });

  function showStock() {
    connection.query('SELECT * FROM products', function(err, res){
        if (err) throw err;
        res.forEach(row => {
            console.log(`Item #: ${row.item_id} ${row.product_name} - Price: $${row.price}`)
        });
        run();
    });
  };

  function run() {
      inquirer.prompt([{
          type: 'input',
          name: 'item_id',
          message: "Enter the ID of the product you'd like to buy",
      },{
        type: 'input',
        name: 'quantity',
        message: 'How many items would you like to buy?'
      }]).then(function(input) {
        let item_id = input.item_id;
        let quantity = input.quantity;
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) throw err;
            if (item_id > Math.max(res.length) || item_id <= 0 || item_id === "") {
                console.log(`Please match a number to an Item # shown in the inventory\nTry again!!`);
                setTimeout(showStock, 2000);
            } else {
                processOrder(item_id, quantity);
            };
        });
      });
  }

  function processOrder(item_id, quantity) {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        let order;
        for (let i = 0; i < res.length; i++) {
            if (res[i].item_id == item_id) {
                console.log(res[i].product_name);
                order = res[i];
            };
        };
        console.log(`We found ${order.product_name} in stock.  Let me complete your order`);
        if (order.stock_quantity >= quantity) {
            console.log('We have your order in stock')
            let updateStock = order.stock_quantity - quantity;
            let owed = order.price * quantity;
            console.log(`There are now ${updateStock} ${order.product_name}s left in our stock`);
            console.log(`Your order is complete.  Please pay $${owed}\nThank you for your business.`);
            connection.query("UPDATE products SET stock_quantity = ? where ?", [updateStock, {item_id: item_id}], function(err, res){
            });
            inquirer.prompt ([{
                type: 'confirm',
                name: 'buy_again',
                message:  'Would you like to order another product?',
                properties: 'Y/N',
            }])
            .then(function(confirm){
                switch(confirm.buy_again) {
                    case true:
                        showStock();
                        break;
                    case false:
                        console.log('Thank you for shopping with us.  Please come again!');
                        connection.end();
                        break;
                }
            });
        } else {
            console.log(`I'm sorry we weren't able to complete your order because there are not enough ${order.product_name}s in stock`);
            connection.end();
        }
    });
  };