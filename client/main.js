import { drawMenu,  handleMouseMoveMenu, handleClickMenu } from "./scenes/menuScene.js";
import { drawLogIn, handleMouseMoveLogIn, handleClickLogIn, handleKeyDownLogIn, resetLogIn } from "./scenes/logInScene.js";
import { drawSelect, handleMouseMoveSelect, handleClickSelect, resetSelect, getSelectedCharacter } from "./scenes/selectScene.js";
import { getPlayerLevel1, drawLevel1, handleMouseMoveLevel1, handleClickLevel1, resetLevel1, handleKeyDownLevel1,
    handleKeyUpLevel1, setSelectedCharacter, goToMenuLevel1, nextLevelLevel1, resetGoToMenu } from "./scenes/level1Scene.js";
import { getPlayerLevel2, setPlayerLevel2, drawLevel2, handleMouseMoveLevel2, handleClickLevel2,
 resetLevel2, handleKeyDownLevel2, handleKeyUpLevel2, goToMenuLevel2, nextLevelLevel2 } from "./scenes/level2Scene.js";
import { setPlayerLevel3, drawLevel3, handleMouseMoveLevel3, handleClickLevel3, resetLevel3,
handleKeyDownLevel3, handleKeyUpLevel3, goToMenuLevel3, isGameCompleted } from "./scenes/level3Scene.js";
import { drawCreateAccount, handleMouseMoveCreateAccount, handleClickCreateAccount, handleKeyDownCreateAccount, resetCreateAccount } from "./scenes/createAccountScene.js";
import { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings } from "./scenes/settingsScene.js";
import { drawScoreScene, handleClickScoreScene } from "./scenes/scoreScene.js";
//API update (THIS RIGHT NOW ISNT FROM API, INSTEAD OF POSTING AND THENN GETTING, WE JUST GRABBING JS VARIABLES)
import {
    killedEnemies,
    currentLevel,
    cardSystem
} from "./scenes/level1Scene.js";
/*import {
    killedEnemies as killedEnemies2,
    currentLevel as currentLevel2,
    cardSystem as cardSystem2
} from "./scenes/level2Scene.js";

import {
    killedEnemies as killedEnemies3,
    currentLevel as currentLevel3,
    cardSystem as cardSystem3
} from "./scenes/level3Scene.js";*/

const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;
let oldTime = 0;
let currentScene = "menu";
let currentPlayer = null;
let selectedCharacter = null;

//API Connection, current player stats
async function loadPlayerStats(playerId) {
    console.log("LOADING STATS...");
    try {
        const res = await fetch(`http://localhost:3000/player/live/${playerId}`);
        const data = await res.json();

        document.getElementById("username").textContent = data.username;
        let currentLevelText = "-";
        if (currentScene === "level1") currentLevelText = 1;
        else if (currentScene === "level2") currentLevelText = 2;
        else if (currentScene === "level3") currentLevelText = 3;
        document.getElementById("level").textContent = currentLevelText; //JS
        document.getElementById("fame").textContent = data.current_fame || 0;
        document.getElementById("kills").textContent = data.enemy_kills || 0; //JS
        document.getElementById("cards").textContent = data.cards_in_deck || 0;

        document.getElementById("runs").textContent = data.total_runs;
        document.getElementById("wins").textContent = data.total_wins;
        document.getElementById("losses").textContent = data.total_losses;

    } catch (err) {
        console.error("Error loading player stats:", err);
    }
}
//This is beacause there are some variables that update in JS
function updateLiveStats() {
    if (!window.loggedPlayer) return;

    document.getElementById("username").textContent = window.loggedPlayer.username;

    let level = "-";
    let kills = 0;
    let cards = 0;

    if (currentScene === "level1") {
        level = currentLevel;
        kills = killedEnemies;
        cards = cardSystem.playerDeck.length;
    }

    /*if (currentScene === "level2") {
        level = currentLevel2;
        kills = killedEnemies2;
        cards = cardSystem2.playerDeck.length;
    }

    if (currentScene === "level3") {
        level = currentLevel3;
        kills = killedEnemies3;
        cards = cardSystem3.playerDeck.length;
    }*/

    document.getElementById("level").textContent = level;
    document.getElementById("kills").textContent = kills;
    document.getElementById("fame").textContent = kills;
    document.getElementById("cards").textContent = cards;
}

