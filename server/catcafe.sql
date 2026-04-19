#DATABASE
CREATE DATABASE IF NOT EXISTS catcafe;
USE catcafe;


#USERS (optional but useful)
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

#CATS (your rescued cats)
CREATE TABLE Cat (
    cat_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    description TEXT,
    status ENUM('available', 'adopted') DEFAULT 'available',
    image_url VARCHAR(255),
    rescued_date DATE
);

#ADOPTION
CREATE TABLE Adoption (
    adoption_id INT AUTO_INCREMENT PRIMARY KEY,
    cat_id INT,
    user_id INT,
    adoption_date DATE,
    FOREIGN KEY (cat_id) REFERENCES Cat(cat_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
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
('Oaxacan mocha', 'drink', './assets/OaxacaMocha.jpg'),
('Tamarind iced tea', 'drink', './assets/TamarindoTea.jpg'),
('Mint green tea', 'drink', './assets/GreenTea.jpg'),
('Cinnamon churro cupcake', 'dessert', './assets/CinnamonChurro.jpg'),
('Tres leches cup', 'dessert', './assets/TresLeches.jpg');

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
('Spiced Mexican espresso', 'drink', './assets/SpicedMexican.jpg'),
('Mango chile cold brew', 'drink', './assets/MangoChile.jpg'),
('Hibiscus iced tea', 'drink', './assets/HibiscusIced.jpg'),
('Choco-abuelita brownie', 'dessert', './assets/AbuelitaBrownie.jpg'),
('Coconut panna cotta', 'dessert', './assets/CoconutPanna.jpg');

INSERT INTO MenuItem (menu_id, product_id) VALUES
(2,6),(2,7),(2,8),(2,9),(2,10);

#Friday
INSERT INTO Product (name, category, image_url) VALUES
('Vanilla piloncillo latte', 'drink', './assets/VanillaPiloncillo.jpg'),
('Strawberry horchata', 'drink', './assets/StrawberryHorchata.jpg'),
('Lavender earl grey', 'drink', './assets/LavenderEarl.jpg'),
('Dulce de leche muffin', 'dessert', './assets/DulceLeche.jpg'),
('Polvorón shortbread', 'dessert', './assets/Polvoron.jpg');

INSERT INTO MenuItem (menu_id, product_id) VALUES
(3,11),(3,12),(3,13),(3,14),(3,15);

#Saturday
INSERT INTO Product (name, category, image_url) VALUES
('Café de olla americano', 'drink', './assets/CafeOlla.jpg'),
('Matcha horchata latte', 'drink', './assets/MatchaHorchata.jpg'),
('Cinnamon rooibos tea', 'drink', './assets/CinnamonRooibos.jpg'),
('Arroz con leche pudding', 'dessert', './assets/ArrozLeche.jpg');

INSERT INTO MenuItem (menu_id, product_id) VALUES
(4,16),(4,17),(4,18),(4,19);

#Sunday
INSERT INTO Product (name, category, image_url) VALUES
('Café de olla latte', 'drink', './assets/CafeOlla.jpg'),
('Horchata cold brew', 'drink', './assets/HorchataCold.jpg'),
('Chamomile & honey tea', 'drink', './assets/Chamomile.jpg'),
('Cajeta flan', 'dessert', './assets/CajetaFlan.jpg'),
('Piloncillo cookie', 'dessert', './assets/PiloncilloCookie.jpg');

INSERT INTO MenuItem (menu_id, product_id) VALUES
(5,20),(5,21),(5,22),(5,23),(5,24);

#Cats for adoption button
INSERT INTO Cat (name, age, description, image_url) VALUES
('Luna', 2, 'Playful and loves attention. Rescued from Roma.', 'cat1.jpg'),
('Milo', 3, 'Very calm, perfect lap cat.', 'cat2.jpg'),
('Nube', 1, 'Energetic kitten, loves to play.', 'cat3.jpg'),
('Café', 4, 'Sleeps all day, wakes up for snacks.', 'cat4.jpg'),
('Chai', 2, 'Friendly and curious.', 'cat5.jpg');

SELECT * FROM Menu;
SELECT * FROM Product;
SELECT * FROM MenuItem;