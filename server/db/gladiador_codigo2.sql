CREATE DATABASE IF NOT EXISTS gladiator;
USE gladiator;

-- Table: Player
-- Stores user account and demographic information
CREATE TABLE Player (
    player_id SMALLINT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Archetype
-- Defines initial stats for each playable class
CREATE TABLE Archetype (
    archetype_id SMALLINT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    base_hp SMALLINT UNSIGNED DEFAULT 100,
    base_speed SMALLINT UNSIGNED DEFAULT 5,
    base_damage SMALLINT UNSIGNED DEFAULT 10,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (archetype_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default archetypes
INSERT INTO Archetype VALUES
(1,'Warrior',120,5,20,NOW()),
(2,'Lancer',100,6,25,NOW()),
(3,'Tank',150,3,15,NOW());

-- Table: Level
-- Stores level information and target completion time
CREATE TABLE Level (
    level_id SMALLINT UNSIGNED AUTO_INCREMENT,
    level_number TINYINT NOT NULL UNIQUE,
    description VARCHAR(100),
    target_time SMALLINT UNSIGNED NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (level_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert levels
INSERT INTO Level VALUES
(1,1,'Colosseum Entry',30,NOW()),
(2,2,'Intermediate Battle',30,NOW()),
(3,3,'Final Arena',30,NOW());

-- Table: Effect
-- Represents the logic behind cards (power-ups or punishments)
CREATE TABLE Effect (
    effect_id SMALLINT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(50),
    type ENUM('POWER_UP','PUNISHMENT') NOT NULL,
    is_temporary BOOLEAN NOT NULL,
    description VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (effect_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: TemporaryEffect
-- Stores duration for temporary effects
CREATE TABLE TemporaryEffect (
    effect_id SMALLINT UNSIGNED,
    duration SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (effect_id),
    CONSTRAINT fk_temp_effect FOREIGN KEY (effect_id) REFERENCES Effect(effect_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: PermanentEffect
-- Used for effects that have no duration
CREATE TABLE PermanentEffect (
    effect_id SMALLINT UNSIGNED,
    PRIMARY KEY (effect_id),
    CONSTRAINT fk_perm_effect FOREIGN KEY (effect_id) REFERENCES Effect(effect_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Card
-- Represents cards that reference a specific effect
CREATE TABLE Card (
    card_id SMALLINT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE,
    description VARCHAR(100),
    effect_id SMALLINT UNSIGNED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (card_id),
    CONSTRAINT fk_card_effect FOREIGN KEY (effect_id) REFERENCES Effect(effect_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Match
-- Stores each game run and whether it was won or lost
CREATE TABLE Match (
    match_id INT AUTO_INCREMENT,
    player_id SMALLINT UNSIGNED,
    archetype_id SMALLINT UNSIGNED,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    result ENUM('WIN','LOSE') NOT NULL,
    level_reached TINYINT,
    final_fame SMALLINT DEFAULT 0,
    lives TINYINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (match_id),
    CONSTRAINT fk_match_player FOREIGN KEY (player_id) REFERENCES Player(player_id),
    CONSTRAINT fk_match_archetype FOREIGN KEY (archetype_id) REFERENCES Archetype(archetype_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: LevelProgress
-- Tracks player performance within each level of a match
CREATE TABLE LevelProgress (
    level_progress_id INT AUTO_INCREMENT,
    match_id INT,
    level_id SMALLINT UNSIGNED,
    completion_time SMALLINT,
    remaining_hp SMALLINT,
    fame_gained SMALLINT,
    completed BOOLEAN,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (level_progress_id),
    CONSTRAINT fk_lp_match FOREIGN KEY (match_id) REFERENCES Match(match_id),
    CONSTRAINT fk_lp_level FOREIGN KEY (level_id) REFERENCES Level(level_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Deck
-- Stores cards used during gameplay (previously cartaUsada)
CREATE TABLE Deck (
    deck_id INT AUTO_INCREMENT,
    level_progress_id INT,
    card_id SMALLINT UNSIGNED,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (deck_id),
    CONSTRAINT fk_deck_lp FOREIGN KEY (level_progress_id) REFERENCES LevelProgress(level_progress_id),
    CONSTRAINT fk_deck_card FOREIGN KEY (card_id) REFERENCES Card(card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: Statistics
-- Stores global game metrics for admin dashboards
CREATE TABLE Statistics (
    stat_id INT AUTO_INCREMENT,
    total_users INT DEFAULT 0,
    total_matches INT DEFAULT 0,
    total_logins INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (stat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert dummy data for testing API
INSERT INTO Player (name, username, password)
VALUES ('Sofia','sofi123','hashed_pass');

INSERT INTO Effect (name,type,is_temporary,description)
VALUES ('Rage','POWER_UP',1,'Increase damage');

INSERT INTO TemporaryEffect VALUES (1,10);

INSERT INTO Card (name,description,effect_id)
VALUES ('Rage Card','Boost damage',1);

-- View for quick statistics dashboard
CREATE VIEW stats_view AS
SELECT 
    COUNT(DISTINCT player_id) AS total_players,
    COUNT(*) AS total_matches
FROM Match;

-- Stored procedure to get all matches from a player
DELIMITER //
CREATE PROCEDURE get_player_matches(IN id SMALLINT)
BEGIN
    SELECT * FROM Match WHERE player_id = id;
END //
DELIMITER ;

-- Trigger to update total matches automatically
DELIMITER //
CREATE TRIGGER after_match_insert
AFTER INSERT ON Match
FOR EACH ROW
BEGIN
    UPDATE Statistics
    SET total_matches = total_matches + 1;
END //
DELIMITER ;