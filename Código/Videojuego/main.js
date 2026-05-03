/* 
& Handle all possible flows, changes screens, reset and show stats

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

//* === imports ===
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
import { killedEnemies, currentLevel, cardSystem } from "./scenes/levelBase.js";  //live stats come from levelBase now

//* === global variables ===
const canvasWidth = 1000;
const canvasHeight = 600;
let canvas;
let ctx;
let oldTime = 0;
let currentScene = "menu";
let currentPlayer = null;
let selectedCharacter = null;
let loginFromShop = false;  //login from show, flag to remember to go back to shop
let configsReady = false;  //API fetch info

//* === api ===
function updateLiveStats() {  //~ player stats, right-side stats
    if (!window.loggedPlayer) return;  //no player logged

    document.getElementById("username").textContent = window.loggedPlayer.username;  //put user name in the stats
    //deafult data till user start a match
    let level = "-";  
    let kills = 0;
    let cards = 0;

    if (currentScene === "level1") {  //there is a match now, so display the correct info
        level = currentLevel;
        kills = killedEnemies;
        cards = cardSystem.playerDeck.length;
    }

    document.getElementById("level").textContent = level;
    document.getElementById("kills").textContent = kills;
    document.getElementById("fame").textContent = currentPlayer.fame;
    document.getElementById("cards").textContent = cards;
}

function resetPanel() {  //~ go to default info
    document.getElementById("username").textContent = "-";
    document.getElementById("level").textContent = "-";
    document.getElementById("kills").textContent = "-";
    document.getElementById("fame").textContent = "-";
    document.getElementById("cards").textContent = "-";
    document.getElementById("runs").textContent = "-";
    document.getElementById("wins").textContent = "-";
    document.getElementById("losses").textContent = "-";
}

function logout() {  //~ reset everything, player log out
    window.loggedPlayer = null;
    localStorage.removeItem("player");

    resetLogIn();
    resetSelect();
    resetLevel();
    resetPanel();

    currentPlayer = null;
    selectedCharacter = null;
}

//* === funtions ===
function main() {  //~ change scenes function, knows the flow and handle all buttons directions
    canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d"); 
    let clicked;

    canvas.addEventListener("click", async (event) => {
        //MENU SCENE
        if(currentScene === 'menu'){
            clicked = handleClickMenu(ctx);
            if (clicked === 'start') {  //player wants to start playing...
                    loginFromShop = false;  //they clicked start, so we do not need to go to shop after
                    resetLogIn();  //clean everything
                    resetPanel();
                    currentScene = 'login';  //... but they need to log in first
            }
            if (clicked === 'settings') currentScene = 'settings';   //user wants to go to settings
            if (clicked === 'shop') {  //user wants to go to shop
                if (!window.loggedPlayer) { //case 1: there is not a player logged in
                    loginFromShop = true;
                    resetLogIn();  //clean before continuing
                    resetPanel();
                    currentScene = "login";  //go to login
                } else {
                    currentScene = "shop";  //case 2: there is a player logged in, go to shop
                }
            }
        }
        //SETTINGS SCENE
        else if(currentScene === 'settings') {
            clicked = handleClickSettings(ctx);  //all click logic is handled in settings scene
            if(clicked === 'back' || clicked === 'confirm') {  //if player clicks confirm or back, go to menu
                resetSettings();
                currentScene = 'menu';
            }
        }
        //LOG IN SCENE
        else if (currentScene === 'login'){
            // we give a callback funtion to handleClick, when api says credentials are ok, we change scene inmediatly
            // no second click needed. debugged with IA
            clicked = handleClickLogIn(ctx, () => {
                if (loginFromShop) {  // player wants to log in and then go back to store
                    (async () => {  //update stats
                        await loadPlayerStats(window.loggedPlayer.player_id, currentScene);
                    })();
                    loginFromShop = false;
                    currentScene = "shop";   // go back to shop
                } else {
                    setTimeout(() => {  //wait a sec to update stats
                        loadPlayerStats(window.loggedPlayer.player_id, currentScene);
                    }, 500);
                    resetSelect(); //clean before going
                    currentScene = 'start';  //start normal game flow
                }
            });
            if(clicked === 'back'){ //user wants to go to menu
                resetLogIn();
                currentScene = 'menu';
            }
            if (clicked === 'create'){  //user wants to create a new account
                resetLogIn();
                currentScene = 'createAccount';
            }
        }
        //CREATE ACCOUNT SCENE
        else if(currentScene === 'createAccount') {
            // we give a callback funtion to handleClick, when api says credentials are ok, we change scene inmediatly
            // no second click needed. debugged with IA
            clicked = handleClickCreateAccount(ctx, () => {
                resetLogIn();  //clean before going
                currentScene = 'login';  //go to login
            });
            if(clicked === 'back') {  //go back to menu
                resetCreateAccount();  //clean before leaving
                currentScene = 'menu';
            }
            if(clicked === 'login') currentScene = 'login';  //go to log in
        }
        //SELECT CHARACTER
        else if (currentScene === 'start'){
            if (!window.loggedPlayer) {  //there is no player logged in
                currentScene = "login";
                return;
            }
            clicked = handleClickSelect(ctx); 
            if(clicked === 'back'){  //user wants to go to menu
                resetSelect(); 
                currentScene = 'menu';
            }
            if (clicked === 'selectedCharacter'){  //user has selected a charcter
                selectedCharacter = getSelectedCharacter();
            }
            if (clicked === 'confirm'){  //user wants to start playing
                selectedCharacter = getSelectedCharacter();
                setSelectedCharacter(selectedCharacter);
                currentPlayer = getPlayer();  //grab the player that was just created/logged in
                currentScene = 'level1';
            }
        }
        //LEVELS SCENE
        else if (currentScene === 'level1'){  //start the game
            clicked = handleClickLevel(ctx); 
            if(goToMenu){  //player clicked Home from the pause menu
                resetGoToMenu();
                logout();
                currentScene = "menu";
            }
        }
        //SCORE SCENE
        else if(currentScene === "score"){  //player lose/win and is in score scene
            clicked = handleClickScoreScene();
            if(clicked === "exit"){  //wants to go to menu
                (async () => {
                    await loadPlayerStats(window.loggedPlayer.player_id, "menu");  //update the stats
                    currentScene = "menu";
                    resetScoreScene(); //clean before leaving
                })();
            }
            if(clicked === "again"){  //player want to play again
                console.log("ANTES DE CREAR PLAYER:", window.loggedPlayer.fame);
                resetLevel();  //reset everything
                (async () => {  //update stats
                    await loadPlayerStats(window.loggedPlayer.player_id, "level1");
                    resetScoreScene();  //clean before leaving
                    // Creates player again
                    setSelectedCharacter(selectedCharacter);
                    currentPlayer = getPlayer();
                    currentScene = "level1";
                })();
            }
        }
        //SHOP SCENE
        else if (currentScene === "shop") {  //player want to shop
            clicked = await handleClickShop();

            if (clicked === "back") {  //player want to go to menu
                currentScene = "menu";
            }
        }
    });

    canvas.addEventListener("mousedown", () => {
        if(currentScene === "settings") startDragging();  //player is moving the volume bar
    });

    canvas.addEventListener("mouseup", () => {
        if(currentScene === "settings") stopDragging();  //player has stoped moving the vollume bar
    });

    canvas.addEventListener("mousemove", (event) => {  //calls the function depending on the scene
        if(currentScene === 'menu') handleMouseMoveMenu(event,canvas);
        if(currentScene === 'settings') handleMouseMoveSettings(event,canvas);
        if(currentScene === 'login') handleMouseMoveLogIn(event,canvas);
        if(currentScene === 'createAccount') handleMouseMoveCreateAccount(event,canvas);
        if(currentScene === 'start') handleMouseMoveSelect(event,canvas);
        if(currentScene === 'level1') handleMouseMoveLevel(event,canvas);
        if(currentScene === 'score') handleMouseMoveScore(event, canvas);
        if(currentScene === "shop") handleMouseMoveShop(event, canvas);
    });

    window.addEventListener("keydown", (event) => {  //calls the function depending on the scene
        if (currentScene === "login") handleKeyDownLogIn(event);
        if(currentScene === "createAccount") handleKeyDownCreateAccount(event);
        if(currentScene === "level1") handleKeyDownLevel(event);
    });

    window.addEventListener("keyup", (event)=>{  //track when user is not pressing any key
        if(currentScene === 'level1') handleKeyUpLevel(event);
    });
}

async function init() {  //~ bring everything you need and do not start till youre ready
    console.log("Loading configs...");
    await loadPlayerConfigs();
    await loadEnemyConfigs();
    await loadLevelConfigs();
    console.log("Configs ready:", playerConfigs);
    console.log("Configs ready:", enemyConfigs);
    console.log("Configs ready:", levelConfigsDB);
    configsReady = true;
    requestAnimationFrame(gameLoop); //when everythings ready, start the game
}

function gameLoop(newTime) {  //~ update everything depending on new tiem
    let deltaTime = (newTime - oldTime);  //update delta time
    if (deltaTime > 50) deltaTime = 50; 

    if (!configsReady) {  //if config arent ready, request animation and wait
        requestAnimationFrame(gameLoop);
        return;
    }
    
    //calls the function depending on the scene
    if(currentScene === 'menu') drawMenu(ctx,canvas);
    else if(currentScene === 'settings') drawSettings(ctx,canvas);
    else if(currentScene === 'login') drawLogIn(ctx,canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx,canvas);
    else if(currentScene === 'start') drawSelect(ctx,canvas);   
    else if(currentScene === 'level1') {
        drawLevel(ctx,canvas, deltaTime);  //levelBase handles all 3 levels 
        updateLiveStats();
        if(goToScore){  //levelBase signals when to go to score 
            currentScene = 'score';
            resetGoToScore();  //clean before going
        }
        else if(goToMenu){  //player wants to go to menu scene
            currentScene = 'menu';
            resetGoToMenu(); //clean everything before going
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

//* === exports ===
export { loadPlayerStats };