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

// endpoint to get menu by day
app.get("/menu/:day", (req, res) => {
    // :day as a parameter
    const day = req.params.day;  // gets the day from the URL

    // SQL query: joins Menu, MenuItem and Product to get the items for that day
    const query = `
        SELECT Product.name, Product.category, Product.image_url
        FROM Product
        JOIN MenuItem ON Product.product_id = MenuItem.product_id
        JOIN Menu ON MenuItem.menu_id = Menu.menu_id
        WHERE Menu.day = ?
    `;
    //, ? is replaced by day (prevents SQL injection)
    db.query(query, [day], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results);  // sends results as JSON
        }
    });
});

// endpoint to get all cats available for adoption
app.get("/cats", (req, res) => {
    const query = `SELECT name, age, description, image_url FROM Cat`;
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results);  //sends all cats as JSON
        }
    });
});

// starts the server on port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
