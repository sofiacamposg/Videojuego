import { drawMenu,  handleMouseMoveMenu, handleClickMenu } from "./scenes/menuScene.js";
import { drawLogIn, handleMouseMoveLogIn, handleClickLogIn, handleKeyDownLogIn, resetLogIn } from "./scenes/logInScene.js";
import { drawSelect, handleMouseMoveSelect, handleClickSelect, resetSelect, getSelectedCharacter } from "./scenes/selectScene.js";
import { getPlayer, drawLevel, handleMouseMoveLevel1, handleClickLevel1, resetLevel1, handleKeyDownLevel1,
    handleKeyUpLevel1, setSelectedCharacter, goToMenu, resetGoToMenu } from "./scenes/levelBase.js";  //all 3 levels now live here
import { getPlayerLevel2, setPlayerLevel2, drawLevel2, handleMouseMoveLevel2, handleClickLevel2,
 resetLevel2, handleKeyDownLevel2, handleKeyUpLevel2, goToMenuLevel2, nextLevelLevel2 } from "./scenes/level2Scene.js";
import { setPlayerLevel3, drawLevel3, handleMouseMoveLevel3, handleClickLevel3, resetLevel3,
handleKeyDownLevel3, handleKeyUpLevel3, goToMenuLevel3, isGameCompleted } from "./scenes/level3Scene.js";
import { drawCreateAccount, handleMouseMoveCreateAccount, handleClickCreateAccount, handleKeyDownCreateAccount, resetCreateAccount } from "./scenes/createAccountScene.js";
import { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings } from "./scenes/settingsScene.js";
import { drawScoreScene, handleClickScoreScene } from "./scenes/scoreScene.js";
import { loadPlayerStats } from "./libs/level_functions.js";
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
        //LEVEL 1 SCENE
        else if (currentScene === 'level1'){
            clicked = handleClickLevel1(ctx); //& manejo de clicks en level1 (aún no implementado)

            if(goToMenu){  //player clicked Home from the pause menu
                resetGoToMenu();
                resetLogIn();
                resetSelect();
                resetLevel1();
                currentScene = "menu";
            }
        }
        //level2 and level3 clicks are handled by levelBase — currentScene stays 'level1' across all 3 levels
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

    //TODO: level transition will be handled inside levelBase once level2 and level3 are merged in
    /*if(currentScene === "level1" && nextLevelLevel1){
        currentPlayer = getPlayer();
        setPlayerLevel2(currentPlayer, cardSystem.playerDeck);
        resetLevel1();
        currentScene = "level2";
    }*/
    //TODO: level2→level3 and level3→score transitions are now internal to levelBase
    if(currentScene === 'menu') drawMenu(ctx,canvas);
    else if(currentScene === 'settings') drawSettings(ctx,canvas);
    else if(currentScene === 'login') drawLogIn(ctx,canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx,canvas);
    else if(currentScene === 'start') drawSelect(ctx,canvas);   
    else if(currentScene === 'level1') {
        drawLevel(ctx,canvas, deltaTime);  //levelBase handles all 3 levels now
        updateLiveStats();
    }
    //level2 and level3 are drawn by drawLevel — currentScene stays 'level1' across all 3
    else if(currentScene === 'score') drawScoreScene(ctx,canvas,deltaTime);

    oldTime = newTime;
    requestAnimationFrame(gameLoop);
}

main();