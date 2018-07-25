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
    console.log('hello');
    managerList();
  });

  function managerList() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: "Welcome to the Bamazon Manager's console \nWhat would you like to do?",
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add new Product'
        ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case 'View Products for Sale':
                showStock();
                setTimeout(managerList, 4000);
                break;

            case 'View Low Inventory':
                lowInventory();
                setTimeout(managerList, 1000);
                break;
            
            case 'Add to Inventory':
                showStock();
                setTimeout(addInventory, 500);
                break;

            case 'Add new Product':
                addNewProduct();
                break;
        }
    });
  }

  function showStock() {
    connection.query('SELECT * FROM products', function(err, res){
        if (err) throw err;
        res.forEach(row => {
            console.log(`Item #: ${row.item_id} ${row.product_name} - Price: $${row.price}`)
        });
    });
  };

  function lowInventory() {
      connection.query('SELECT * FROM products', function(err, res){
          if (err) throw err;
            for (i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < 5) {
                    console.log(`The following items are low on inventory and will need to be reordered soon.`);
                    console.log(`Product ID#${res[i].item_id}: ${res[i].product_name} Quantity available: ${res[i].stock_quantity}`);
                }
            };
          
      });
  };

  function addInventory() {
    inquirer.prompt([{
        type: 'input',
        name: 'add',
        message: 'Which inventory item are you restocking?'
    }]).then(function(input){
        let item_id = input.add;
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) throw err;
            if (item_id > Math.max(res.length) || item_id <= 0 || item_id === "") {
                console.log(`Please match a number to an Item # shown in the inventory\nTry again!!`);
                addInventory();
            } else {
                inquirer.prompt([{
                    type: 'input',
                    name: 'howMany',
                    message: "How many items are you adding to stock?"
                }]).then(function(input2){
                    if (err) throw err;
                    let restock = input2.howMany;
                    connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?', [restock, item_id] , function(err, row, fields) {
                        if (err) throw err;
                        console.log(res[item_id-1].stock_quantity);
                        console.log(`You have just added ${restock} units of ${res[item_id-1].product_name}s to the inventory.`);
                        setTimeout(managerList, 1000);
                    });
                });
            };
        });
    })
  }

  function addNewProduct() {
      inquirer.prompt ([{
          type: 'input',
          name: 'name',
          message: 'What product are you adding?'
      }, {
          type: 'input',
          name: 'department',
          message: 'What department does this belong in?'
      }, {
          type: 'input',
          name: 'price',
          message: 'What is the price?'
      }, {
          type: 'input',
          name: 'quantity',
          message: 'How many will be added to the stock?'
      }])
      .then(function(answer) {
        let name = answer.name;
        let department = answer.department;
        let price = answer.price;
        let quantity = answer.quantity;
        connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)', [name, department, price, quantity], function(err, rows, fields) {
			if(err) throw err;
            console.log(`You have just successfully added ${quantity} ${name}s to the inventory`);
            setTimeout(managerList, 1000);
		});
      });
  };