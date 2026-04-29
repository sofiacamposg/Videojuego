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
        targetTime: db.targetTime || 10000,
        conditionEnemies: db.conditionEnemies || 8,
        enemyConfig: {
            ...enemyConfigs[level], // ahora sí funciona
            scale: base.scale,
            walkRightSrc: `./assets/enemy${level}/walkRight.png`,
            walkLeftSrc: `./assets/enemy${level}/walkLeft.png`,
            attackRightSrc: `./assets/enemy${level}/attackRight.png`,
            attackLeftSrc: `./assets/enemy${level}/attackLeft.png`,
            deathSrc: `./assets/enemy${level}/death.png`,
        },

        spawnPositions: [
            { x: 800, y: 450 },
            { x: 1000, y: 450 }
        ]
    };
}