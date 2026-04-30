//& server.js
//& REST API server for the Gladiator game — handles all communication between
//& the game client and the MySQL database via Express routes
//& Covers authentication, game logic, player stats, card system and shop mechanics

//===== IMPORTS =====
const express = require("express");
const mysql = require("mysql2");
const app = express();

//===== CONFIG =====
const cors = require("cors");
app.use(cors());
app.use(express.json());

/*
* HOW TO SET UP THE DATABASE (run these in the terminal):
*
* sudo mysql
* CREATE USER 'gladiator'@'localhost' IDENTIFIED BY 'gladiator123';
*   — creates a user named gladiator that connects from this machine with password gladiator123
* GRANT ALL PRIVILEGES ON gladiator.* TO 'gladiator'@'localhost';
*   — gives the gladiator user full access to all tables in the gladiator database
* FLUSH PRIVILEGES;
*   — applies permission changes immediately
* exit;
*   — return to the normal terminal
* sudo mysql < ~/path/to/project/server/db/gladiador_codigo2.sql
*   — loads the schema (update the path to match your project location)
*
* Then start the API:
* cd ~/path/to/project/server
* node server.js
* — should print: Servidor en http://localhost:3000 and MySQL conectado
*/

//===== DB CONNECTION =====
const db = mysql.createConnection({
    host: "localhost",
    user: "gladiator",      // general user
    password: "gladiator123", // general password
    database: "gladiator",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//===== CONNECT =====
db.connect((err) => {
    if (err) {
        console.log("Error MySQL:", err);
        return;
    }
    console.log("MySQL conectado");
});

//===== ROUTES =====

//* returns all players — used for debugging and admin purposes
app.get("/players", (req, res) => {
    console.log("ENTRÓ A /players");
    db.query("SELECT * FROM Player", (err, result) => {
        if (err) {
            console.log("ERROR:", err);
            res.send(err.message);
            return;
        }
        res.json(result);
    });
});

//* handles login for both admins and regular players
//* checks Statistics table first — if found, returns admin role
//* if not found there, checks Player table for regular login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    //? case 1: check if credentials match an admin in the Statistics table
    db.query("SELECT * FROM Statistics WHERE username = ? AND password = ?", [username, password], (err, adminResult) => {
        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.status(500).send("Server error");
        }

        //? case 2: admin found — return their data with role flag
        if (adminResult.length > 0) {
            console.log("ADMIN LOGGED:", adminResult[0]);
            return res.json({ ...adminResult[0], role: "admin" });
        }

        //? case 3: not an admin — check the Player table
        db.query("SELECT * FROM Player WHERE username = ? AND password = ?", [username, password], (err, playerResult) => {
            if (err) {
                console.log("MYSQL ERROR:", err);
                return res.status(500).send("Server error");
            }

            //? case 4: credentials not found in either table
            if (playerResult.length === 0) {
                return res.status(401).send("Invalid credentials");
            }

            //? case 5: regular player found — return their data with role flag
            console.log("USER LOGGED:", playerResult[0]);
            return res.json({ ...playerResult[0], role: "player" });
        });
    });
});

