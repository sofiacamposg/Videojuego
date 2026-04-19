import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "catcafe",
    password: "catcafe123",
    database: "catcafe"
});
db.connect(err => {
    if(err) {
        console.log("Error:", err);
    } else {
        console.log("Connected to MySQL");
    }
});