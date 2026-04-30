import { drawMenu,  handleMouseMoveMenu, handleClickMenu } from "./scenes/menuScene.js";
import { drawLogIn, handleMouseMoveLogIn, handleClickLogIn, handleKeyDownLogIn, resetLogIn } from "./scenes/logInScene.js";
import { drawSelect, handleMouseMoveSelect, handleClickSelect, resetSelect, getSelectedCharacter } from "./scenes/selectScene.js";
import { getPlayer, drawLevel, handleMouseMoveLevel, handleClickLevel, resetLevel, handleKeyDownLevel,
        handleKeyUpLevel, setSelectedCharacter, goToMenu, resetGoToMenu, goToScore, resetGoToScore } from "./scenes/levelBase.js";  //all 3 levels now live here
import { drawCreateAccount, handleMouseMoveCreateAccount, handleClickCreateAccount, handleKeyDownCreateAccount, resetCreateAccount } from "./scenes/createAccountScene.js";
import { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings } from "./scenes/settingsScene.js";
import { drawScoreScene, handleClickScoreScene, handleMouseMoveScore, loadMatchSummary, resetScoreScene } from "./scenes/scoreScene.js";
import { drawShop, handleMouseMoveShop, handleClickShop } from "./scenes/shopScene.js";
import { loadPlayerStats } from "./libs/level_functions.js";
import { loadPlayerConfigs, playerConfigs, loadEnemyConfigs, enemyConfigs, loadLevelConfigs, levelConfigsDB } from "./libs/levelConfig.js";
//API update (THIS RIGHT NOW ISNT FROM API, INSTEAD OF POSTING AND THENN GETTING, WE JUST GRABBING JS VARIABLES)
import {
    killedEnemies,
    currentLevel,
    cardSystem
} from "./scenes/levelBase.js";  //live stats come from levelBase now

const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;
let oldTime = 0;
let currentScene = "menu";
let currentPlayer = null;
let selectedCharacter = null;
//Shop hearts
let loginFromShop = false;

//API fetch info
let configsReady = false;

//API Connection, current player stats
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

    document.getElementById("level").textContent = level;
    document.getElementById("kills").textContent = kills;
    document.getElementById("fame").textContent = currentPlayer.fame;
    document.getElementById("cards").textContent = cards;
}

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

