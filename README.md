# Gladiator

A browser-based 2D action game set in Ancient Rome. Fight your way through three arena levels, collect power-up cards, manage your resources, and survive to claim glory.

---

## Languages

| Layer    | Language                       |
|----------|--------------------------------|
| Frontend | HTML5 Canvas + CSS + JS        |
| Backend  | Node.js + Express              |
| Database | MySQL                          |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- MySQL Server running locally
- A live-server extension for your editor (e.g. [Live Server for VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer))

---

## Setup

### 1. Clone the repository

```
git clone https://github.com/sofiacamposg/Videojuego.git
cd Videojuego
```

### 2. Set up the database

Open MySQL Workbench (or any MySQL program) and run the schema file:

```
mysql -u root -p < "Código/base_de_datos/gladiador_codigo2.sql"
```
This creates the `gladiator` database with all tables, triggers, stored procedures, and views.

### 3. Configure environment variables

Inside `Código/Web/`, create a file named `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=gladiator
PORT=3000
```

### 4. Install dependencies and start the backend server

```
cd Código/Web
npm install
npm start
```
The server will run at `http://localhost:3000`. You should see `MySQL conectado` in the terminal when the connection is successful.

### 5. Open the game with Live Server

In your editor, open the file `Código/Videojuego/index.html` and click **Go Live** (Live Server).

The game will open in your browser. **Both the backend server and Live Server must be running at the same time.**

---

## How to Play

### Game Flow

```
Main Menu
   ├── Log In / Create Account
   ├── Select your Gladiator (Archetype)
   ├── Level 1 → Level 2 → Level 3
   └── Score Screen
```

You can also visit the **Shop** from the main menu (requires login) to spend Fame on permanent upgrades before a run.

### Controls

| Key | Action |
|-----|--------|
| `Arrow Left` / `A` | Move left |
| `Arrow Right` / `D` | Move right |
| `Space` | Jump |
| `J` | Attack |
| `C` | View your card deck |
| `Escape` | Pause / Resume |

---

## Game Objective

Survive all three colosseum levels by defeating enemies and avoiding hazards. Each level ends when you kill enough enemies. Earn **Fame** by clearing levels quickly. Fame is the in-game currency used to buy extra lives and shields in the shop.

---

## Game Summary

**Gladiator** is a side-scrolling arena fighter with roguelite card mechanics. You play as a gladiator competing in the Roman Colosseum across three increasingly difficult levels.

**Characters (Archetypes)**
Choose from three gladiator archetypes at the start of each run, each with different base stats for HP, speed, and damage. Your choice shapes the rest of the run.

**Levels**
- **Level 1:** Straightforward arena, no hazards. Kill the required number of enemies to advance.
- **Level 2:** Spikes appear in the arena floor. Watch your step while fighting.
- **Level 3:** Spikes and fire pits. Survive the chaos and defeat the strongest enemies to win.

**Card Events**
At a random point mid-level, a card event triggers. You are shown three face-down cards (two **Power-Ups** and one **Punishment**) and must pick one. Choose wisely.

**Level Rewards**
Complete a level before the target time and earn two power-ups cards added to your deck. Finish late and you only get one. 
**The Shop**
Spend Fame earned in matches on:
- **Extra Heart (life):** 50 Fame, increases your hearts for the next run (up to 5 hearts max).
- **Galen's Remedy:** 25 Fame, a one-use shield that absorbs one fatal hit (no limit).

**Winning and Losing**
Clear all three levels to **WIN**. Run out of hearts and you **LOSE**. Either way, your match stats (level reached, fame earned, duration) are saved to the database and shown on the score screen.

**Admin Mode**
Register with a username starting with `@dm1n_` to create an admin account, which has access to global game statistics across all players.

---
All our assets were made by NanoBanana.

Gladiator Team:
- Daniela Angulo
- Ariel Pulver
- Sofia Campos
