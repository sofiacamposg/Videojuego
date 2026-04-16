const express = require("express");
const mysql = require("mysql2");
const app = express();
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
const db = mysql.createConnection({
    host: "localhost",
    user: "gladiator",  //general user
    password: "gladiator123",  //general password
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
        LIMIT 20   
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
//LOGIN
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

        res.json(result[0]); // 🔥 DEVUELVE EL USER
    });
});

//CREATE ACCOUNT
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

        res.json(result[0]); // 🔥 DEVUELVE EL USER
    });
});