//FUNCTION MAIN
function main() {
    canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d"); 

    let clicked;
    canvas.addEventListener("click", async (event) => {
        //MENU SCENE
        if(currentScene === 'menu'){
            clicked = handleClickMenu(ctx);
            if (clicked === 'start') {
                    loginFromShop = false;
                    resetLogIn();
                    resetPanel();
                    currentScene = 'login';
            }
            if (clicked === 'settings') currentScene = 'settings'; 
            if (clicked === 'shop') {
                if (!window.loggedPlayer) {
                    loginFromShop = true;
                    resetLogIn();   
                    resetPanel();
                    currentScene = "login";
                } else {
                    currentScene = "shop";
                }
            }
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
            //? Se pasa un callback a handleClickLogIn para que cuando el fetch de login
            //? termine exitosamente, cambie la escena directamente sin necesitar otro click
            clicked = handleClickLogIn(ctx, () => {
            if (loginFromShop) {
                //API
                (async () => {
                    await loadPlayerStats(window.loggedPlayer.player_id, currentScene);
                })();
                loginFromShop = false;
                currentScene = "shop";   //  regresa a shop
            } else {
                //API
                setTimeout(() => {
                    loadPlayerStats(window.loggedPlayer.player_id, currentScene);
                }, 500);
                resetSelect();
                currentScene = 'start';  // flujo normal del juego
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
        //CREATE ACCOUNT SCENE
        else if(currentScene === 'createAccount') {
            clicked = handleClickCreateAccount(ctx, () => {
                resetLogIn();
                currentScene = 'login';
            });
            if(clicked === 'back') {
                resetCreateAccount();
                currentScene = 'menu';
            }
            if(clicked === 'login') currentScene = 'login';
        }
        //SELECT CHARACTER
        else if (currentScene === 'start'){
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
            if (clicked === 'confirm'){
                selectedCharacter = getSelectedCharacter();
                setSelectedCharacter(selectedCharacter);
                currentPlayer = getPlayer();  //grab the player that was just created
                currentScene = 'level1';
            }
        }
        //LEVELS SCENE
        else if (currentScene === 'level1'){
            clicked = handleClickLevel(ctx); 
            if(goToMenu){  //player clicked Home from the pause menu
                resetGoToMenu();
                logout();
                currentScene = "menu";
            }
        }
        //SCORE SCENE
        else if(currentScene === "score"){
            clicked = handleClickScoreScene();
            if(clicked === "exit"){
                (async () => {
                    await loadPlayerStats(window.loggedPlayer.player_id, "menu");
                    currentScene = "menu";
                    resetScoreScene();
                })();
            }
            if(clicked === "again"){
                console.log("ANTES DE CREAR PLAYER:", window.loggedPlayer.fame);
                resetLevel();
                (async () => {
                    await loadPlayerStats(window.loggedPlayer.player_id, "level1");

                    resetScoreScene();

                    // Creates player again
                    setSelectedCharacter(selectedCharacter);
                    currentPlayer = getPlayer();
                    currentScene = "level1";
                })();
            }
        }
        //SHOP SCENE
        else if (currentScene === "shop") {
            clicked = await handleClickShop();

            if (clicked === "back") {
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
        if(currentScene === 'level1') handleMouseMoveLevel(event,canvas);
        if(currentScene === 'score') handleMouseMoveScore(event, canvas);
        if(currentScene === "shop") handleMouseMoveShop(event, canvas);
    });

    window.addEventListener("keydown", (event) => {
        if (currentScene === "login") handleKeyDownLogIn(event);
        if(currentScene === "createAccount") handleKeyDownCreateAccount(event);
        if(currentScene === "level1") handleKeyDownLevel(event);
    });

    window.addEventListener("keyup", (event)=>{
        if(currentScene === 'level1') handleKeyUpLevel(event);
    });
}

//WE INIT RAF wen API fetch is ready
async function init() {
    console.log("Loading configs...");
    await loadPlayerConfigs();
    await loadEnemyConfigs();
    await loadLevelConfigs();
    console.log("Configs ready:", playerConfigs);
    console.log("Configs ready:", enemyConfigs);
    console.log("Configs ready:", levelConfigsDB);
    configsReady = true;
    requestAnimationFrame(gameLoop); // ahora sí arranca
}

function gameLoop(newTime) {
    let deltaTime = (newTime - oldTime);
    if (deltaTime > 50) deltaTime = 50; 

    if (!configsReady) {
        requestAnimationFrame(gameLoop);
        return;
    }

    if(currentScene === 'menu') drawMenu(ctx,canvas);
    else if(currentScene === 'settings') drawSettings(ctx,canvas);
    else if(currentScene === 'login') drawLogIn(ctx,canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx,canvas);
    else if(currentScene === 'start') drawSelect(ctx,canvas);   
    else if(currentScene === 'level1') {
        drawLevel(ctx,canvas, deltaTime);  //levelBase handles all 3 levels now
        updateLiveStats();
        if(goToScore){  //levelBase signals game complete after level 3 deck preview
            currentScene = 'score';
            resetGoToScore();
        }
        else if(goToMenu){
            currentScene = 'menu';
            resetGoToMenu();
            resetLevel();
        }
    }
    else if(currentScene === 'score')  drawScoreScene(ctx,canvas,deltaTime);
    else if(currentScene === "shop") drawShop(ctx, canvas);
    oldTime = newTime;
    requestAnimationFrame(gameLoop);
}

main();
init();

export { loadPlayerStats };