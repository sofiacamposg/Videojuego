//=====IMPORTS=====
const express = require("express");
const mysql = require("mysql2");
const app = express();
//=====CONFIG=====
const cors = require("cors");
app.use(cors());
app.use(express.json());

/* entra a mysql desde la terminal (sudo mysql) y pon los comandos:
* CREATE USER 'gladiator'@'localhost' IDENTIFIED BY 'gladiator123';
que hace? crea un usuario llamado gladiator que se conecta desde esta misma computadora, con contraseña gladiator123
* GRANT ALL PRIVILEGES ON gladiator.* TO 'gladiator'@'localhost';
que hace? dale todos los permisos sobre la base de datos gladiator 
(el .* es "todas las tablas de esa base de datos") al usuario gladiator
* FLUSH PRIVILEGES;
que hace? aplica los cambios de permisos inmediatamente 
* exit;
que hace? sal de MySQL y regresa a la terminal normal
* sudo mysql < ~/ruta/a/su/proyecto/server/db/gladiador_codigo2.sql
que hace? carga el schema (cambian la ruta por la suya)
y ya luego encienden la api
* cd ~/ruta/a/su/proyecto/server
* node server.js
si jala tiene que salir lo de Servidor en 'link' MySQL conectado
*/

//=====DB CONNECTION =======
const db = mysql.createConnection({
    host: "localhost",
    user: "gladiator",  //general user
    password: "gladiator123",  //general password
    database: "gladiator",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
//=======CONNECT========
db.connect((err) => {
    if (err) {
        console.log("Error MySQL:", err);
        return;
    }
    console.log("MySQL conectado");
});
//======ROUTES (GET AND POST)========

//GET all from 'Players' for log in and create account
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

//POST Log In
app.post("/login", (req, res) => {

    const { username, password } = req.body; //Fields from Player

    const query = `
        SELECT * FROM Player
        WHERE username = ? AND password = ? 
    `; // AND condition 

    db.query(query, [username, password], (err, result) => {

        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.status(500).send("Server error");
        }

        if (result.length === 0) {
            return res.status(401).send("Invalid credentials");
        }

        console.log("USER LOGGED:", result[0]);

        res.json(result[0]); // Return User
    });
});

//POST create account
app.post("/register", (req, res) => {
    const { username, password, name } = req.body; //Fields from Player we want to fill
    const checkQuery = `SELECT * FROM Player WHERE username = ?`;
    db.query(checkQuery, [username], (err, result) => {
        if (err) return res.status(500).send("Server error");
        if (result.length > 0) return res.status(400).send("User already exists"); //If User already exists message error
        const insertQuery = ` 
            INSERT INTO Player (name, username, password)
            VALUES (?, ?, ?)
        `; //Else do an Insert in the predetermined fields
        db.query(insertQuery, [name, username, password], (err) => {
            if (err) return res.status(500).send("Insert error");
            console.log("USER CREATED:", username);
            res.json({ success: true });
        });
    });
});

// GET Archetypes for select scene
app.get("/archetypes", (req, res) => {
    console.log("GET /archetypes");
//Select all from table Archetypes
    db.query("SELECT * FROM Archetype", (err, result) => {
        if (err) {
            console.log("QUERY ERROR:", err);
            return res.status(500).json({ error: err.message });
        }

        console.log("Sending:", result);
        res.json(result);
    });
});

//=======================GAME LOGIC==============================
//Get card for random card effect event
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
    `; //Retrieves 15 random cards directly from the Card table (Effect table was merged into Card)
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message }); //send proper error status so the frontend catch picks it up
        }

        res.json(result);
    });
});

//GET real time stats view
app.get("/match/hud/:id", (req, res) => {
    db.query( //Select all from the view 
        "SELECT * FROM vw_match_hud WHERE match_id = ?",
        [req.params.id], //This retrieves the current match status for the player, to display on the screen while tha player is playing
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//GET Game Progress view
app.get("/match/progress/:id", (req, res) => {
    db.query(
        "SELECT * FROM vw_match_progress WHERE match_id = ?",
        [req.params.id], //Retrieves the progress of each LEVEL within the match, tracks progression
        (err, result) => { 
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//GET active cards view
app.get("/match/cards-live/:id", (req, res) => {
    db.query(
        `SELECT * FROM vw_match_cards_live 
         WHERE specific_level_id IN (
             SELECT specific_level_id 
             FROM SpecificLevel 
             WHERE match_id = ?
         )`,
        [req.params.id], //Retrieves all cards currently in use or were used in a match, including their active effects
                        //In the sub-query first gets all levels that belong to the match
                        //Then gets all cards used in those levels
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

//POST match, with stored procedures
app.post("/match", (req, res) => { //we INSERT into table match
    const {
        player_id,
        archetype_id,
        duration_seconds,
        level_reached,
        final_fame,
        life,
        result
    } = req.body;

    db.query( //Stored Procedure InsertMatch with current match values
        "CALL InsertMatch(?, ?, ?, ?, ?, ?, ?)",
        [
            player_id,
            archetype_id,
            duration_seconds,
            level_reached,
            final_fame,
            life,
            result
        ],
        (err) => {
            if (err) return res.status(500).send(err.message);

            res.json({ success: true });
        }
    );
});

//================== STORED PROCEDURES====================0
//GET summarizes an entire match, for scoreScene, you can get a full summary of the match after it ends
app.get("/match/summary/:id", (req, res) => {
    db.query(
        "CALL GetMatchSummary(?)",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);

            res.json(result[0][0]);
        }
    );
});

//POST, register card ussage (Deck)
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

//GET player stats view (this goes on another tab)
app.get("/player/profile/:id", (req, res) => {
    db.query(
        "SELECT * FROM vw_player_profile WHERE player_id = ?",
        [req.params.id], // Retrieves basic profile information of a player,
                        // including name, username, and overall stats (runs, wins, losses)
                        // Used for account info and general stats overview
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});
// Winrate view useful from current Player
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

//Match history  view from current Player
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

//Total fame view from Current Player
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

//General card usage from the Player along the game
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

//================== GLOBAL STATS FROM ADMIN (another tab) ====================
app.get("/stats", (req, res) => {
    db.query("SELECT * FROM vw_general_statistics", (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

//================== PLAYER CURRENT STATE ====================
app.get("/player/live/:id", (req, res) => {
    db.query(
        "SELECT * FROM vw_player_current_state WHERE player_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                console.log("ERROR:", err);
                return res.status(500).send(err.message);
            }

            if (result.length === 0) {
                return res.status(404).json({ error: "Player not found" });
            }

            res.json(result[0]);
        }
    );
});

//LEVEL CONFIGS, ARCHETYPE, ENEMIES, LEVEL
app.get("/enemies", (req, res) => {
    db.query("SELECT * FROM Enemy", (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

app.get("/levels", (req, res) => {
    db.query("SELECT * FROM Level", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err.message);
        }
        res.json(result);
    });
});

//GLOBAL STATS FOR STATS.HTML
// As a single player
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
//As multiple users
app.get("/global/stats", (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM Player) AS players,
            COUNT(m.match_id) AS matches,
            SUM(m.result = 'WIN') AS wins,
            SUM(m.result = 'LOSE') AS losses,
            COALESCE(AVG(m.duration_seconds), 0) AS avg_duration,
            COALESCE(MAX(m.final_fame), 0) AS best_score,
            COALESCE(AVG(
                (SELECT COUNT(*) 
                 FROM SpecificLevel sl 
                 WHERE sl.match_id = m.match_id AND sl.finished = TRUE)
            ), 0) AS avg_kills
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