//FUNCTION MAIN
function main() {
    canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d"); 

    let clicked;

    canvas.addEventListener("click", (event) => {
        //MENU SCENE
        if(currentScene === 'menu'){
            clicked = handleClickMenu(ctx);
            if (clicked === 'start') currentScene = 'login';
            if (clicked === 'settings') currentScene = 'settings'; 
        }
        //SETTINGS SCENE
        else if(currentScene === 'settings') {
            clicked = handleClickSettings(ctx);
            if(clicked === 'back' || clicked === 'confirm') {
                resetSettings();
                currentScene = 'menu';
            }
        }
        //LOG IN SCENE
        else if (currentScene === 'login'){
            clicked = handleClickLogIn(ctx); 
            if(clicked === 'back'){
                resetLogIn();
                currentScene = 'menu';
            }
            if (clicked === 'create'){
                currentScene = 'createAccount'; 
            }
            if(clicked === 'confirm'){
                resetSelect();
                currentScene = 'start'; 
            }
        }
        //CREATE ACCOUNT SCENE
        else if(currentScene === 'createAccount') {
            clicked = handleClickCreateAccount(ctx);
            if(clicked === 'back') {
                resetCreateAccount();
                currentScene = 'menu';
            }
            if(clicked === 'login') currentScene = 'login'; 
            if(clicked === 'confirm') {
                currentScene = 'login';
                resetLogIn();
            }
        }
        //SELECT CHARACTER
        else if (currentScene === 'start'){
            clicked = handleClickSelect(ctx); 
            if(clicked === 'back'){
                resetSelect(); 
                currentScene = 'menu';
            }
            if (clicked === 'selectedCharacter'){
                selectedCharacter = getSelectedCharacter();
            }
            if (clicked === 'confirm'){
                selectedCharacter = getSelectedCharacter();
                setSelectedCharacter(selectedCharacter);
                currentPlayer = getPlayerLevel1();
                //API
                setTimeout(() => {
                    loadPlayerStats(window.loggedPlayer.player_id);
                }, 500);
                currentScene = 'level1';
            }
        }
        //LEVEL 1 SCENE
        else if (currentScene === 'level1'){
            clicked = handleClickLevel1(ctx); //& manejo de clicks en level1 (aún no implementado)

            if(goToMenuLevel1){
                resetGoToMenu();
                resetLogIn();
                resetSelect();
                resetLevel1();
                currentScene = "menu";
            }
        }
        //LEVEL 2 SCENE
        else if (currentScene === 'level2'){
            clicked = handleClickLevel2(ctx); //& manejo de clicks en level1 (aún no implementado)

            if(goToMenuLevel2){
                //& si level1 pide volver al menú, resetea todas las escenas involucradas
                resetLogIn();
                resetSelect();
                resetLevel2();
                currentScene = "menu";
            }
        }
        //LEVEL 1 SCENE
        else if (currentScene === 'level3'){
            clicked = handleClickLevel3(ctx); //& manejo de clicks en level1 (aún no implementado)

            if(goToMenuLevel3){
                //& si level1 pide volver al menú, resetea todas las escenas involucradas
                resetLogIn();
                resetSelect();
                resetLevel3();
                currentScene = "menu";
            }
        }
    });

    canvas.addEventListener("mousedown", () => {
        if(currentScene === "settings") startDragging();
    });

    canvas.addEventListener("mouseup", () => {
        if(currentScene === "settings") stopDragging();
    });

    canvas.addEventListener("mousemove", (event) => {
        if(currentScene === 'menu') handleMouseMoveMenu(event,canvas);
        if(currentScene === 'settings') handleMouseMoveSettings(event,canvas);
        if(currentScene === 'login') handleMouseMoveLogIn(event,canvas);
        if(currentScene === 'createAccount') handleMouseMoveCreateAccount(event,canvas);
        if(currentScene === 'start') handleMouseMoveSelect(event,canvas);
        if(currentScene === 'level1') handleMouseMoveLevel1(event,canvas);
        if(currentScene === 'level2') handleMouseMoveLevel2(event,canvas);
        if(currentScene === 'level3') handleMouseMoveLevel3(event,canvas);
    });

    window.addEventListener("keydown", (event) => {
        if (currentScene === "login") handleKeyDownLogIn(event);
        if(currentScene === "createAccount") handleKeyDownCreateAccount(event);
        if(currentScene === "level1") handleKeyDownLevel1(event);
        if(currentScene === "level2") handleKeyDownLevel2(event);
        if(currentScene === "level3") handleKeyDownLevel3(event);
    });

    window.addEventListener("keyup", (event)=>{
        if(currentScene === "level1") handleKeyUpLevel1(event);
        if(currentScene === "level2") handleKeyUpLevel2(event);
        if(currentScene === "level3") handleKeyUpLevel3(event);
    });
    // Update stats every 3 sec /NOW WE DO IT IN GAMELOOP)
    /*setInterval(() => {
        if (window.loggedPlayer) {
            loadPlayerStats(window.loggedPlayer.player_id);
        }
    }, 3000);*/

    requestAnimationFrame(gameLoop); 
}

function gameLoop(newTime) {
    let deltaTime = (newTime - oldTime);
    oldTime = newTime;
    //if (deltaTime > 50) deltaTime = 50; 

    if(currentScene === "level1" && nextLevelLevel1){
        currentPlayer = getPlayerLevel1();
        setPlayerLevel2(currentPlayer);
        resetLevel1();
        currentScene = "level2";
    }
    if(currentScene === "level2" && nextLevelLevel2){
        currentPlayer = getPlayerLevel2();
        setPlayerLevel3(currentPlayer);
        resetLevel2();
        currentScene = "level3";
    }
    if(currentScene === "level3" && isGameCompleted()){
        resetLevel3();
        currentScene = "score";
    }
    if(currentScene === 'menu') drawMenu(ctx,canvas);
    else if(currentScene === 'settings') drawSettings(ctx,canvas);
    else if(currentScene === 'login') drawLogIn(ctx,canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx,canvas);
    else if(currentScene === 'start') drawSelect(ctx,canvas);   
    else if(currentScene === 'level1') {
        drawLevel1(ctx,canvas, deltaTime);
        updateLiveStats();
    }
    else if(currentScene === 'level2'){
        drawLevel2(ctx,canvas,deltaTime);
        //updateLiveStats();
    } 
    else if(currentScene === 'level3') {
        drawLevel3(ctx,canvas,deltaTime);
        //updateLiveStats();
    }
    else if(currentScene === 'score') drawScoreScene(ctx,canvas,deltaTime);

    oldTime = newTime;
    requestAnimationFrame(gameLoop);
}

main();
export { loadPlayerStats };