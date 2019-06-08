-- Mock records for table products
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

-- Mock recirds for table departments
insert into departments (dept_name, ohc)
values ("sports", 50),
("Gadgets", 70),
("Home Decor", 40),
("Toys", 25),
("Kitchen Appliance", 40);