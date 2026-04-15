const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// CREAR JUGADOR (fake)
app.post("/crearJugador", (req, res) => {

    const { nombre_usuario } = req.body;

    console.log("Crear jugador:", nombre_usuario);

    res.json({
        mensaje: "Jugador creado",
        jugador_id: 1
    });
});


// LOGIN (fake)
app.post("/login", (req, res) => {

    const { nombre_usuario } = req.body;

    console.log("Login:", nombre_usuario);

    res.json({
        jugador_id: 1,
        nombre_usuario: nombre_usuario
    });
});


// GUARDAR PARTIDA (fake)
app.post("/guardarPartida", (req, res) => {

    console.log("Partida recibida:", req.body);

    res.json({
        mensaje: "Partida guardada"
    });
});


app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});