//* registers a new user — admins use the @dm1n_ prefix, regular players register normally
//* admin prefix is stripped before storing the username in Statistics
app.post("/register", (req, res) => {
    const { username, password, name } = req.body;

    //? admin registration — username must start with @dm1n_
    if (username.startsWith("@dm1n_")) {
        const cleanUsername = username.slice(6);  // strip the 6-char prefix
        db.query("SELECT * FROM Statistics WHERE username = ?", [cleanUsername], (err, result) => {
            if (err) return res.status(500).send("Server error");
            if (result.length > 0) return res.status(400).send("Admin already exists");
            db.query("INSERT INTO Statistics (name, username, password) VALUES (?, ?, ?)", [name, cleanUsername, password], (err) => {
                if (err) return res.status(500).send("Insert error");
                console.log("ADMIN CREATED:", cleanUsername);
                return res.json({ success: true, role: "admin" });
            });
        });
        return;  // stop here so the player registration code below doesn't run
    }

    //? regular player registration — check for duplicate username first
    db.query("SELECT * FROM Player WHERE username = ?", [username], (err, result) => {
        if (err) return res.status(500).send("Server error");
        if (result.length > 0) return res.status(400).send("User already exists");
        db.query("INSERT INTO Player (name, username, password) VALUES (?, ?, ?)", [name, username, password], (err, insertResult) => {
            if (err) return res.status(500).send("Insert error");
            console.log("USER CREATED:", username);
            db.query("SELECT * FROM Player WHERE player_id = ?", [insertResult.insertId], (err2, playerResult) => {
                if (err2) return res.status(500).send("Fetch error");
                return res.json({ ...playerResult[0], role: "player" });
            });
        });
    });
});

//* returns all archetypes from the DB — used by the character select scene
app.get("/archetypes", (req, res) => {
    console.log("GET /archetypes");
    db.query("SELECT * FROM Archetype", (err, result) => {
        if (err) {
            console.log("QUERY ERROR:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Sending:", result);
        res.json(result);
    });
});

//===== GAME LOGIC =====

//* returns 15 random cards from the Card table — used for mid-game card events and rewards
//* Effect table was merged into Card so all effect data is available in one query
app.get("/cards/random", (req, res) => {
    const query = `
        SELECT
            card_id,
            card_name,
            description,
            effect_type,
            duration_type,
            effect_from,
            effect_modifies,
            effect_operator,
            effect_reverse_operator,
            value_effect,
            reverse_value,
            duration
        FROM Card
        ORDER BY RAND()
        LIMIT 15
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

//* returns a full match summary for the score scene — player name, level, fame, time and result
app.get("/match/summary/:id", (req, res) => {
    const matchId = req.params.id;
    console.log("GET SUMMARY FOR:", matchId);

    const query = `
        SELECT 
            m.match_id,
            p.name AS player_name,
            m.level_reached,
            m.final_fame,
            m.duration_seconds,
            m.result
        FROM MatchGame m
        JOIN Player p ON m.player_id = p.player_id
        WHERE m.match_id = ?
    `;

    db.query(query, [matchId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Match not found" });
        }
        console.log("SUMMARY DATA:", result[0]);
        res.json(result[0]);
    });
});

//* returns level-by-level progress for a match via the vw_match_progress view
app.get("/match/progress/:id", (req, res) => {
    db.query(
        "SELECT * FROM vw_match_progress WHERE match_id = ?",
        [req.params.id],
        (err, result) => { 
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//* returns all cards used in a match via the vw_match_cards_live view
//* subquery first finds all levels belonging to the match, then fetches their cards
app.get("/match/cards-live/:id", (req, res) => {
    db.query(
        `SELECT * FROM vw_match_cards_live 
         WHERE specific_level_id IN (
             SELECT specific_level_id 
             FROM SpecificLevel 
             WHERE match_id = ?
         )`,
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//* saves a completed match to the MatchGame table
//* the trg_after_insert_match trigger automatically updates Player stats after this insert
app.post("/match", (req, res) => {
    const {
        player_id,
        archetype_id,
        duration_seconds,
        level_reached,
        final_fame,
        life,
        result
    } = req.body;

    const query = `
        INSERT INTO MatchGame 
        (player_id, archetype_id, end_time, duration_seconds, level_reached, final_fame, life, result)
        VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)
    `;

    const values = [player_id, archetype_id, duration_seconds, level_reached, final_fame, life, result];

    db.query(query, values, (err, resultInsert) => {
        if (err) return res.status(500).send(err.message);
        res.json({
            success: true,
            match_id: resultInsert.insertId  // returned so the score scene can fetch summary data
        });
    });
});

//* records a card usage in the Deck table
//* the trg_after_insert_deck trigger updates the user_movements_count in Statistics
app.post("/deck", (req, res) => {
    const { specific_level_id, card_id, effect_duration } = req.body;

    const query = `
        INSERT INTO Deck (specific_level_id, card_id, effect_duration)
        VALUES (?, ?, ?)
    `;

    db.query(query, [specific_level_id, card_id, effect_duration], (err) => {
        if (err) return res.status(500).send(err.message);
        res.json({ success: true });
    });
});

//* returns basic player profile data via the vw_player_profile view
app.get("/player/profile/:id", (req, res) => {
    db.query(
        "SELECT * FROM vw_player_profile WHERE player_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//* returns win rate data for a player via the vw_player_winrate view
app.get("/player/winrate/:id", (req, res) => {
    db.query(
        "SELECT * FROM vw_player_winrate WHERE player_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//* returns full match history for a player via the vw_player_match_history view
app.get("/player/history/:username", (req, res) => {
    db.query(
        "SELECT * FROM vw_player_match_history WHERE username = ?",
        [req.params.username],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//* returns total fame for a player via the vw_player_total_fame view
app.get("/player/fame/:id", (req, res) => {
    db.query(
        "SELECT * FROM vw_player_total_fame WHERE player_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//* returns card usage history for a player via the vw_player_card_usage view
app.get("/player/cards/:username", (req, res) => {
    db.query(
        "SELECT * FROM vw_player_card_usage WHERE username = ?",
        [req.params.username],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//===== ADMIN =====

//* returns global game statistics via the vw_general_statistics view — admin only
app.get("/stats", (req, res) => {
    db.query("SELECT * FROM vw_general_statistics", (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

//* returns live player state — fame, total runs, wins, losses, kills and cards
//* reads directly from Player table for fame instead of MatchGame to stay in sync with the shop
app.get("/player/live/:id", (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT 
            p.player_id,
            p.username,
            p.fame AS current_fame,
            (SELECT COUNT(*) FROM MatchGame WHERE player_id = p.player_id) AS total_runs,
            (SELECT COUNT(*) FROM MatchGame WHERE player_id = p.player_id AND result = 'WIN') AS total_wins,
            (SELECT COUNT(*) FROM MatchGame WHERE player_id = p.player_id AND result = 'LOSE') AS total_losses,
            0 AS enemy_kills,
            0 AS cards_in_deck,
            0 AS current_level,
            p.galen
        FROM Player p
        WHERE p.player_id = ?
    `;

    db.query(query, [id], (err, result) => {
        console.log("RESULT:", result);
        console.log("ERROR:", err);
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
        //for new users
        if (result.length === 0) {
            return res.json({
                player_id: id,
                username: "",
                current_fame: 0,
                total_runs: 0,
                total_wins: 0,
                total_losses: 0,
                enemy_kills: 0,
                cards_in_deck: 0,
                current_level: 0
            });
        }

        res.json(result[0]);
    });
});

