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
('Warrior', 120, 5, 10),
('Lancer', 100, 6, 15),
('Heavy', 150, 3, 20);
COMMIT;

-- Insert the 3 levels
SET AUTOCOMMIT = 0;
INSERT INTO Level (level_number, target_time, condition_enemies, description) VALUES
(1, 35000, 6, 'First level of the arena'),
(2, 45000, 8, 'Intermediate arena battle'),
(3, 50000, 10, 'Final battle of the colosseum');
COMMIT;

-- Insert Cards catalog 
SET AUTOCOMMIT = 0;
INSERT INTO Card (card_name, description, effect_type, duration_type, effect_from, effect_modifies, effect_operator, effect_reverse_operator, value_effect, reverse_value, duration) VALUES
('Favor of the People', 
'Movement speed increases by 20% for the level duration', 
'POWER_UP', 'PERMANENT', 
'player', 'speed', '*', '/', 1.5, 1.5, 0),

('Blade of Mars', 
'Attack damage increases by 30% for the level duration', 
'POWER_UP', 'PERMANENT', 
'player', 'damage', '*', '/', 1.5, 1.5, 0),

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
'player', 'range', '*', '/', 1.6, 1.6, 8000),

('Eye of the Emperor',
'Reveals the type of the next 3 cards before selection',
'POWER_UP', 'PERMANENT',
'game', 'revealNextCard', '=', '=', 1.0, 0.0, 0),

('Imperial Decreee',
'2 additional enemies spawn immediately', 
'PUNISHMENT', 'PERMANENT', 
'game', 'spawnExtra', '=', '=', 2.0, 0.0, 0),

('Chains of Caesar', 
'Jump is disabled for 10 seconds', 
'PUNISHMENT', 'TEMPORARY', 
'player', 'canJump', '=', '=', 0.0, 1.0, 10000),

('Hunger of the Plebs', 
'Using any card costs half a heart of health', 
'PUNISHMENT', 'PERMANENT', 
'player', 'cardCostHP', '=', '=', 1.0, 0.0, 0),

('Wrath of Jupiter',   
'Instantly lose 1 heart', 
'PUNISHMENT', 'PERMANENT', 
'player', 'hearts', '-', '+', 1.0, 1.0, 0),

('Ampitheatre Fog', 
'Screen is partially darkened for 12 seconds', 
'PUNISHMENT', 'TEMPORARY', 
'game', 'fogActive', '=', '=', 1.0, 0.0, 12000),

('Lanistas Betrayal', 
'Player damage reduced by 40% for 15 seconds', 
'PUNISHMENT', 'TEMPORARY', 
'player', 'damage', '*', '/', 0.5, 0.5, 15000),

('Senates Judgment', 
'If the players hp equals 0, 2 lives are lost instead of 1', 
'PUNISHMENT', 'PERMANENT', 
'player', 'doubleDeath', '=', '=', 1.0, 0.0, 0);
COMMIT;

-- Insert Enemys catalog
SET AUTOCOMMIT = 0;
INSERT INTO Enemy (level_id, enemy_name, hp_start, speed_start, damage_start) VALUES
(1, 'Lion', 600, 4, 20),
(2, 'Tiger', 850, 5, 28),
(3, 'Boar', 1020, 6, 34);
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

-- Dummy data for LevelCard
SET AUTOCOMMIT = 0;
INSERT INTO LevelCard (player_id, card_id) VALUES
(1,  1),
(1,  3),
(2,  2),
(2,  5),
(3,  4),
(3,  7),
(4,  1),
(5,  6),
(5,  8),
(6,  2),
(7,  3),
(7,  9),
(8,  4),
(9,  5),
(9,  10),
(10, 6),
(11, 7),
(12, 8),
(13, 9),
(13, 11),
(14, 10),
(15, 12),
(16, 1),
(17, 13),
(18, 2),
(19, 14),
(20, 15),
(21, 3),
(22, 4),
(23, 5);
COMMIT;

-- Dummy data for SpecificLevel (30 rows across 13 matches)
-- enemy_id matches level_id: level 1 → Lion(1), level 2 → Tiger(2), level 3 → Boar(3)
SET AUTOCOMMIT = 0;
INSERT INTO SpecificLevel (match_id, level_id, enemy_id, finished, level_card_id, completion_time, remaining_hp, fame_gained) VALUES
-- match 1 (WIN, level 3)
(1,  1, 1, TRUE,   1,  45, 90,  25),
(1,  2, 2, TRUE,   2,  55, 70,  35),
(1,  3, 3, TRUE,   3,  70, 40,  60),
-- match 2 (LOSE, level 2)
(2,  1, 1, TRUE,   4,  40, 80,  20),
(2,  2, 2, FALSE,  5,  90, 20,  30),
-- match 3 (WIN, level 3)
(3,  1, 1, TRUE,   6,  38, 110, 30),
(3,  2, 2, TRUE,   7,  52, 85,  40),
(3,  3, 3, TRUE,   8,  65, 60,  65),
-- match 4 (LOSE, level 1)
(4,  1, 1, FALSE,  9,  88, 15,  10),
-- match 5 (WIN, level 3)
(5,  1, 1, TRUE,  10,  35, 95,  28),
(5,  2, 2, TRUE,  11,  48, 75,  38),
(5,  3, 3, TRUE,  12,  60, 50,  70),
-- match 6 (LOSE, level 2)
(6,  1, 1, TRUE,  13,  42, 85,  22),
(6,  2, 2, FALSE, 14,  95, 10,  15),
-- match 7 (WIN, level 3)
(7,  1, 1, TRUE,  15,  40, 100, 26),
(7,  2, 2, TRUE,  16,  58, 80,  36),
(7,  3, 3, TRUE,  17,  72, 55,  68),
-- match 8 (LOSE, level 1)
(8,  1, 1, FALSE, 18,  75,  5,   8),
-- match 9 (WIN, level 3)
(9,  1, 1, TRUE,  19,  33, 120, 32),
(9,  2, 2, TRUE,  20,  45, 90,  42),
(9,  3, 3, TRUE,  21,  58, 65,  75),
-- match 10 (LOSE, level 2)
(10, 1, 1, TRUE,  22,  50, 70,  18),
(10, 2, 2, FALSE, 23,  85, 15,  12),
-- match 11 (WIN, level 3)
(11, 1, 1, TRUE,  24,  37, 105, 30),
(11, 2, 2, TRUE,  25,  50, 80,  40),
(11, 3, 3, TRUE,  26,  68, 45,  72),
-- match 12 (LOSE, level 1)
(12, 1, 1, FALSE, 27,  92,  8,   5),
-- match 13 (WIN, level 3)
(13, 1, 1, TRUE,  28,  36, 115, 27),
(13, 2, 2, TRUE,  29,  49, 88,  37),
(13, 3, 3, TRUE,  30,  63, 58,  67);
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
    name, username, password,
    logins_count, users_count, user_movements_count,
    matches_count, wins_count, losses_count, admin_log
) VALUES
('Admin', 'admin', 'hashed_admin_password', 25, 3, 140, 3, 2, 1, 'Initial dummy data loaded');
COMMIT;

SET AUTOCOMMIT = 0;

COMMIT;

-- restores all the settings that were saved at the beginning
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;
SET autocommit=@old_autocommit;
COMMIT; 