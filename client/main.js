//& main.js
//& Entry point of the game — manages scene switching, the game loop, and global state
//& All scenes are imported here and rendered based on the currentScene variable
//& Also handles canvas event listeners for clicks, mouse movement and keyboard input

import { drawMenu, handleMouseMoveMenu, handleClickMenu } from "./scenes/menuScene.js";
import { drawLogIn, handleMouseMoveLogIn, handleClickLogIn, handleKeyDownLogIn, resetLogIn } from "./scenes/logInScene.js";
import { drawSelect, handleMouseMoveSelect, handleClickSelect, resetSelect, getSelectedCharacter } from "./scenes/selectScene.js";
import { getPlayer, drawLevel, handleMouseMoveLevel, handleClickLevel, resetLevel, handleKeyDownLevel,
        handleKeyUpLevel, setSelectedCharacter, goToMenu, resetGoToMenu, goToScore, resetGoToScore } from "./scenes/levelBase.js";  // all 3 levels now live here
import { drawCreateAccount, handleMouseMoveCreateAccount, handleClickCreateAccount, handleKeyDownCreateAccount, resetCreateAccount } from "./scenes/createAccountScene.js";
import { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings } from "./scenes/settingsScene.js";
import { drawScoreScene, handleClickScoreScene, handleMouseMoveScore, loadMatchSummary, resetScoreScene } from "./scenes/scoreScene.js";
import { drawShop, handleMouseMoveShop, handleClickShop } from "./scenes/shopScene.js";
import { loadPlayerStats } from "./libs/level_functions.js";
import { loadPlayerConfigs, playerConfigs, loadEnemyConfigs, enemyConfigs, loadLevelConfigs, levelConfigsDB } from "./libs/levelConfig.js";

// live stats come directly from levelBase JS variables instead of polling the API every frame
import {
    killedEnemies,
    currentLevel,
    cardSystem
} from "./scenes/levelBase.js";

//? canvas dimensions
const canvasWidth = 1000;
const canvasHeight = 600;

//? core game variables
let canvas;
let ctx;
let oldTime = 0;
let currentScene = "menu";   // controls which scene is drawn and handled each frame
let currentPlayer = null;    // reference to the active PlayerBase instance
let selectedCharacter = null;

//? shop flow flag — true when player goes to shop directly from menu without being logged in
let loginFromShop = false;

//? flag set to true once all API configs are loaded and the game loop can start
let configsReady = false;

//* updates the live stats panel on the right side of the screen
//* reads directly from JS variables during gameplay for real-time accuracy
function updateLiveStats() {
    if (!window.loggedPlayer) return;

    document.getElementById("username").textContent = window.loggedPlayer.username;

    let level = "-";
    let kills = 0;
    let cards = 0;

    //? only show live level stats when the player is actually in a level
    if (currentScene === "level1") {
        level = currentLevel;
        kills = killedEnemies;
        cards = cardSystem.playerDeck.length;
    }

    document.getElementById("level").textContent = level;
    document.getElementById("kills").textContent = kills;
    document.getElementById("fame").textContent = currentPlayer.fame;
    document.getElementById("cards").textContent = cards;
}

//* resets all HUD panel values to dashes — called on logout or scene reset
function resetPanel() {
    document.getElementById("username").textContent = "-";
    document.getElementById("level").textContent = "-";
    document.getElementById("kills").textContent = "-";
    document.getElementById("fame").textContent = "-";
    document.getElementById("cards").textContent = "-";
    document.getElementById("runs").textContent = "-";
    document.getElementById("wins").textContent = "-";
    document.getElementById("losses").textContent = "-";
}

//* clears all player state and returns to a logged-out condition
//* resets login, select, level and panel so the next user starts fresh
function logout() {
    window.loggedPlayer = null;
    localStorage.removeItem("player");

    resetLogIn();
    resetSelect();
    resetLevel();
    resetPanel();

    currentPlayer = null;
    selectedCharacter = null;
}

