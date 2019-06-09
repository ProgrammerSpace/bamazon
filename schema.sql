-- Create Database and mark it to use
drop database if exists bamazon;
create database bamazon;
use bamazon;

-- Create products table
create table products(
item_id integer primary key auto_increment not null,
product_name varchar(50) not null,
department_name varchar(50),
price double(6,2) not null,
stock_quantity integer not null
);

-- Alter table schema to support third part of homework
-- Adding column Product_Sales
ALTER TABLE products
ADD COLUMN product_sales decimal(5,2) AFTER price;

-- Create table departments
create table departments(
dept_id integer primary key auto_increment not null,
dept_name varchar(50) not null,
over_head_cost decimal(5,2)
);