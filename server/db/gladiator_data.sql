-- Gladiator Sample Database Data

-- sets the character encoding to utf8mb4 so special characters and accents are stored correctly
SET NAMES utf8mb4;
-- saves the current unique checks setting and turns it off temporarily to avoid errors while loading the schema
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
-- saves the current foreign key checks setting and turns it off temporarily so tables can be created in any order
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
-- saves the current sql mode and sets it to strict mode so invalid data is rejected instead of silently ignored
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';
-- saves the current autocommit setting so it can be restored at the end
SET @old_autocommit=@@autocommit;

USE gladiator;

-- Insert archetypes catalog
SET AUTOCOMMIT = 0;
INSERT INTO Archetype (name, hp_start, speed_start, damage_start) VALUES
('Warrior', 120, 5, 20),
('Lancer', 100, 6, 25),
('Heavy', 150, 3, 15);
COMMIT;

-- Insert the 3 levels
SET AUTOCOMMIT = 0;
INSERT INTO Level (level_number, target_time, description) VALUES
(1, 30, 'First level of the arena'),
(2, 30, 'Intermediate arena battle'),
(3, 30, 'Final battle of the colosseum');
COMMIT;

-- Insert Cards catalog TODO: AÑADIR LAS DEMÁS CARTAS
SET AUTOCOMMIT = 0;
INSERT INTO Card (card_name, description, effect_type, duration_type, effect_from, effect_modifies, effect_operator, effect_reverse_operator, value_effect, reverse_value, duration) VALUES
('Favor of the People', 
'Movement speed increases by 20% for the level duration', 
'POWER_UP', 'PERMANENT', 
'player', 'speed', '*', '/', 1.2, 1.2, 0),

('Blade of Mars', 
'Attack damage increases by 30% for the level duration', 
'POWER_UP', 'PERMANENT', 
'player', 'damage', '*', '/', 1.3, 1.3, 0),

('Blessing of Venus', 
'Instantly recover 1 heart', 
'POWER_UP', 'PERMANENT', 
'player', 'hearts', '+', '-', 1.0, 1.0, 0),

('Divine Shield', 
'Absorbs the next hit with no damage taken', 
'POWER_UP', 'PERMANENT', 
'player', 'invincible', '=', '=', 1.0, 0.0, 0),

('Lions Roar', 
'All current enemies are slowed for 5 seconds', 
'POWER_UP', 'TEMPORARY', 
'enemy', 'isSlowed', '=', '=', 1.0, 0.0, 5000),

('Gladiators Blood', 
'Each enemy kill restores a small amount of HP for the level duration', 
'POWER_UP', 'PERMANENT', 
'player', 'lifeSteal', '=', '=', 1.0, 0.0, 0),

('Colloseums fury', 
'Basic attack gains area of effect for 8 seconds', 
'POWER_UP', 'TEMPORARY', 
'player', 'range', '*', '/', 1.3, 1.3, 8000),

('Eye of the Emperor', 
'Reveals the type of the next 3 cards before selection', 
'POWER_UP', 'PERMANENT', 
'game', 'revealNextCard', '=', '=', 1.0, 0.0, 0),
---
('Spawn Enemies', 
'2 additional enemies spawn immediately', 
'PUNISHMENT', 'PERMANENT', 
'game', 'spawnExtra', '=', '=', 0.0, 2.0, 0),

('Disable Jump', 
'Jump is disabled for 10 seconds', 
'PUNISHMENT', 'TEMPORARY', 
'player', 'canJump', '=', '=', 1.0, 0.0, 10000),

('Card HP Cost', 
'Using any card costs half a heart of health', 
'PUNISHMENT', 'PERMANENT', 
'player', 'cardCost', '=', '=', 0.0, 1.0, 0),

('Lose 1 Heart', 
'Instantly lose 1 heart', 
'PUNISHMENT', 'PERMANENT', 
'player', 'hearts', '-', '+', 1.0, 1.0, 0),

('Screen Darkness', 
'Screen is partially darkened for 12 seconds', 
'PUNISHMENT', 'TEMPORARY', 
'game', 'darkScreen', '=', '=', 0.0, 1.0, 12000),

