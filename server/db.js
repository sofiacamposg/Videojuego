const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gladiator"
});

db.connect(err => {
    if (err) {
        console.log("Error conexión:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

module.exports = db;