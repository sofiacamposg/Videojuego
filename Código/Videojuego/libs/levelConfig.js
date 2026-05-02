//LEVEL CONFIGURATIONS
//Player Configurations 

//API
export let playerConfigs = {};
export async function loadPlayerConfigs() {
    const res = await fetch("http://localhost:3000/archetypes");
    const data = await res.json();

    const configs = {};

    data.forEach(a => {
        configs[a.name] = {
            hp: a.hp_start,
            maxHp: a.hp_start,
            speed: a.speed_start / 10,
            damage: a.damage_start,

            walkRightSrc: `../Videojuego/assets/player${a.archetype_id}/1.png`,
            walkLeftSrc: `../Videojuego/assets/player${a.archetype_id}/2.png`,
            jumpRightSrc: `../Videojuego/assets/player${a.archetype_id}/3.png`,
            jumpLeftSrc: `../Videojuego/assets/player${a.archetype_id}/4.png`,
            attackRightSrc: `../Videojuego/assets/player${a.archetype_id}/attackright.png`,
            attackLeftSrc: `../Videojuego/assets/player${a.archetype_id}/attackleft.png`,
        };
    });

    playerConfigs = configs;
}
//Enemy configs from API
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
//LevelConfigs from API
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
export function getLevelConfig(level) {
    const db = levelConfigsDB[level] || {};
    const baseConfigs = {
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
    return {
        ...base,
        targetTime: db.targetTime || 10000,
        conditionEnemies: db.conditionEnemies || 8,
        enemyConfig: {
            ...enemyConfigs[level], // ahora sí funciona
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