('Damage Reduction', 
'Player damage reduced by 40% for 15 seconds', 
'PUNISHMENT', 'TEMPORARY', 
'player', 'damage', '*', '/', 0.6, 0.6, 15000),

('Double Life Loss', 
'If the player dies during this level, 2 lives are lost instead of 1', 
'PUNISHMENT', 'PERMANENT', 
'player', 'doubleDeath', '=', '=', 0.0, 1.0, 0);
COMMIT;

-- Insert Enemys catalog
SET AUTOCOMMIT = 0;
INSERT INTO Enemy (level_id, enemy_name, hp_start, speed_start, damage_start) VALUES
(1, 'Lion', 50, 4, 8),
(2, 'Tiger', 80, 5, 12),
(3, 'Boar', 150, 3, 20);
COMMIT;

-- Dummy data for Player
SET AUTOCOMMIT = 0;
INSERT INTO Player (name, username, password, total_runs, total_losses, total_wins) VALUES
('Sofia Campos', 'sofi123', 'hashed_password_1', 5, 2, 3),
('Daniela Ruiz', 'dani456', 'hashed_password_2', 8, 5, 3),
('Ariel Torres', 'ariel789', 'hashed_password_3', 10, 4, 6),
('Carlos Mendoza', 'carlos_m', 'hashed_password_4', 3, 3, 0),
('Valentina Cruz', 'vale_cruz', 'hashed_password_5', 12, 4, 8),
('Miguel Herrera', 'miguelh', 'hashed_password_6', 7, 5, 2),
('Camila Vega', 'cami_v', 'hashed_password_7', 15, 6, 9),
('Diego Morales', 'diego_m', 'hashed_password_8', 2, 2, 0),
('Isabella Reyes', 'isa_reyes', 'hashed_password_9', 20, 8, 12),
('Sebastián López', 'sebas_l', 'hashed_password_10', 6, 4, 2),
('Lucía Fernández', 'luci_f', 'hashed_password_11', 9, 3, 6),
('Andrés Ramírez', 'andres_r', 'hashed_password_12', 4, 4, 0),
('Mariana Castillo', 'mari_c', 'hashed_password_13', 18, 7, 11),
('Rodrigo Gutiérrez', 'rodri_g', 'hashed_password_14', 11, 6, 5),
('Natalia Jiménez', 'nati_j', 'hashed_password_15', 25, 10, 15),
('Pablo Sánchez', 'pablo_s', 'hashed_password_16', 1, 1, 0),
('Fernanda Vargas', 'fer_v', 'hashed_password_17', 14, 5, 9),
('Tomás Flores', 'tomas_f', 'hashed_password_18', 8, 6, 2),
('Renata Ríos', 'renata_r', 'hashed_password_19', 30, 12, 18),
('Emilio Peña', 'emilio_p', 'hashed_password_20', 5, 3, 2),
('Valeria Ortiz', 'vale_o', 'hashed_password_21', 16, 7, 9),
('Nicolás Rojas', 'nico_r', 'hashed_password_22', 3, 2, 1),
('Alejandra Núñez', 'ale_n', 'hashed_password_23', 22, 9, 13),
('Javier Aguilar', 'javi_a', 'hashed_password_24', 7, 5, 2),
('Daniela Mora', 'dani_m', 'hashed_password_25', 13, 4, 9),
('Ricardo Delgado', 'ricky_d', 'hashed_password_26', 19, 8, 11),
('Gabriela Navarro', 'gabi_n', 'hashed_password_27', 6, 6, 0),
('Mateo Guerrero', 'mateo_g', 'hashed_password_28', 28, 11, 17),
('Catalina Ibáñez', 'cata_i', 'hashed_password_29', 10, 3, 7),
('Héctor Paredes', 'hector_p', 'hashed_password_30', 4, 2, 2);

COMMIT;