//===== LEVEL CONFIG =====

//* returns all enemies from the DB — used by levelConfig.js to build enemy configs
app.get("/enemies", (req, res) => {
    db.query("SELECT * FROM Enemy", (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

//* returns all levels from the DB — used by levelConfig.js to build level configs
app.get("/levels", (req, res) => {
    db.query("SELECT * FROM Level", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
        res.json(result);
    });
});

//===== STATS PAGE =====

//* returns aggregated stats for a single player — used by the stats page and record modal
app.get("/player/stats/:id", (req, res) => {
    const playerId = req.params.id;

    const query = `
        SELECT 
            COUNT(m.match_id) as total_runs,
            SUM(m.result = 'WIN') as total_wins,
            SUM(m.result = 'LOSE') as total_losses,
            COALESCE(AVG(m.duration_seconds), 0) as avg_duration,
            COALESCE(MAX(m.final_fame), 0) as best_score,
            COALESCE(SUM(
                (SELECT COUNT(*) 
                FROM SpecificLevel sl 
                WHERE sl.match_id = m.match_id AND sl.finished = TRUE)
            ), 0) as total_kills
        FROM MatchGame m
        WHERE m.player_id = ?
    `;

    db.query(query, [playerId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.json(result[0]);
    });
});

//* returns aggregated stats across all players and matches — used by the admin stats page
app.get("/global/stats", (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM Player) AS players,
            COUNT(m.match_id) AS matches,
            SUM(m.result = 'WIN') AS wins,
            SUM(m.result = 'LOSE') AS losses,
            COALESCE(AVG(m.duration_seconds), 0) AS avg_duration,
            COALESCE(MAX(m.final_fame), 0) AS best_score,
            COALESCE(
                AVG(
                    (SELECT COUNT(*)
                    FROM SpecificLevel sl
                    WHERE sl.match_id = m.match_id AND sl.finished = TRUE)
                ), 0
            ) AS avg_kills,
            (SELECT SUM(hearts) - COUNT(*) FROM Player) AS total_hearts_bought
        FROM MatchGame m
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.json(result[0]);
    });
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000 ");
});

