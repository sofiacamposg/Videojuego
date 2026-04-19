const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ======================= DB CONNECTION =======================
const db = mysql.createConnection({
    host: "localhost",
    user: "gladiator",
    password: "gladiator123",
    database: "gladiator",
});

db.connect((err) => {
    if (err) {
        console.log("Error MySQL:", err);
        return;
    }
    console.log("MySQL conectado");
});

// ======================= SERVER =======================
app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});

// ======================= GET PLAYERS =======================
app.get("/players", (req, res) => {
    console.log("ENTRÓ A /players");

    db.query("SELECT * FROM Player", (err, result) => {
        if (err) {
            console.log("ERROR:", err);
            return res.status(500).send(err.message);
        }

        res.json(result);
    });
});

// ======================= GET RANDOM CARDS =======================
app.get("/cards/random", (req, res) => {
    console.log("ENTRÓ A /cards/random");

    const query = `
        SELECT 
            c.card_id,
            c.card_name,
            c.description AS card_description,

            e.effect_name,
            e.effect_type,
            e.effect_value,
            e.description AS effect_description

        FROM Card c
        JOIN Effect e ON c.effect_id = e.effect_id

        ORDER BY RAND()
        LIMIT 3
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.log("ERROR:", err);
            return res.status(500).send(err.message);
        }

        console.log("CARDS:", result);

        res.json(result);
    });
});

// ======================= LOGIN =======================
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const query = `
        SELECT * FROM Player
        WHERE username = ? AND password = ?
    `;

    db.query(query, [username, password], (err, result) => {

        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.status(500).send("Server error");
        }

        if (result.length === 0) {
            return res.status(401).send("Invalid credentials");
        }

        console.log("USER LOGGED:", result[0]);

        res.json(result[0]);
    });
});

// ======================= REGISTER =======================
app.post("/register", (req, res) => {
    const { username, password, name } = req.body;

    const checkQuery = `SELECT * FROM Player WHERE username = ?`;

    db.query(checkQuery, [username], (err, result) => {
        if (err) {
            return res.status(500).send("Server error");
        }

        if (result.length > 0) {
            return res.status(400).send("User already exists");
        }

        const insertQuery = `
            INSERT INTO Player (name, username, password)
            VALUES (?, ?, ?)
        `;

        db.query(insertQuery, [name, username, password], (err) => {
            if (err) {
                return res.status(500).send("Insert error");
            }

            console.log("USER CREATED:", username);

            res.json({ success: true });
        });
    });
});