-- Dummy data for MatchGame
SET AUTOCOMMIT = 0;
INSERT INTO MatchGame (player_id, archetype_id, end_time, duration_seconds, level_reached, final_fame, life, result) VALUES
(1, 1, NOW(), 180, 3, 120, 2, 'WIN'),
(2, 2, NOW(), 140, 2, 70, 1, 'LOSE'),
(3, 3, NOW(), 200, 3, 150, 3, 'WIN'),
(4, 1, NOW(), 95, 1, 20, 0, 'LOSE'),
(5, 2, NOW(), 220, 3, 180, 4, 'WIN'),
(6, 3, NOW(), 110, 2, 55, 1, 'LOSE'),
(7, 1, NOW(), 175, 3, 130, 2, 'WIN'),
(8, 2, NOW(), 60, 1, 10, 0, 'LOSE'),
(9, 3, NOW(), 240, 3, 200, 5, 'WIN'),
(10, 1, NOW(), 130, 2, 80, 2, 'LOSE'),
(1, 2, NOW(), 195, 3, 140, 3, 'WIN'),
(2, 3, NOW(), 85, 1, 15, 0, 'LOSE'),
(11, 1, NOW(), 210, 3, 165, 4, 'WIN'),
(12, 2, NOW(), 120, 2, 60, 1, 'LOSE'),
(13, 3, NOW(), 255, 3, 210, 5, 'WIN'),
(3, 1, NOW(), 100, 1, 25, 0, 'LOSE'),
(14, 2, NOW(), 185, 3, 135, 2, 'WIN'),
(15, 3, NOW(), 145, 2, 90, 1, 'LOSE'),
(16, 1, NOW(), 230, 3, 190, 4, 'WIN'),
(17, 2, NOW(), 75, 1, 5, 0, 'LOSE'),
(5, 3, NOW(), 205, 3, 155, 3, 'WIN'),
(18, 1, NOW(), 115, 2, 45, 1, 'LOSE'),
(19, 2, NOW(), 265, 3, 220, 5, 'WIN'),
(20, 3, NOW(), 90, 1, 30, 0, 'LOSE'),
(9, 1, NOW(), 170, 3, 125, 2, 'WIN'),
(21, 2, NOW(), 135, 2, 75, 1, 'LOSE'),
(22, 3, NOW(), 245, 3, 195, 4, 'WIN'),
(7, 1, NOW(), 80, 1, 10, 0, 'LOSE'),
(23, 2, NOW(), 215, 3, 170, 3, 'WIN'),
(24, 3, NOW(), 125, 2, 65, 1, 'LOSE'),
(25, 1, NOW(), 275, 3, 230, 5, 'WIN'),
(13, 2, NOW(), 70, 1, 8, 0, 'LOSE'),
(26, 3, NOW(), 190, 3, 145, 2, 'WIN'),
(27, 1, NOW(), 150, 2, 85, 1, 'LOSE'),
(28, 2, NOW(), 260, 3, 215, 4, 'WIN');
COMMIT;

-- Dummy data for SpecificLevel
SET AUTOCOMMIT = 0;
INSERT INTO SpecificLevel (
    match_id, level_id, completion_time, remaining_hp, fame_gained,
    powerups_obtained, punishments_obtained, finished
) VALUES
(1, 1, 50, 90, 20, 2, 1, TRUE),
(1, 2, 60, 70, 30, 1, 1, TRUE),
(1, 3, 70, 40, 70, 1, 2, TRUE),
(2, 1, 45, 80, 25, 2, 1, TRUE),
(2, 2, 95, 20, 45, 1, 2, FALSE),
(3, 1, 40, 120, 35, 2, 1, TRUE);
COMMIT;

-- Dummy data for Deck
SET AUTOCOMMIT = 0;
INSERT INTO Deck (specific_level_id, card_id, effect_duration) VALUES
(1, 1, 30),
(2, 2, 30),
(3, 4, 15),
(4, 3, 0),
(5, 5, 10),
(6, 6, 0);
COMMIT;

-- Dummy data for Statistics
SET AUTOCOMMIT = 0;
INSERT INTO Statistics (
    logins_count, users_count, user_movements_count,
    matches_count, wins_count, losses_count, admin_log
) VALUES
(25, 3, 140, 3, 2, 1, 'Initial dummy data loaded');
COMMIT;

SET AUTOCOMMIT = 0;

COMMIT;

-- restores all the settings that were saved at the beginning
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;
SET autocommit=@old_autocommit;
COMMIT; 