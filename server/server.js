const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Doguita2012*",
    database: "gladiator",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.connect((err) => {
    if (err) {
        console.log("Error MySQL:", err);
        return;
    }
    console.log("MySQL conectado");
});

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
app.listen(3000, () => {
    console.log("Servidor en ");
});http://localhost:3000
//GET CARD FOR RANDOM CARD EVENT EFFECT
app.get("/cards/random", (req, res) => {

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
            console.log(err);
            res.send(err.message);
            return;
        }

        res.json(result);
    });
});
//LOG IN SCENE, TEST USERNAME AND PASSWORD
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const query = `
        SELECT * FROM Player
        WHERE username = ? AND password = ?
    `;

    db.query(query, [username, password], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }

        if (result.length === 0) {
            return res.status(401).send("Invalid credentials");
        }

        res.json(result[0]); // user encontrado
    });
});
//CREATE ACCOUNT 
app.post("/register", (req, res) => {

    const { username, password } = req.body;

    // check if user exists
    const checkQuery = `
        SELECT * FROM Player WHERE username = ?
    `;

    db.query(checkQuery, [username], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Server error");
        }

        if (result.length > 0) {
            return res.status(400).send("User already exists");
        }

        // insert new user
        const insertQuery = `
            INSERT INTO Player (name, username, password, total_runs, total_losses, total_wins)
            VALUES (?, ?, ?, 0, 0, 0)
        `;

        db.query(insertQuery, [username, username, password], (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Insert error");
            }

            res.json({ success: true });
        });
    });
});