DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT(100) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT(100) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('50" TV', 'Electronics', 500, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Color Printer', 'Computers', 100, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Music CD', 'Audio', 10, 400);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Laptop', 'Computers', 1200, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Blu-Ray', 'Movies', 25, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Playstation 4', 'Gaming', 400, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Xbox One', 'Gaming', 400, 90);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('DVD', 'Movies', 15, 350);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('iPhone', 'Phones', 1000, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('iPad', 'Electronics', 800, 75);
