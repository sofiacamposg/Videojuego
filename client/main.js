import { drawMenu,  handleMouseMoveMenu, handleClickMenu } from "./scenes/menuScene.js";
import { drawLogIn, handleMouseMoveLogIn, handleClickLogIn, handleKeyDownLogIn, resetLogIn } from "./scenes/logInScene.js";
import { drawSelect, handleMouseMoveSelect, handleClickSelect, resetSelect, getSelectedCharacter } from "./scenes/selectScene.js";
import { getPlayer, drawLevel, handleMouseMoveLevel, handleClickLevel, resetLevel, handleKeyDownLevel,
        handleKeyUpLevel, setSelectedCharacter, goToMenu, resetGoToMenu, goToScore, resetGoToScore } from "./scenes/levelBase.js";  //all 3 levels now live here
import { drawCreateAccount, handleMouseMoveCreateAccount, handleClickCreateAccount, handleKeyDownCreateAccount, resetCreateAccount } from "./scenes/createAccountScene.js";
import { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings } from "./scenes/settingsScene.js";
import { drawScoreScene, handleClickScoreScene, handleMouseMoveScore, loadMatchSummary } from "./scenes/scoreScene.js";
import { loadPlayerStats } from "./libs/level_functions.js";
import { loadPlayerConfigs, playerConfigs } from "./libs/levelConfig.js";
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
                currentPlayer = getPlayer();  //grab the player that was just created
                //API
                setTimeout(() => {
                    loadPlayerStats(window.loggedPlayer.player_id, currentScene);
                }, 500);
                currentScene = 'level1';
            }
        }
        //LEVELS SCENE
        else if (currentScene === 'level1'){
            clicked = handleClickLevel(ctx); 
            if(goToMenu){  //player clicked Home from the pause menu
                resetGoToMenu();
                resetLogIn();
                resetSelect();
                resetLevel();
                currentScene = "menu";
            }
        }
        //Score Scene
        else if(currentScene === "score"){
            clicked = handleClickScoreScene();
            if(clicked === "exit"){
                currentScene = "menu";
            }
            if(clicked === "again"){
                resetLevel();
                currentScene = "level1";
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
    console.log("Configs ready:", playerConfigs);
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
            //Data
            loadMatchSummary();
            resetGoToScore();
            currentScene = 'score';
        }
    }
    else if(currentScene === 'score') drawScoreScene(ctx,canvas,deltaTime);

    oldTime = newTime;
    requestAnimationFrame(gameLoop);
}

main();
init();

export { loadPlayerStats };