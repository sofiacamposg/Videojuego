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

/*export const playerConfigs = {
    Warrior: {
        hp: 120, maxHp: 120, speed: 0.5, damage: 20,
        walkRightSrc: "./assets/player1/1.png",
        walkLeftSrc: "./assets/player1/2.png",
        jumpRightSrc: "./assets/player1/3.png",
        jumpLeftSrc: "./assets/player1/4.png",
        attackRightSrc: "./assets/player1/attackright.png",
        attackLeftSrc: "./assets/player1/attackleft.png",
    },

    Lancer: {
        hp: 100, maxHp: 100, speed: 0.6, damage: 25,
        walkRightSrc:   "./assets/player2/5.png",
        walkLeftSrc:    "./assets/player2/6.png",
        jumpRightSrc:   "./assets/player2/7.png",
        jumpLeftSrc:    "./assets/player2/8.png",
        attackRightSrc: "./assets/player2/attackright.png",
        attackLeftSrc:  "./assets/player2/attackleft.png",
    },

    Heavy: {
        hp: 150, maxHp: 150, speed: 0.4, damage: 15,
        walkRightSrc:   "./assets/player3/9.png",
        walkLeftSrc:    "./assets/player3/10.png",
        jumpRightSrc:   "./assets/player3/11.png",
        jumpLeftSrc:    "./assets/player3/12.png",
        attackRightSrc: "./assets/player3/attackright.png",
        attackLeftSrc:  "./assets/player3/attackleft.png",
    },
};*/

//Configurations for each level
export const level1Config = {  //   TODO agregar muerte del lado derecho
    background: "./assets/Coliseo1.png",
    targetTime: 10000,
    conditionEnemies: 8,


    enemyConfig: {
        hp: 100,
        damage: 8,
        speed: 0.4,
        scale: 0.6,
        walkRightSrc: "./assets/enemy1/walkRight.png",
        walkLeftSrc: "./assets/enemy1/walkLeft.png",
        attackRightSrc: "./assets/enemy1/attackRight.png",
        attackLeftSrc: "./assets/enemy1/attackLeft.png",
        deathLeftSrc: "./assets/enemy1/deathLeft.png",
        deathRightSrc: "./assets/enemy1/deathRight.png",
    },

    spawnPositions: [
        {x: 900, y: 450},
        {x: 1100, y: 450}
    ]
};

export const level2Config = {
    background: "./assets/Coliseo2.png",
    targetTime: 15000,
    conditionEnemies: 9,


    enemyConfig: {
        hp: 120,
        damage: 9,
        speed: 0.5,
        scale: 0.7,
        walkRightSrc: "./assets/enemy2/walkRight.png",
        walkLeftSrc: "./assets/enemy2/walkLeft.png",
        attackRightSrc: "./assets/enemy2/attackRight.png",
        attackLeftSrc: "./assets/enemy2/attackLeft.png",
        deathLeftSrc: "./assets/enemy2/death.png",
        deathRightSrc: "./assets/enemy1/deathRight.png",

    },

    spawnPositions: [
        {x: 800, y: 450},
        {x: 1000, y: 450}
    ]
};
export const level3Config = {
    background: "./assets/Coliseo3.png",
    targetTime: 20000,
    conditionEnemies: 10,

    enemyConfig: {
        hp: 120,
        damage: 10,
        speed: 0.5,
        scale: 0.8,
        walkRightSrc: "./assets/enemy3/walkRight.png",
        walkLeftSrc: "./assets/enemy3/walkLeft.png",
        attackRightSrc: "./assets/enemy3/attackRight.png",
        attackLeftSrc: "./assets/enemy3/attackLeft.png",
        deathLeftSrc: "./assets/enemy3/death.png",
        deathRightSrc: "./assets/enemy1/deathRight.png",

    },

    spawnPositions: [
        {x: 700, y: 450},
        {x: 1000, y: 450}
    ]
};