//===== SHOP =====

//* handles heart purchases — validates fame server-side before updating the player
//* deducts 50 fame and adds 1 heart — returns updated values to the client
app.post("/shop/buy-heart", (req, res) => {
    const { player_id } = req.body;

    //? fetch current fame and hearts to validate before updating
    db.query(
        "SELECT fame, hearts FROM Player WHERE player_id = ?",
        [player_id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);

            if (result.length === 0) {
                return res.status(404).json({ error: "Player not found" });
            }

            const player = result[0];

            //? not enough fame — reject the purchase
            if (player.fame < 50) {
                return res.status(400).json({ error: "Not enough fame" });
            }

            //? update fame and hearts in a single query
            db.query(
                `UPDATE Player
                 SET fame = fame - 50,
                     hearts = hearts + 1
                 WHERE player_id = ?`,
                [player_id],
                (err2) => {
                    if (err2) return res.status(500).send(err2.message);

                    //? return updated values so the client can update its state without a refetch
                    res.json({
                        success: true,
                        fame: player.fame - 50,
                        hearts: player.hearts + 1
                    });
                }
            );
        }
    );
});

//* buy galen's remedy, like a shield that can 'save' the player
app.post("/shop/buy-galen", (req, res) => {
    const { player_id } = req.body;

    db.query("SELECT fame, galen FROM Player WHERE player_id = ?", [player_id], (err, result) => {
        if (err) return res.status(500).send(err.message);  //? case1: edge case
        if (result.length === 0) return res.status(404).json({ error: "Player not found" });  //?case2: edge case

        const player = result[0];  //first result that match
        if (player.fame < 30) //? case3: not enough fame
            return res.status(400).json({ error: "Not enough fame" });  

        db.query(  //? case4: player bought galen's remedy
            "UPDATE Player SET fame = fame - 30, galen = galen + 1 WHERE player_id = ?",
            [player_id],
            (err2) => {
                if (err2) return res.status(500).send(err2.message);
                res.json({ success: true, fame: player.fame - 30, galen: player.galen + 1 });
            }
        );
    });
});

//* the player used the galen's remedy in the match
app.post("/player/use-galen", (req, res) => {
    const { player_id } = req.body;  //which player used the remedy?

    db.query(  //? case1: update quantity of remedies
        "UPDATE Player SET galen = galen - 1 WHERE player_id = ?",
        [player_id],
        (err) => {
            if (err) return res.status(500).send(err.message);  //? case2: edge case
            res.json({ success: true });
        }
    );
});

app.post("/player/update-fame", (req, res) => {
    const { player_id, fame } = req.body;

    //? validate that both required fields are present
    if (!player_id || fame == null) {
        return res.status(400).json({ error: "Missing data" });
    }

    db.query(
        "UPDATE Player SET fame = fame + ? WHERE player_id = ?",
        [fame, player_id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);

            //? player not found — no rows were affected
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Player not found" });
            }

            res.json({ success: true });
        }
    );
});