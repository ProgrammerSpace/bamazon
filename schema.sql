drop database if exists bamazon;
create database bamazon;
use bamazon;

create table products(
item_id integer primary key auto_increment not null,
product_name varchar(50) not null,
department_name varchar(50),
price double(6,2) not null,
stock_quantity integer not null
);

insert into 
products (product_name,department_name,price,stock_quantity)
values("shuttle bat","Sports",10.99,20),
("Shuttlecock","Sports",4.99,35),
("Bluetooth Speaker","Gadgets",49.99,15),
("Kindle","Gadgets",249.59,10),
("Wooden Wall Mount","Home Decor",15.39,13),
("Candle Holder","Home Decor",29.79,5),
("Building Blocks","Toys",7.99,15),
("Portable charger","Gadgets",89.99,3),
("Bread Toaster","Kitchen Appliance",17.99,3),
("Knife Set","Kitchen Appliance",49.99,2);