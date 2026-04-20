#DATABASE
CREATE DATABASE IF NOT EXISTS catcafe;
USE catcafe;

#CATS 
CREATE TABLE Cat (
    cat_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(5),
    age INT,
    description TEXT,
    image_url VARCHAR(30),
);

#PRODUCTS (drinks + desserts)
CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    category ENUM('drink', 'dessert'),
    description TEXT,
    image_url VARCHAR(255)
);

#MENU (per day)
CREATE TABLE Menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    day ENUM('Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
);

#MENU ITEMS (relationship)
CREATE TABLE MenuItem (
    menu_item_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT,
    product_id INT,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

#data inserts
#Wednesday
INSERT INTO Product (name, category, image_url) VALUES
('Oaxacan mocha', 'drink', './assets/products/OaxacaMocha.jpg'),
('Tamarind iced tea', 'drink', './assets/products/TamarindoTea.jpg'),
('Mint green tea', 'drink', './assets/products/GreenTea.jpg'),
('Cinnamon churro cupcake', 'dessert', './assets/products/CinnamonChurro.jpg'),
('Tres leches cup', 'dessert', './assets/products/TresLeches.jpg'); 

INSERT INTO Menu (day) VALUES
('Wednesday'),
('Thursday'),
('Friday'),
('Saturday'),
('Sunday');
INSERT INTO MenuItem (menu_id, product_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5);

#Thursday
INSERT INTO Product (name, category, image_url) VALUES
('Spiced Mexican espresso', 'drink', './assets/products/SpicedMexican.jpg'),
('Mango chile cold brew', 'drink', './assets/products/MangoChile.jpg'),
('Hibiscus iced tea', 'drink', './assets/products/HibiscusIced.jpg'),
('Choco-abuelita brownie', 'dessert', './assets/products/AbuelitaBrownie.jpg'),
('Coconut panna cotta', 'dessert', './assets/products/CoconutPanna.jpg');

INSERT INTO MenuItem (menu_id, product_id) VALUES
(2,6),(2,7),(2,8),(2,9),(2,10);

#Friday
INSERT INTO Product (name, category, image_url) VALUES
('Vanilla piloncillo latte', 'drink', './assets/products/VanillaPiloncillo.jpg'),
('Strawberry horchata', 'drink', './assets/products/StrawberryHorchata.jpg'),
('Lavender earl grey', 'drink', './assets/products/LavenderEarl.jpg'),
('Dulce de leche muffin', 'dessert', './assets/products/DulceLeche.jpg'),
('Polvorón shortbread', 'dessert', './assets/products/Polvoron.jpg');

INSERT INTO MenuItem (menu_id, product_id) VALUES
(3,11),(3,12),(3,13),(3,14),(3,15);

#Saturday
INSERT INTO Product (name, category, image_url) VALUES
('Café de olla americano', 'drink', './assets/products/CafeOlla.jpg'),
('Matcha horchata latte', 'drink', './assets/products/MatchaHorchata.jpg'),
('Cinnamon rooibos tea', 'drink', './assets/products/CinnamonRooibos.jpg'),
('Arroz con leche pudding', 'dessert', './assets/products/ArrozLeche.jpg');

INSERT INTO MenuItem (menu_id, product_id) VALUES
(4,16),(4,17),(4,18),(4,19);

#Sunday
INSERT INTO Product (name, category, image_url) VALUES
('Café de olla latte', 'drink', './assets/products/CafeOlla.jpg'),
('Horchata cold brew', 'drink', './assets/products/HorchataCold.jpg'),
('Chamomile & honey tea', 'drink', './assets/products/Chamomile.jpg'),
('Cajeta flan', 'dessert', './assets/products/CajetaFlan.jpg'),
('Piloncillo cookie', 'dessert', './assets/products/PiloncilloCookie.jpg');

INSERT INTO MenuItem (menu_id, product_id) VALUES
(5,20),(5,21),(5,22),(5,23),(5,24);

#Cats for adoption button
INSERT INTO Cat (name, age, description, image_url) VALUES
('Luna', 2, 'Playful and loves attention. Rescued from Roma.', './assets/cats/cat1.jpg'),
('Milo', 3, 'Very calm, perfect lap cat.', './assets/cats/cat2.jpg'),
('Nube', 1, 'Energetic kitten, loves to play.', './assets/cats/cat3.jpg'),
('Café', 4, 'Sleeps all day, wakes up for snacks.', './assets/cats/cat4.jpg'),
('Chai', 2, 'Friendly and curious.', './assets/cats/cat5.jpg'),
('Gema', 9, 'Lazy, only awake to eat.', './assets/cats/cat6.jpg'),
('Mimi', 11, 'Shy with other cats.', './assets/cats/cat7.jpg'),
('Lola', 4, 'Loves to play with everything.', './assets/cats/cat8.jpg'),
('Bob', 7, 'Loves nature.', './assets/cats/cat9.png');

SELECT * FROM Menu;
SELECT * FROM Product;
SELECT * FROM MenuItem;