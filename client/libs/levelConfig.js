//& levelConfig.js
//& Loads and stores all level, player and enemy configurations from the API
//& Provides getLevelConfig() to build the full config object for each level at runtime

//===== PLAYER =====

//* fetches all archetypes from the API and builds the playerConfigs object
//* each archetype gets its stats and sprite paths based on its ID
export let playerConfigs = {};
export async function loadPlayerConfigs() {
    const res = await fetch("http://localhost:3000/archetypes");
    const data = await res.json();

    const configs = {};

    data.forEach(a => {
        configs[a.name] = {
            hp: a.hp_start,
            maxHp: a.hp_start,
            speed: a.speed_start / 10,  // divide by 10 to keep movement speed reasonable
            damage: a.damage_start,

            // sprite paths built dynamically from the archetype ID
            walkRightSrc: `./assets/player${a.archetype_id}/1.png`,
            walkLeftSrc: `./assets/player${a.archetype_id}/2.png`,
            jumpRightSrc: `./assets/player${a.archetype_id}/3.png`,
            jumpLeftSrc: `./assets/player${a.archetype_id}/4.png`,
            attackRightSrc: `./assets/player${a.archetype_id}/attackright.png`,
            attackLeftSrc: `./assets/player${a.archetype_id}/attackleft.png`,
        };
    });

    playerConfigs = configs;
}

//===== ENEMIES =====

//* fetches all enemies from the API and builds the enemyConfigs object
//* keyed by level_id so each level knows which enemy stats to use
export let enemyConfigs = {};
export async function loadEnemyConfigs() {
    const res = await fetch("http://localhost:3000/enemies");
    const data = await res.json();

    const configs = {};

    data.forEach(e => {
        configs[e.level_id] = {
            hp: e.hp_start,
            damage: e.damage_start,
            speed: e.speed_start,
        };
    });

    enemyConfigs = configs;
}

//===== LEVELS =====

//* fetches all level configs from the API and stores them in levelConfigsDB
//* stores target time and enemy kill condition for each level
export let levelConfigsDB = {};
export async function loadLevelConfigs() {
    const res = await fetch("http://localhost:3000/levels");
    const data = await res.json();

    const configs = {};

    data.forEach(l => {
        configs[l.level_id] = {
            targetTime: l.target_time,
            conditionEnemies: l.condition_enemies
        };
    });

    levelConfigsDB = configs;
}

//* builds and returns the full config object for a given level number
//* merges DB data (stats, conditions) with hardcoded data (backgrounds, sprite paths)
export function getLevelConfig(level) {
    const db = levelConfigsDB[level] || {};  // DB data for this level

    //? hardcoded visual config per level — backgrounds and enemy scale
    const baseConfigs = {
        1: {
            background: "./assets/Coliseo1.png",
            scale: 0.6,
        },
        2: {
            background: "./assets/Coliseo2.png",
            scale: 0.7,
        },
        3: {
            background: "./assets/Coliseo3.png",
            scale: 0.8,
        }
    };

    const base = baseConfigs[level];

    return {
        ...base,
        targetTime: db.targetTime || 10000,          // fallback if DB not loaded yet
        conditionEnemies: db.conditionEnemies || 8,  // fallback kill condition

        //? enemy config merges DB stats with sprite paths built from level number
        enemyConfig: {
            ...enemyConfigs[level],
            scale: base.scale,
            walkRightSrc: `./assets/enemy${level}/walkRight.png`,
            walkLeftSrc: `./assets/enemy${level}/walkLeft.png`,
            attackRightSrc: `./assets/enemy${level}/attackRight.png`,
            attackLeftSrc: `./assets/enemy${level}/attackLeft.png`,
            deathLeftSrc: `./assets/enemy${level}/deathLeft.png`,
            deathRightSrc: `./assets/enemy${level}/deathRight.png`,
        },

        //? initial spawn positions for enemies at the start of each level
        spawnPositions: [
            { x: 800, y: 450 },
            { x: 1000, y: 450 }
        ]
    };
}