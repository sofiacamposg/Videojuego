CREATE DATABASE IF NOT EXISTS gladiator;
USE gladiator;

-- Table: Player
-- Stores player account data, demographic/basic information, and general counters
CREATE TABLE Player (
    player_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- Table: Card
-- Stores cards, effect and details for the js code 
CREATE TABLE Card (
    card_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    card_name VARCHAR(40) NOT NULL UNIQUE,
    description VARCHAR(120) NOT NULL,
    type ENUM('TEMPORARY', 'PERMANENT') NOT NULL,
    effect_from VARCHAR(6) NOT NULL,
    effect_modifies VARCHAR(15) NOT NULL,
    effect_operator CHAR 
    effect_to VARCHAR(6) NOT NOT,
    value_effect FLOAT(5) NOT NULL,
    duration SMALLINT NOT NULL
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (card_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- Table: Enemy
-- Keeps the enemy catalog used by the game
CREATE TABLE Enemy (
    enemy_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    level_id SMALLINT UNSIGNED NOT NULL,
    enemy_name VARCHAR(30) NOT NULL UNIQUE,
    hp_start SMALLINT UNSIGNED NOT NULL,
    speed_start SMALLINT UNSIGNED NOT NULL,
    damage_start SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (enemy_id),
    CONSTRAINT fk_enemy_level
        FOREIGN KEY (level_id) REFERENCES Level(level_id),
    CONSTRAINT chk_enemy_hp CHECK (hp_start > 0),
    CONSTRAINT chk_enemy_speed CHECK (speed_start > 0),
    CONSTRAINT chk_enemy_damage CHECK (damage_start > 0)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: SpecificLevel
-- Stores stats for a specific level inside one match
CREATE TABLE SpecificLevel (
    specific_level_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    match_id INT UNSIGNED NOT NULL,
    level_id SMALLINT UNSIGNED NOT NULL,
    enemy_id SMALLINT UNSIGNED NOT NULL,
    level_card_id SMALLINT UNSIGNED NOT NULL,
    completion_time SMALLINT UNSIGNED NOT NULL,
    remaining_hp SMALLINT UNSIGNED NOT NULL,
    fame_gained SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (specific_level_id),
    CONSTRAINT fk_specificlevel_match
        FOREIGN KEY (match_id) REFERENCES MatchGame(match_id),
    CONSTRAINT fk_specificlevel_level
        FOREIGN KEY (level_id) REFERENCES Level(level_id),
    CONSTRAINT fk_enemy_level
        FOREIGN KEY (enemy_id) REFERENCES Enemy(enemy_id),
    CONSTRAINT fk_levelcard
        FOREIGN KEY (level_card_id) REFERENCES LevelCard(level_card_id),
    CONSTRAINT chk_completion_time CHECK (completion_time >= 0),
    CONSTRAINT chk_remaining_hp CHECK (remaining_hp > 0),
    CONSTRAINT chk_fame_gained CHECK (fame_gained > 0),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Deck
-- Renamed from used card table, Stores which cards are on players deck
CREATE TABLE Deck (
    deck_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    card_id SMALLINT UNSIGNED NOT NULL,
    player_id SMALLINT UNSIGNED NOT NULL,
    quantity SMALLINT NOT NULL DEFAULT 0,
    use_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (deck_id),
    CONSTRAINT fk_players_deck
        FOREIGN KEY (player_id) REFERENCES Player(player_id),
    CONSTRAINT fk_deck_card
        FOREIGN KEY (card_id) REFERENCES Card(card_id),
    CONSTRAINT chk_quantity CHECK (quantity < 6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Level Card
-- Transition table to conect cards with specific level, cards earned during a run
CREATE TABLE LevelCard (
    level_card_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    card_id  SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (level_card_id),
    CONSTRAINT fk_players_deck
        FOREIGN KEY (player_id) REFERENCES Player(player_id),
)

-- Table: Statistics
-- Stores general game stats, login count, user activity, and admin log info
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

----& VIEW
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

-- VIEW FOR OUL LIFE STATS
-- This shows life, fame and current level
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

-- This one shows progress, the stats while we were pplaying
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

-- We can use this one to show  if we are currently using a card(effect)
CREATE VIEW vw_match_cards_live AS
SELECT
    d.specific_level_id,
    c.card_name,
    e.effect_type,
    d.use_time,
    d.effect_duration
FROM Deck d
INNER JOIN Card c ON d.card_id = c.card_id
INNER JOIN Effect e ON c.effect_id = e.effect_id;

--This are User views and go on other tab
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

-- This one is like the winrate
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

-- This works for the admin and user, is the player match history
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

-- This one is the total fame acumulated
CREATE VIEW vw_player_total_fame AS
SELECT
    p.player_id,
    p.username,
    COALESCE(SUM(m.final_fame), 0) AS total_fame
FROM Player p
LEFT JOIN MatchGame m ON p.player_id = m.player_id
GROUP BY p.player_id, p.username;

-- This also works both for the admin and user because it shows which cards the user uses the most
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


-------& TRIGGER
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

-- Trigger: each time a card is registered as used in Deck, add 1 to user_movement_count
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
-- Trigger: Validate an effect is not terporary and permanent at the same time
DELIMITER //

CREATE TRIGGER trg_before_insert_temporaryeffect
BEFORE INSERT ON TemporaryEffect
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM PermanentEffect
        WHERE effect_id = NEW.effect_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An effect cannot be both temporary and permanent.';
    END IF;
END //

DELIMITER ;

-- Trigger: Validate an effect is not terporary and permanent at the same time
DELIMITER //

CREATE TRIGGER trg_before_insert_permanenteffect
BEFORE INSERT ON PermanentEffect
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM TemporaryEffect
        WHERE effect_id = NEW.effect_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An effect cannot be both permanent and temporary.';
    END IF;
END //

DELIMITER ;

--& STORED PROCEDURES
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

--Obbtains cards for effect type (POWER UP OR PUNISHMENT)
DELIMITER //

CREATE PROCEDURE GetCardsByType(IN in_effect_type ENUM('POWER_UP', 'PUNISHMENT'))
BEGIN
    SELECT
        c.card_id,
        c.card_name,
        e.effect_name,
        e.effect_type,
        e.effect_value,
        e.description
    FROM Card c
    INNER JOIN Effect e ON c.effect_id = e.effect_id
    WHERE e.effect_type = in_effect_type;
END //

DELIMITER ;

-- Stored procedure to get a match summary, for our socre scene
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
        SUM(sl.fame_gained) AS total_fame_from_levels,
        SUM(sl.powerups_obtained) AS total_powerups,
        SUM(sl.punishments_obtained) AS total_punishments
    FROM MatchGame m
    INNER JOIN Player p ON m.player_id = p.player_id
    INNER JOIN Archetype a ON m.archetype_id = a.archetype_id
    LEFT JOIN SpecificLevel sl ON m.match_id = sl.match_id
    WHERE m.match_id = in_match_id
    GROUP BY m.match_id;
END //

DELIMITER ;

--Stored procedure to get used cards in a match
DELIMITER //

CREATE PROCEDURE GetCardsUsedInMatch(IN in_match_id INT UNSIGNED)
BEGIN
    SELECT
        m.match_id,
        sl.specific_level_id,
        l.level_number,
        c.card_name,
        e.effect_name,
        e.effect_type,
        d.use_time,
        d.effect_duration
    FROM MatchGame m
    INNER JOIN SpecificLevel sl ON m.match_id = sl.match_id
    INNER JOIN Level l ON sl.level_id = l.level_id
    INNER JOIN Deck d ON sl.specific_level_id = d.specific_level_id
    INNER JOIN Card c ON d.card_id = c.card_id
    INNER JOIN Effect e ON c.effect_id = e.effect_id
    WHERE m.match_id = in_match_id
    ORDER BY l.level_number, d.use_time;
END //

DELIMITER ;