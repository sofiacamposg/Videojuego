CREATE DATABASE IF NOT EXISTS gladiator;
USE gladiator;

-- PLAYER
CREATE TABLE Player (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    username VARCHAR(30) UNIQUE,
    password VARCHAR(255),
    total_runs INT DEFAULT 0,
    total_losses INT DEFAULT 0,
    total_wins INT DEFAULT 0
);

-- EFFECT
CREATE TABLE Effect (
    effect_id INT AUTO_INCREMENT PRIMARY KEY,
    effect_name VARCHAR(50),
    effect_type VARCHAR(20),
    effect_value FLOAT,
    description VARCHAR(100)
);

-- CARD
CREATE TABLE Card (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    card_name VARCHAR(50),
    description VARCHAR(100),
    effect_id INT,
    FOREIGN KEY (effect_id) REFERENCES Effect(effect_id)
);

-- MATCH
CREATE TABLE MatchGame (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT,
    duration_seconds INT,
    final_fame INT,
    result VARCHAR(10),
    FOREIGN KEY (player_id) REFERENCES Player(player_id)
);

-- DATOS DE PRUEBA
INSERT INTO Player (name, username, password) VALUES
('Ariel', 'ariel', '123'),
('Sofia', 'sofi', '123');

INSERT INTO Effect (effect_name, effect_type, effect_value, description) VALUES
('Speed Boost', 'POWER_UP', 20, 'Faster movement'),
('Damage Boost', 'POWER_UP', 30, 'More damage');

INSERT INTO Card (card_name, description, effect_id) VALUES
('Speed Card', 'Gives speed', 1),
('Damage Card', 'Gives damage', 2);