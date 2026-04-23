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

-- Insert default archetypes
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

-- Dummy data for Card
SET AUTOCOMMIT = 0;
INSERT INTO Card (card_name, description, type, effect_from, effect_modifies, effect_to, value_effect, duration) VALUES
('People Favor Card', 'A card that boosts speed temporarily', 'PERMANENT', 'player', 'speed',  1),
('Mars Blade Card', 'A card that boosts damage temporarily', 2),
('Venus Blessing Card', 'A card that restores health permanently', 3),
('Imperial Decree Card', 'A punishment card that spawns more enemies', 4),
('Caesar Chains Card', 'A punishment card that disables jumping', 5),
('Jupiter Wrath Card', 'A punishment card that removes life instantly', 6);
COMMIT;

-- Dummy data for Enemy
SET AUTOCOMMIT = 0;
INSERT INTO Enemy (level_id, enemy_name, hp_start, speed_start, damage_start, enemy_type) VALUES
(1, 'Lion', 50, 4, 8, 'NPC'),
(2, 'Elite Gladiator', 80, 5, 12, 'NPC'),
(3, 'Arena Beast', 150, 3, 20, 'BOSS');
COMMIT;

-- Dummy data for Player
SET AUTOCOMMIT = 0;
INSERT INTO Player (name, username, password, total_runs, total_losses, total_wins) VALUES
('Sofia Campos', 'sofi123', 'hashed_password_1', 5, 2, 3),
('Daniela Ruiz', 'dani456', 'hashed_password_2', 8, 5, 3),
('Ariel Torres', 'ariel789', 'hashed_password_3', 10, 4, 6);
COMMIT;

-- Dummy data for MatchGame
SET AUTOCOMMIT = 0;
INSERT INTO MatchGame (player_id, archetype_id, end_time, duration_seconds, level_reached, final_fame, life, result) VALUES
(1, 1, NOW(), 180, 3, 120, 2, 'WIN'),
(2, 2, NOW(), 140, 2, 70, 1, 'LOSE'),
(3, 3, NOW(), 200, 3, 150, 3, 'WIN');
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