//* sets up the canvas, registers all event listeners and starts the game
function main() {
    canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d"); 

    let clicked;

    //? click handler — delegates to the active scene's click handler
    canvas.addEventListener("click", async (event) => {

        //? MENU SCENE
        if(currentScene === 'menu'){
            clicked = handleClickMenu(ctx);
            //? start — go to login, reset any leftover state
            if (clicked === 'start') {
                loginFromShop = false;
                resetLogIn();
                resetPanel();
                currentScene = 'login';
            }
            if (clicked === 'settings') currentScene = 'settings'; 
            //? shop — require login first if not already logged in
            if (clicked === 'shop') {
                if (!window.loggedPlayer) {
                    loginFromShop = true;  // remember to go to shop after login
                    resetLogIn();   
                    resetPanel();
                    currentScene = "login";
                } else {
                    currentScene = "shop";
                }
            }
        }

        //? SETTINGS SCENE
        else if(currentScene === 'settings') {
            clicked = handleClickSettings(ctx);
            if(clicked === 'back' || clicked === 'confirm') {
                resetSettings();
                currentScene = 'menu';
            }
        }

        //? LOGIN SCENE
        // a callback is passed to handleClickLogIn so the scene changes immediately
        // after the API responds, without needing a second click
        else if (currentScene === 'login'){
            clicked = handleClickLogIn(ctx, () => {
                //? logged in from shop flow — go back to shop
                if (loginFromShop) {
                    (async () => {
                        await loadPlayerStats(window.loggedPlayer.player_id, currentScene);
                    })();
                    loginFromShop = false;
                    currentScene = "shop";
                } else {
                    //? normal login flow — go to character select
                    setTimeout(() => {
                        loadPlayerStats(window.loggedPlayer.player_id, currentScene);
                    }, 500);
                    resetSelect();
                    currentScene = 'start';
                }
            });

            if(clicked === 'back'){
                resetLogIn();
                currentScene = 'menu';
            }
            if (clicked === 'create'){
                resetLogIn();
                currentScene = 'createAccount';
            }
        }

        //? CREATE ACCOUNT SCENE
        else if(currentScene === 'createAccount') {
            clicked = handleClickCreateAccount(ctx);
            if(clicked === 'back') {
                resetCreateAccount();
                currentScene = 'menu';
            }
            if(clicked === 'login') currentScene = 'login'; 
            if(clicked === 'confirm') {
                resetLogIn();
                currentScene = 'login';
            }
        }

        //? SELECT CHARACTER SCENE
        else if (currentScene === 'start'){
            //? guard — if not logged in redirect to login
            if (!window.loggedPlayer) {
                currentScene = "login";
                return;
            }
            clicked = handleClickSelect(ctx); 
            if(clicked === 'back'){
                resetSelect(); 
                currentScene = 'menu';
            }
            if (clicked === 'selectedCharacter'){
                selectedCharacter = getSelectedCharacter();
            }
            //? confirm — create the player and start level 1
            if (clicked === 'confirm'){
                selectedCharacter = getSelectedCharacter();
                setSelectedCharacter(selectedCharacter);
                currentPlayer = getPlayer();  // grab the newly created PlayerBase instance
                currentScene = 'level1';
            }
        }

        //? LEVEL SCENE
        else if (currentScene === 'level1'){
            clicked = handleClickLevel(ctx); 
            //? player clicked Home from the pause menu — log out and go to menu
            if(goToMenu){
                resetGoToMenu();
                logout();
                currentScene = "menu";
            }
        }

        //? SCORE SCENE
        else if(currentScene === "score"){
            clicked = handleClickScoreScene();
            //? exit — reload stats and go back to menu
            if(clicked === "exit"){
                (async () => {
                    await loadPlayerStats(window.loggedPlayer.player_id, "menu");
                    currentScene = "menu";
                    resetScoreScene();
                })();
            }
            //? play again — reload stats and restart the run with the same character
            if(clicked === "again"){
                console.log("ANTES DE CREAR PLAYER:", window.loggedPlayer.fame);
                resetLevel();
                (async () => {
                    await loadPlayerStats(window.loggedPlayer.player_id, "level1");
                    resetScoreScene();
                    setSelectedCharacter(selectedCharacter);
                    currentPlayer = getPlayer();
                    currentScene = "level1";
                })();
            }
        }

        //? SHOP SCENE
        else if (currentScene === "shop") {
            clicked = await handleClickShop();
            if (clicked === "back") {
                currentScene = "menu";
            }
        }
    });

    //? mousedown — start dragging the volume slider in settings
    canvas.addEventListener("mousedown", () => {
        if(currentScene === "settings") startDragging();
    });

    //? mouseup — stop dragging the volume slider
    canvas.addEventListener("mouseup", () => {
        if(currentScene === "settings") stopDragging();
    });

    //? mousemove — delegate to the active scene's mouse move handler
    canvas.addEventListener("mousemove", (event) => {
        if(currentScene === 'menu') handleMouseMoveMenu(event, canvas);
        if(currentScene === 'settings') handleMouseMoveSettings(event, canvas);
        if(currentScene === 'login') handleMouseMoveLogIn(event, canvas);
        if(currentScene === 'createAccount') handleMouseMoveCreateAccount(event, canvas);
        if(currentScene === 'start') handleMouseMoveSelect(event, canvas);
        if(currentScene === 'level1') handleMouseMoveLevel(event, canvas);
        if(currentScene === 'score') handleMouseMoveScore(event, canvas);
        if(currentScene === "shop") handleMouseMoveShop(event, canvas);
    });

    //? keydown — delegate to the active scene's keyboard handler
    window.addEventListener("keydown", (event) => {
        if (currentScene === "login") handleKeyDownLogIn(event);
        if(currentScene === "createAccount") handleKeyDownCreateAccount(event);
        if(currentScene === "level1") handleKeyDownLevel(event);
    });

    //? keyup — only needed in the level scene for movement keys
    window.addEventListener("keyup", (event) => {
        if(currentScene === 'level1') handleKeyUpLevel(event);
    });
}

