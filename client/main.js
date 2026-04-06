import { draw as drawMenu, handleMouseMove as handleMouseMoveMenu, handleClick as handleClickMenu } from "./scenes/menuScene.js";
import { draw as drawLogIn, handleMouseMove as handleMouseMoveLogIn, handleClick as handleClickLogIn, handleKeyDown as handleKeyDownLogIn, reset as resetLogIn } from "./scenes/logInScene.js";
import { draw as drawSelect, handleMouseMove as handleMouseMoveSelect, handleClick as handleClickSelect, reset as resetSelect, getSelectedCharacter } from "./scenes/selectScene.js";
import { draw as drawLevel1, handleMouseMove as handleMouseMoveLevel1, handleClick as handleClickLevel1, reset as resetLevel1, handleKeyDown as handleKeyDownLevel1,
    handleKeyUp as handleKeyUpLevel1, setSelectedCharacter } from "./scenes/level1Scene.js";
import { draw as drawCreateAccount, handleMouseMove as handleMouseMoveCreateAccount, handleClick as handleClickCreateAccount, handleKeyDown as handleKeyDownCreateAccount, reset as resetCreateAccount } from "./scenes/createAccountScene.js";
import { draw as drawSettings, handleMouseMove as handleMouseMoveSettings, handleClick as handleClickSettings, startDragging, stopDragging, reset as resetSettings } from "./scenes/settingsScene.js";
const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;

let currentScene = "menu"; //we start in menuScene at the beginning of any run
let selectedCharacter = null; 

function main() {
    canvas = document.getElementById("canvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d");

    let clicked;

    canvas.addEventListener("click", (event) => {
        //MENU SCENE
        if(currentScene === 'menu'){
            clicked = handleClickMenu(); //function defined in menuScene that returns which button was clicked

            //start now goes to loginScene, this start comes from menuScene
        if (clicked === 'start'){
            currentScene = 'login'; //Start leads to selectScene where you choose your character
        }
        if (clicked === 'settings'){
            currentScene = 'settings';
        }
        }
        //SETTINGS SCENE
        else if(currentScene === 'settings') {
            clicked = handleClickSettings();
            if(clicked === 'back' || clicked === 'confirm') {
                resetSettings();
                currentScene = 'menu';
            }
        }
        //LOG IN SCENE
        else if (currentScene === 'login'){
            clicked = handleClickLogIn(ctx); //function defined in loginScene that returns which button was clicked
            if(clicked === 'back'){
                resetLogIn();
                currentScene = 'menu';
            }
            if (clicked === 'create'){
                currentScene = 'createAccount'
            }
            if(clicked === 'confirm'){
                currentScene = 'start'; //this start refers to currentScene
            }
        }
        //CREATE ACCOUNT SCENE
        else if(currentScene === 'createAccount') {
            clicked = handleClickCreateAccount(ctx);
            if(clicked === 'back') {
                resetCreateAccount();
                currentScene = 'menu';
            }
            if(clicked === 'login') {
                currentScene = 'login';
            }
            if(clicked === 'confirm') {
                currentScene = 'login';
            }
        }
        //SELECT CHARACTER
        else if (currentScene === 'start'){
            clicked = handleClickSelect(); //function defined in selectScene that returns which button was clicked
            if(clicked === 'back'){
                resetSelect();
                currentScene = 'menu'; 
            }
            if (clicked === 'selectedCharacter'){
                selectedCharacter = getSelectedCharacter();
            }
           //Here we store the character in a variable, this variable is passed as a parameter to a function in level1Scene
            if (clicked === 'confirm'){
                selectedCharacter = getSelectedCharacter();
                setSelectedCharacter(selectedCharacter); //character selection
                currentScene = 'level1';
            }
        }
        //LEVEL 1 SCENE
        else if (currentScene === 'level1'){
            clicked = handleClickLevel1();  
        }
    });
    //SETTINGS SLIDER
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
    });

    window.addEventListener("keydown", (event) => {
        if (currentScene === "login") handleKeyDownLogIn(event);
        if(currentScene === "level1") handleKeyDownLevel1(event);
        if(currentScene === "createAccount") handleKeyDownCreateAccount(event); 
    });

    window.addEventListener("keyup", (event)=>{
        if(currentScene === "level1"){
            handleKeyUpLevel1(event);
        }
    });

    gameLoop();
}

function gameLoop() {
    if(currentScene === 'menu') drawMenu(ctx,canvas);
    else if(currentScene === 'settings') drawSettings(ctx,canvas);
    else if(currentScene === 'login') drawLogIn(ctx,canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx,canvas);
    else if(currentScene === 'start') drawSelect(ctx,canvas);   
    else if(currentScene === 'level1') drawLevel1(ctx,canvas);

    requestAnimationFrame(gameLoop);
}

main();