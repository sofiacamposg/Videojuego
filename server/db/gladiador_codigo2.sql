CREATE DATABASE IF NOT EXISTS gladiator;
USE gladiator;

-- Table: Player
-- Stores player account data, demographic/basic information, and general counters
CREATE TABLE Player (
    player_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_runs SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    total_losses SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    total_wins SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Archetype
-- Stores the initial stats of each playable archetype
CREATE TABLE Archetype (
    archetype_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    hp_start SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    speed_start SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    damage_start SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (archetype_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default archetypes
INSERT INTO Archetype (name, hp_start, speed_start, damage_start) VALUES
('Warrior', 120, 5, 20),
('Lancer', 100, 6, 25),
('Heavy', 150, 3, 15);

-- Table: Level
-- Stores each level, target time, and description
CREATE TABLE Level (
    level_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    level_number TINYINT UNSIGNED NOT NULL UNIQUE,
    target_time SMALLINT UNSIGNED NOT NULL,
    description VARCHAR(120) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (level_id),
    CONSTRAINT chk_level_number CHECK (level_number BETWEEN 1 AND 3),
    CONSTRAINT chk_target_time CHECK (target_time > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert the 3 levels
INSERT INTO Level (level_number, target_time, description) VALUES
(1, 30, 'First level of the arena'),
(2, 30, 'Intermediate arena battle'),
(3, 30, 'Final battle of the colosseum');

-- Table: Effect
-- Stores effect metadata independently from cards
-- type = whether it is a power-up or punishment
CREATE TABLE Effect (
    effect_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    effect_name VARCHAR(40) NOT NULL UNIQUE,
    effect_type ENUM('POWER_UP', 'PUNISHMENT') NOT NULL,
    effect_value DECIMAL(6,2) NOT NULL,
    description VARCHAR(120) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (effect_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: TemporaryEffect
-- Stores only temporary effects and their duration
CREATE TABLE TemporaryEffect (
    effect_id SMALLINT UNSIGNED NOT NULL,
    duration_seconds SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (effect_id),
    CONSTRAINT fk_temporaryeffect_effect
        FOREIGN KEY (effect_id) REFERENCES Effect(effect_id),
    CONSTRAINT chk_duration_seconds CHECK (duration_seconds > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: PermanentEffect
-- Stores effects that do not expire
CREATE TABLE PermanentEffect (
    effect_id SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (effect_id),
    CONSTRAINT fk_permanenteffect_effect
        FOREIGN KEY (effect_id) REFERENCES Effect(effect_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Card
-- Stores cards and links each one to an effect
CREATE TABLE Card (
    card_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    card_name VARCHAR(40) NOT NULL UNIQUE,
    description VARCHAR(120) NOT NULL,
    effect_id SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (card_id),
    CONSTRAINT fk_card_effect
        FOREIGN KEY (effect_id) REFERENCES Effect(effect_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Enemy
-- Keeps the enemy catalog used by the game
CREATE TABLE Enemy (
    enemy_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    level_id SMALLINT UNSIGNED NOT NULL,
    enemy_name VARCHAR(30) NOT NULL UNIQUE,
    hp_start SMALLINT UNSIGNED NOT NULL,
    speed_start SMALLINT UNSIGNED NOT NULL,
    damage_start SMALLINT UNSIGNED NOT NULL,
    enemy_type ENUM('NPC', 'BOSS') NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (enemy_id),
    CONSTRAINT fk_enemy_level
        FOREIGN KEY (level_id) REFERENCES Level(level_id),
    CONSTRAINT chk_enemy_hp CHECK (hp_start > 0),
    CONSTRAINT chk_enemy_speed CHECK (speed_start > 0),
    CONSTRAINT chk_enemy_damage CHECK (damage_start > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Match
-- Stores each run of the game and whether the player won or lost
CREATE TABLE MatchGame (
    match_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    player_id SMALLINT UNSIGNED NOT NULL,
    archetype_id SMALLINT UNSIGNED NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    duration_seconds SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    level_reached TINYINT UNSIGNED NOT NULL,
    final_fame SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    life TINYINT UNSIGNED NOT NULL,
    result ENUM('WIN', 'LOSE') NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (match_id),
    CONSTRAINT fk_match_player
        FOREIGN KEY (player_id) REFERENCES Player(player_id),
    CONSTRAINT fk_match_archetype
        FOREIGN KEY (archetype_id) REFERENCES Archetype(archetype_id),
    CONSTRAINT chk_match_duration CHECK (duration_seconds >= 0),
    CONSTRAINT chk_level_reached CHECK (level_reached BETWEEN 1 AND 3),
    CONSTRAINT chk_final_fame CHECK (final_fame >= 0),
    CONSTRAINT chk_life CHECK (life BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: SpecificLevel
-- Stores stats for a specific level inside one match
CREATE TABLE SpecificLevel (
    specific_level_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_id INT UNSIGNED NOT NULL,
    level_id SMALLINT UNSIGNED NOT NULL,
    completion_time SMALLINT UNSIGNED NOT NULL,
    remaining_hp SMALLINT UNSIGNED NOT NULL,
    fame_gained SMALLINT UNSIGNED NOT NULL,
    powerups_obtained TINYINT UNSIGNED NOT NULL,
    punishments_obtained TINYINT UNSIGNED NOT NULL,
    finished BOOLEAN NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (specific_level_id),
    CONSTRAINT fk_specificlevel_match
        FOREIGN KEY (match_id) REFERENCES MatchGame(match_id),
    CONSTRAINT fk_specificlevel_level
        FOREIGN KEY (level_id) REFERENCES Level(level_id),
    CONSTRAINT chk_completion_time CHECK (completion_time >= 0),
    CONSTRAINT chk_remaining_hp CHECK (remaining_hp > 0),
    CONSTRAINT chk_fame_gained CHECK (fame_gained > 0),
    CONSTRAINT chk_powerups_obtained CHECK (powerups_obtained IN (1, 2)),
    CONSTRAINT chk_punishments_obtained CHECK (punishments_obtained IN (1, 2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Deck
-- Renamed from used card table
-- Stores which cards were used during a specific level
CREATE TABLE Deck (
    deck_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    specific_level_id INT UNSIGNED NOT NULL,
    card_id SMALLINT UNSIGNED NOT NULL,
    use_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effect_duration SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (deck_id),
    CONSTRAINT fk_deck_specificlevel
        FOREIGN KEY (specific_level_id) REFERENCES SpecificLevel(specific_level_id),
    CONSTRAINT fk_deck_card
        FOREIGN KEY (card_id) REFERENCES Card(card_id),
    CONSTRAINT chk_effect_duration CHECK (effect_duration >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Statistics
-- Stores general game stats, login count, user activity, and admin log info
CREATE TABLE Statistics (
    statistics_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    logins_count INT UNSIGNED NOT NULL DEFAULT 0,
    users_count INT UNSIGNED NOT NULL DEFAULT 0,
    user_movements_count INT UNSIGNED NOT NULL DEFAULT 0,
    matches_count INT UNSIGNED NOT NULL DEFAULT 0,
    wins_count INT UNSIGNED NOT NULL DEFAULT 0,
    losses_count INT UNSIGNED NOT NULL DEFAULT 0,
    admin_log VARCHAR(255) NOT NULL DEFAULT 'System initialized',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (statistics_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dummy data for Player
INSERT INTO Player (name, username, password, total_runs, total_losses, total_wins) VALUES
('Sofia Campos', 'sofi123', 'hashed_password_1', 5, 2, 3),
('Daniela Ruiz', 'dani456', 'hashed_password_2', 8, 5, 3),
('Ariel Torres', 'ariel789', 'hashed_password_3', 10, 4, 6);

-- Dummy data for Effect
INSERT INTO Effect (effect_name, effect_type, effect_value, description) VALUES
('People Favor', 'POWER_UP', 20.00, 'Increases movement speed'),
('Mars Blade', 'POWER_UP', 30.00, 'Increases damage dealt'),
('Venus Blessing', 'POWER_UP', 1.00, 'Restores one life point'),
('Imperial Decree', 'PUNISHMENT', 2.00, 'Spawns extra enemies'),
('Caesar Chains', 'PUNISHMENT', 10.00, 'Disables jump temporarily'),
('Jupiter Wrath', 'PUNISHMENT', 1.00, 'Removes one life instantly');

-- Dummy data for TemporaryEffect
INSERT INTO TemporaryEffect (effect_id, duration_seconds) VALUES
(1, 30),
(2, 30),
(4, 15),
(5, 10);

-- Dummy data for PermanentEffect
INSERT INTO PermanentEffect (effect_id) VALUES
(3),
(6);

-- Dummy data for Card
INSERT INTO Card (card_name, description, effect_id) VALUES
('People Favor Card', 'A card that boosts speed temporarily', 1),
('Mars Blade Card', 'A card that boosts damage temporarily', 2),
('Venus Blessing Card', 'A card that restores health permanently', 3),
('Imperial Decree Card', 'A punishment card that spawns more enemies', 4),
('Caesar Chains Card', 'A punishment card that disables jumping', 5),
('Jupiter Wrath Card', 'A punishment card that removes life instantly', 6);

-- Dummy data for Enemy
INSERT INTO Enemy (level_id, enemy_name, hp_start, speed_start, damage_start, enemy_type) VALUES
(1, 'Lion', 50, 4, 8, 'NPC'),
(2, 'Elite Gladiator', 80, 5, 12, 'NPC'),
(3, 'Arena Beast', 150, 3, 20, 'BOSS');

-- Dummy data for MatchGame
INSERT INTO MatchGame (player_id, archetype_id, end_time, duration_seconds, level_reached, final_fame, life, result) VALUES
(1, 1, NOW(), 180, 3, 120, 2, 'WIN'),
(2, 2, NOW(), 140, 2, 70, 1, 'LOSE'),
(3, 3, NOW(), 200, 3, 150, 3, 'WIN');

-- Dummy data for SpecificLevel
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

-- Dummy data for Deck
INSERT INTO Deck (specific_level_id, card_id, effect_duration) VALUES
(1, 1, 30),
(2, 2, 30),
(3, 4, 15),
(4, 3, 0),
(5, 5, 10),
(6, 6, 0);

-- Dummy data for Statistics
INSERT INTO Statistics (
    logins_count, users_count, user_movements_count,
    matches_count, wins_count, losses_count, admin_log
) VALUES
(25, 3, 140, 3, 2, 1, 'Initial dummy data loaded');

-- View: general stats summary
CREATE VIEW vw_general_statistics AS
SELECT
    COUNT(DISTINCT p.player_id) AS total_players,
    COUNT(m.match_id) AS total_matches,
    SUM(CASE WHEN m.result = 'WIN' THEN 1 ELSE 0 END) AS total_wins,
    SUM(CASE WHEN m.result = 'LOSE' THEN 1 ELSE 0 END) AS total_losses
FROM Player p
LEFT JOIN MatchGame m ON p.player_id = m.player_id;

-- View: player stats
CREATE VIEW vw_player_statistics AS
SELECT
    p.player_id,
    p.name,
    p.username,
    p.total_runs,
    p.total_wins,
    p.total_losses
FROM Player p;

-- Stored Procedure: get all matches by player
DELIMITER //
CREATE PROCEDURE GetMatchesByPlayer(IN in_player_id SMALLINT UNSIGNED)
BEGIN
    SELECT *
    FROM MatchGame
    WHERE player_id = in_player_id;
END //
DELIMITER ;

-- Stored Procedure: insert a new match
DELIMITER //
CREATE PROCEDURE InsertMatch(
    IN in_player_id SMALLINT UNSIGNED,
    IN in_archetype_id SMALLINT UNSIGNED,
    IN in_duration_seconds SMALLINT UNSIGNED,
    IN in_level_reached TINYINT UNSIGNED,
    IN in_final_fame SMALLINT UNSIGNED,
    IN in_life TINYINT UNSIGNED,
    IN in_result ENUM('WIN', 'LOSE')
)
BEGIN
    INSERT INTO MatchGame (
        player_id, archetype_id, end_time, duration_seconds,
        level_reached, final_fame, life, result
    )
    VALUES (
        in_player_id, in_archetype_id, NOW(), in_duration_seconds,
        in_level_reached, in_final_fame, in_life, in_result
    );
END //
DELIMITER ;

-- Trigger: update player counters after inserting a match
DELIMITER //
CREATE TRIGGER trg_after_insert_match
AFTER INSERT ON MatchGame
FOR EACH ROW
BEGIN
    UPDATE Player
    SET total_runs = total_runs + 1,
        total_wins = total_wins + IF(NEW.result = 'WIN', 1, 0),
        total_losses = total_losses + IF(NEW.result = 'LOSE', 1, 0)
    WHERE player_id = NEW.player_id;

    UPDATE Statistics
    SET matches_count = matches_count + 1,
        wins_count = wins_count + IF(NEW.result = 'WIN', 1, 0),
        losses_count = losses_count + IF(NEW.result = 'LOSE', 1, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE statistics_id = 1;
END //
DELIMITER ;

-- Trigger: update user count when a new player is inserted
DELIMITER //
CREATE TRIGGER trg_after_insert_player
AFTER INSERT ON Player
FOR EACH ROW
BEGIN
    UPDATE Statistics
    SET users_count = users_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE statistics_id = 1;
END //
DELIMITER ;