//* loads all API configs before starting the game loop
//* requestAnimationFrame only starts once all configs are ready
async function init() {
    console.log("Loading configs...");
    await loadPlayerConfigs();
    await loadEnemyConfigs();
    await loadLevelConfigs();
    console.log("Configs ready:", playerConfigs);
    console.log("Configs ready:", enemyConfigs);
    console.log("Configs ready:", levelConfigsDB);
    configsReady = true;
    requestAnimationFrame(gameLoop);  // start the loop only after configs are loaded
}

//* main game loop — called every frame via requestAnimationFrame
//* calculates deltaTime, draws the active scene and checks for scene transitions
function gameLoop(newTime) {
    let deltaTime = (newTime - oldTime);
    if (deltaTime > 50) deltaTime = 50;  // cap deltaTime to avoid huge jumps on tab switch

    //? wait until configs are ready before drawing anything
    if (!configsReady) {
        requestAnimationFrame(gameLoop);
        return;
    }

    //? draw the correct scene based on currentScene
    if(currentScene === 'menu') drawMenu(ctx, canvas);
    else if(currentScene === 'settings') drawSettings(ctx, canvas);
    else if(currentScene === 'login') drawLogIn(ctx, canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx, canvas);
    else if(currentScene === 'start') drawSelect(ctx, canvas);   
    else if(currentScene === 'level1') {
        drawLevel(ctx, canvas, deltaTime);  // levelBase handles all 3 levels
        updateLiveStats();  // refresh HUD panel every frame during gameplay

        //? level complete — go to score scene
        if(goToScore){
            currentScene = 'score';
            resetGoToScore();
        }
        //? player went home from pause — go to menu
        else if(goToMenu){
            currentScene = 'menu';
            resetGoToMenu();
            resetLevel();
        }
    }
    else if(currentScene === 'score') drawScoreScene(ctx, canvas, deltaTime);
    else if(currentScene === "shop") drawShop(ctx, canvas);

    oldTime = newTime;
    requestAnimationFrame(gameLoop);
}

main();
init();

export { loadPlayerStats };