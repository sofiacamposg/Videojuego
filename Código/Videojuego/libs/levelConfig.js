/* 
& Acts as a bridge between the database and game scenes, preventing levels from hardcoding their values. Includes:
& API data fetching: 3 async functions that fetch data from localhost:3000 to populate exported objects
& level config constructor: Combines background, scale, and spawn positions with dynamic DB data to return an object ready for scene 

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

//* === player config ===
//~ gets archetype catalog data and push it in playerConfigs, no hardcoded data
export let playerConfigs = {};
export async function loadPlayerConfigs() {
    const res = await fetch("http://localhost:3000/archetypes");  //gets the info
    const data = await res.json();  //put it in a json

    const configs = {};  //empty object to add the catalog

    data.forEach(a => {  //organize info of each character
        configs[a.name] = {
            hp: a.hp_start,
            maxHp: a.hp_start,
            speed: a.speed_start / 10,
            damage: a.damage_start,
            //our assets were made by NanoBanana
            walkRightSrc: `../Videojuego/assets/player${a.archetype_id}/1.png`,
            walkLeftSrc: `../Videojuego/assets/player${a.archetype_id}/2.png`,
            jumpRightSrc: `../Videojuego/assets/player${a.archetype_id}/3.png`,
            jumpLeftSrc: `../Videojuego/assets/player${a.archetype_id}/4.png`,
            attackRightSrc: `../Videojuego/assets/player${a.archetype_id}/attackright.png`,
            attackLeftSrc: `../Videojuego/assets/player${a.archetype_id}/attackleft.png`,
        };
    });

    playerConfigs = configs;  //copy
}

//* === enemy config ===
//~ gets enemies catalog data and push it in enemyCondig, no hardcoded data
export let enemyConfigs = {};
export async function loadEnemyConfigs() {
    const res = await fetch("http://localhost:3000/enemies");  //gets info
    const data = await res.json();  //add it to a json

    const configs = {};  //empty object to save the catalog

    data.forEach(e => {  //organize info
        configs[e.level_id] = {
            hp: e.hp_start,
            damage: e.damage_start,
            speed: e.speed_start,
        };
    });

    enemyConfigs = configs;  //copy
}

//* === level config ===
//~ gets level catalog data and push it in levelConfig, no hardcoded data
export let levelConfigsDB = {};
export async function loadLevelConfigs() {
    const res = await fetch("http://localhost:3000/levels");  //gets info
    const data = await res.json();  //put it in a json

    const configs = {};  //empty object to save data

    data.forEach(l => {  //add data
        configs[l.level_id] = {
            targetTime: l.target_time,
            conditionEnemies: l.condition_enemies
        };
    });

    levelConfigsDB = configs;  //copy
}

export function getLevelConfig(level) {  //~ puts all info in a single object to use it in LevelBase.js (debugged w IA)
    const db = levelConfigsDB[level] || {};
    //our assets were made by NanoBanana
    const baseConfigs = {  //background
        1: {
            background: "../Videojuego/assets/Coliseo1.png",
            scale: 0.6,
        },
        2: {
            background: "../Videojuego/assets/Coliseo2.png",
            scale: 0.7,
        },
        3: {
            background: "../Videojuego/assets/Coliseo3.png",
            scale: 0.8,
        }
    };
    const base = baseConfigs[level];
    return {  //all info (game, enemies, player)
        ...base,  //organize info for each level
        targetTime: db.targetTime || 10000,  //hardcoded time for edge case
        conditionEnemies: db.conditionEnemies || 8, //hardcoded time for edge case
        enemyConfig: {
            //our assets were made by NanoBanana
            ...enemyConfigs[level], 
            scale: base.scale,
            walkRightSrc: `../Videojuego/assets/enemy${level}/walkRight.png`,
            walkLeftSrc: `../Videojuego/assets/enemy${level}/walkLeft.png`,
            attackRightSrc: `../Videojuego/assets/enemy${level}/attackRight.png`,
            attackLeftSrc: `../Videojuego/assets/enemy${level}/attackLeft.png`,
            deathLeftSrc: `../Videojuego/assets/enemy${level}/deathLeft.png`,
            deathRightSrc: `../Videojuego/assets/enemy${level}/deathRight.png`,
        },

        spawnPositions: [
            { x: 800, y: 450 },
            { x: 1000, y: 450 }
        ]
    };
}