-- sets the character encoding to utf8mb4 so special characters and accents are stored correctly
SET NAMES utf8mb4;
-- saves the current unique checks setting and turns it off temporarily to avoid errors while loading the schema
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
-- saves the current foreign key checks setting and turns it off temporarily so tables can be created in any order
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
-- saves the current sql mode and sets it to strict mode so invalid data is rejected instead of silently ignored
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP DATABASE IF EXISTS gladiator;
CREATE DATABASE IF NOT EXISTS gladiator;
USE gladiator;

-- Table: Player
CREATE TABLE Player (
    player_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_runs SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    total_losses SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    total_wins SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    hearts SMALLINT UNSIGNED NOT NULL DEFAULT 1,  -- players can buy more
    galen SMALLINT UNSIGNED NOT NULL DEFAULT 0,  -- like a shield players can buy
    fame SMALLINT NOT NULL DEFAULT 0,  -- used to buy upgrades
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (player_id),
    CONSTRAINT chk_hearts CHECK (hearts <= 5),
    CONSTRAINT chk_galen CHECK (galen >= 0),
    CONSTRAINT chk_coins CHECK (fame >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Archetype
CREATE TABLE Archetype (
    archetype_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    hp_start SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    speed_start SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    damage_start SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (archetype_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Level
CREATE TABLE Level (
    level_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    level_number TINYINT UNSIGNED NOT NULL UNIQUE,
    target_time INT UNSIGNED NOT NULL,
    description VARCHAR(120) NOT NULL,
    condition_enemies TINYINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (level_id),
    CONSTRAINT chk_level_number CHECK (level_number BETWEEN 1 AND 3),
    CONSTRAINT chk_target_time CHECK (target_time > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Card — all effect data lives here directly (no separate Effect table)
CREATE TABLE Card (
    card_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    card_name VARCHAR(40) NOT NULL UNIQUE,
    description VARCHAR(120) NOT NULL,
    effect_type ENUM('POWER_UP', 'PUNISHMENT') NOT NULL,
    duration_type ENUM('TEMPORARY', 'PERMANENT') NOT NULL,
    effect_from VARCHAR(6) NOT NULL,
    effect_modifies VARCHAR(15) NOT NULL,
    effect_operator CHAR(1) NOT NULL,
    effect_reverse_operator CHAR(1) NOT NULL,
    value_effect FLOAT NOT NULL,
    reverse_value FLOAT NOT NULL DEFAULT 0,
    duration SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Enemy
CREATE TABLE Enemy (
    enemy_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    level_id SMALLINT UNSIGNED NOT NULL,
    enemy_name VARCHAR(30) NOT NULL UNIQUE,
    hp_start SMALLINT UNSIGNED NOT NULL,
    speed_start SMALLINT UNSIGNED NOT NULL,
    damage_start SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (enemy_id),
    CONSTRAINT fk_enemy_level FOREIGN KEY (level_id) REFERENCES Level(level_id),
    CONSTRAINT chk_enemy_hp CHECK (hp_start > 0),
    CONSTRAINT chk_enemy_speed CHECK (speed_start > 0),
    CONSTRAINT chk_enemy_damage CHECK (damage_start > 0)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- Table: MatchGame
CREATE TABLE MatchGame (
    match_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    player_id SMALLINT UNSIGNED NOT NULL,
    archetype_id SMALLINT UNSIGNED NOT NULL,
    life SMALLINT NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    duration_seconds SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    level_reached TINYINT UNSIGNED NOT NULL,
    final_fame SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    result ENUM('WIN', 'LOSE') NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (match_id),
    CONSTRAINT fk_match_player FOREIGN KEY (player_id) REFERENCES Player(player_id),
    CONSTRAINT fk_match_archetype FOREIGN KEY (archetype_id) REFERENCES Archetype(archetype_id),
    CONSTRAINT chk_match_duration CHECK (duration_seconds >= 0),
    CONSTRAINT chk_level_reached CHECK (level_reached BETWEEN 1 AND 3),
    CONSTRAINT chk_final_fame CHECK (final_fame >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: SpecificLevel — stats for each level inside a match
CREATE TABLE SpecificLevel (
    specific_level_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_id INT UNSIGNED NOT NULL,
    level_id SMALLINT UNSIGNED NOT NULL,
    enemy_id SMALLINT UNSIGNED NOT NULL,
    finished BOOL NOT NULL DEFAULT FALSE,
    level_card_id SMALLINT UNSIGNED NOT NULL,
    completion_time SMALLINT UNSIGNED NOT NULL,
    remaining_hp SMALLINT UNSIGNED NOT NULL,
    fame_gained SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (specific_level_id),
    CONSTRAINT fk_specificlevel_match FOREIGN KEY (match_id) REFERENCES MatchGame(match_id),
    CONSTRAINT fk_specificlevel_level FOREIGN KEY (level_id) REFERENCES Level(level_id),
    CONSTRAINT fk_specificlevel_enemy FOREIGN KEY (enemy_id) REFERENCES Enemy(enemy_id),
    CONSTRAINT fk_specificlevel_levelcard FOREIGN KEY (level_card_id) REFERENCES LevelCard(level_card_id),
    CONSTRAINT chk_completion_time CHECK (completion_time >= 0),
    CONSTRAINT chk_remaining_hp CHECK (remaining_hp > 0),
    CONSTRAINT chk_fame_gained CHECK (fame_gained > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Deck — cards currently in a player's deck
CREATE TABLE Deck (
    deck_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    specific_level_id INT UNSIGNED NOT NULL,
    card_id SMALLINT UNSIGNED NOT NULL,
    effect_duration SMALLINT UNSIGNED NOT NULL,
    use_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (deck_id),

    CONSTRAINT fk_deck_specificlevel
        FOREIGN KEY (specific_level_id) REFERENCES SpecificLevel(specific_level_id),

    CONSTRAINT fk_deck_card
        FOREIGN KEY (card_id) REFERENCES Card(card_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Level Card
-- Transition table to conect cards with specific level, cards earned during a run
CREATE TABLE LevelCard (
    level_card_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    player_id SMALLINT UNSIGNED NOT NULL,
    card_id  SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (level_card_id),
    CONSTRAINT fk_levelcard_player
        FOREIGN KEY (player_id) REFERENCES Player(player_id),
	CONSTRAINT fk_levelcard_card
    FOREIGN KEY (card_id) REFERENCES Card(card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Statistics
CREATE TABLE Statistics (
    statistics_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
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

-- & VIEW
-- View: general stats summary
CREATE VIEW vw_general_statistics AS
SELECT
    COUNT(DISTINCT p.player_id) AS total_players,
    COUNT(m.match_id) AS total_matches,
    SUM(CASE WHEN m.result = 'WIN' THEN 1 ELSE 0 END) AS total_wins,
    SUM(CASE WHEN m.result = 'LOSE' THEN 1 ELSE 0 END) AS total_losses,
    SUM(p.hearts) - COUNT(DISTINCT p.player_id) AS total_hearts_bought
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

-- View: match HUD — life, fame, level during a run
CREATE VIEW vw_match_hud AS
SELECT
    m.match_id,
    p.username,
    m.life,
    m.level_reached,
    m.final_fame,
    m.result
FROM MatchGame m
INNER JOIN Player p ON m.player_id = p.player_id;

-- View: level progress within a match
CREATE VIEW vw_match_progress AS
SELECT
    sl.match_id,
    l.level_number,
    sl.completion_time,
    sl.remaining_hp,
    sl.fame_gained,
    sl.finished
FROM SpecificLevel sl
INNER JOIN Level l ON sl.level_id = l.level_id;

-- View: cards active in a match (no longer needs Effect join — data is in Card)
CREATE VIEW vw_match_cards_live AS
SELECT
    d.deck_id,
    c.card_name,
    c.effect_type,
    d.use_time,
    c.duration
FROM Deck d
INNER JOIN Card c ON d.card_id = c.card_id;

-- This are User views and go on other tab
CREATE VIEW vw_player_profile AS
SELECT
    player_id,
    name,
    username,
    registration_date,
    total_runs,
    total_wins,
    total_losses
FROM Player;

-- View: player winrate
CREATE VIEW vw_player_winrate AS
SELECT
    player_id,
    username,
    total_runs,
    total_wins,
    total_losses,
    CASE
        WHEN total_runs = 0 THEN 0
        ELSE ROUND((total_wins / total_runs) * 100, 2)
    END AS winrate
FROM Player;

-- View: player match history
CREATE VIEW vw_player_match_history AS
SELECT
    m.match_id,
    p.username,
    m.start_time,
    m.end_time,
    m.duration_seconds,
    m.level_reached,
    m.final_fame,
    m.result
FROM MatchGame m
INNER JOIN Player p ON m.player_id = p.player_id;

-- View: total fame per player
CREATE VIEW vw_player_total_fame AS
SELECT
    p.player_id,
    p.username,
    COALESCE(SUM(m.final_fame), 0) AS total_fame
FROM Player p
LEFT JOIN MatchGame m ON p.player_id = m.player_id
GROUP BY p.player_id, p.username;

-- View: most used cards per player
CREATE VIEW vw_player_card_usage AS
SELECT
    p.username,
    c.card_name,
    COUNT(*) AS times_used
FROM Deck d
INNER JOIN SpecificLevel sl ON d.specific_level_id = sl.specific_level_id
INNER JOIN MatchGame m ON sl.match_id = m.match_id
INNER JOIN Player p ON m.player_id = p.player_id
INNER JOIN Card c ON d.card_id = c.card_id
GROUP BY p.username, c.card_name;

-- & TRIGGER
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

-- Trigger: update user count when a new player registers
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

-- Trigger: count card usage in Statistics
DELIMITER //
CREATE TRIGGER trg_after_insert_deck
AFTER INSERT ON Deck
FOR EACH ROW
BEGIN
    UPDATE Statistics
    SET user_movements_count = user_movements_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE statistics_id = 1;
END //

DELIMITER ;

-- & STORED PROCEDURES
-- Stored Procedure: get all matches by player
DELIMITER //
CREATE PROCEDURE GetMatchesByPlayer(IN in_player_id SMALLINT UNSIGNED)
BEGIN
    SELECT * FROM MatchGame WHERE player_id = in_player_id;
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

-- Stored Procedure: get cards by type (reads from Card directly)
DELIMITER //
CREATE PROCEDURE GetCardsByType(IN in_effect_type ENUM('POWER_UP', 'PUNISHMENT'))
BEGIN
    SELECT
        c.card_id,
        c.card_name,
        c.effect_type,
        c.effect_value,
        c.description
    FROM Card c
    WHERE c.effect_type = in_effect_type;
END //
DELIMITER ;

-- Stored Procedure: match summary for score scene
DELIMITER //
CREATE PROCEDURE GetMatchSummary(IN in_match_id INT UNSIGNED)
BEGIN
    SELECT
        m.match_id,
        p.name AS player_name,
        a.name AS archetype,
        m.duration_seconds,
        m.level_reached,
        m.final_fame,
        m.life,
        m.result,
        COUNT(sl.specific_level_id) AS levels_played,
        SUM(sl.fame_gained) AS total_fame_from_levels
    FROM MatchGame m
    INNER JOIN Player p ON m.player_id = p.player_id
    INNER JOIN Archetype a ON m.archetype_id = a.archetype_id
    LEFT JOIN SpecificLevel sl ON m.match_id = sl.match_id
    WHERE m.match_id = in_match_id
    GROUP BY m.match_id;
END //
DELIMITER ;

-- Stored Procedure: get cards used in a match
DELIMITER //
CREATE PROCEDURE GetCardsUsedInMatch(IN in_match_id INT UNSIGNED)
BEGIN
    SELECT
        d.deck_id,
        c.card_name,
        c.effect_type,
        d.use_time,
        c.duration
    FROM Deck d
    INNER JOIN Card c ON d.card_id = c.card_id
    WHERE m.match_id = in_match_id
    ORDER BY d.use_time;
END //
DELIMITER ;

-- VIEW CURRENT STATS
CREATE OR REPLACE VIEW vw_player_current_state AS
SELECT
    p.player_id,
    p.username,

    -- datos del último match
    m.match_id,
    m.level_reached AS current_level,
    m.final_fame AS current_fame,

    -- agregados del match
    IFNULL(sl.enemy_kills, 0) AS enemy_kills,
    IFNULL(d.cards_in_deck, 0) AS cards_in_deck,

    -- stats generales
    p.total_runs,
    p.total_wins,
    p.total_losses

FROM Player p

--  último match
LEFT JOIN MatchGame m 
    ON m.match_id = (
        SELECT MAX(match_id)
        FROM MatchGame
        WHERE player_id = p.player_id
    )

--  kills (subquery separada)
LEFT JOIN (
    SELECT
        m.player_id,
        m.match_id,
        SUM(CASE WHEN sl.finished = TRUE THEN 1 ELSE 0 END) AS enemy_kills
    FROM MatchGame m
    LEFT JOIN SpecificLevel sl ON m.match_id = sl.match_id
    GROUP BY m.match_id
) sl ON sl.match_id = m.match_id

--  deck count (subquery separada)
LEFT JOIN (
    SELECT
        sl.match_id,
        COUNT(DISTINCT d.deck_id) AS cards_in_deck
    FROM SpecificLevel sl
    LEFT JOIN Deck d ON sl.specific_level_id = d.specific_level_id
    GROUP BY sl.match_id
) d ON d.match_id = m.match_id;

-- restores all the settings that were saved at the beginning
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;
SHOW TABLES;
TRUNCATE TABLE Enemy;
SELECT * FROM Enemy;
SELECT * FROM Player;

