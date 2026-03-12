import { draw as drawMenu, handleMouseMove as handleMouseMoveMenu, handleClick as handleClickMenu } from "./scenes/menuScene.js";
import { draw as drawLogIn, handleMouseMove as handleMouseMoveLogIn, handleClick as handleClickLogIn, handleKeyDown as handleKeyDownLogIn, getUsername, getPassword, reset as resetLogIn } from "./scenes/logInScene.js";
import { draw as drawSelect, handleMouseMove as handleMouseMoveSelect, handleClick as handleClickSelect, reset as resetSelect } from "./scenes/selectScene.js";
import { draw as drawLevel1, handleMouseMove as handleMouseMoveLevel1, handleClick as handleClickLevel1, reset as resetLevel1, handleKeyDown as handleKeyDownLevel1, handleKeyUp as handleKeyUpLevel1 } from "./scenes/level1Scene.js";
import { draw as drawCreateAccount, handleMouseMove as handleMouseMoveCreateAccount, handleClick as handleClickCreateAccount, handleKeyDown as handleKeyDownCreateAccount, getAccountData, reset as resetCreateAccount } from "./scenes/createAccountScene.js";
import { draw as drawSettings, handleMouseMove as handleMouseMoveSettings, handleClick as handleClickSettings, startDragging, stopDragging, reset as resetSettings } from "./scenes/settingsScene.js";

const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;

let currentScene = "menu";
let playerName = "";

const users = {
    alex: "1234",
    sofia: "abcd",
    test: "test"
};

function main() {
    canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");

    let clicked;

    canvas.addEventListener("click", () => {
        if(currentScene === 'menu') {
            clicked = handleClickMenu();
            if(clicked === 'login') currentScene = 'login';
            else if(clicked === 'start') currentScene = 'select'; // ahora va a la selección de personajes
            else if(clicked === 'settings') currentScene = 'settings';
        }
        else if(currentScene === 'settings') {
            clicked = handleClickSettings();
            if(clicked === 'back' || clicked === 'confirm') {
                resetSettings();
                currentScene = 'menu';
            }
        }
        else if(currentScene === 'login') {
            clicked = handleClickLogIn();
            if(clicked === 'back') {
                resetLogIn();
                currentScene = 'menu';
            }
            else if(clicked === 'create') currentScene = 'createAccount';
            else if(clicked === 'confirm') {
                const username = getUsername();
                const password = getPassword();
                if(users[username] && users[username] === password){
                    playerName = username;
                    currentScene = 'select';
                } else {
                    alert("Incorrect username or password");
                }
            }
        }
        else if(currentScene === 'createAccount') {
            clicked = handleClickCreateAccount();
            if(clicked === 'back') {
                resetCreateAccount();
                currentScene = 'login';
            }
            else if(clicked === 'confirm') {
                const data = getAccountData();
                if(users[data.username]){
                    alert("Username already exists");
                } else {
                    users[data.username] = data.password;
                    alert("Account created");
                    resetCreateAccount();
                    currentScene = 'login';
                }
            }
        }
        else if(currentScene === 'select') {
            clicked = handleClickSelect();
            if(clicked === 'back') {
                resetSelect();
                currentScene = 'menu';
            }
            else if(clicked === 'confirm') currentScene = 'level1';
        }
        else if(currentScene === 'level1') {
            clicked = handleClickLevel1();
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
        if(currentScene === 'select') handleMouseMoveSelect(event,canvas);
        if(currentScene === 'level1') handleMouseMoveLevel1(event,canvas);
    });

    window.addEventListener("keydown", (event) => {
        if(currentScene === "login") handleKeyDownLogIn(event);
        if(currentScene === "createAccount") handleKeyDownCreateAccount(event);
        if(currentScene === "level1") handleKeyDownLevel1(event);
    });

    window.addEventListener("keyup", (event) => {
        if(currentScene === "level1") handleKeyUpLevel1(event);
    });

    gameLoop();
}

function gameLoop() {
    if(currentScene === 'menu') drawMenu(ctx,canvas);
    else if(currentScene === 'settings') drawSettings(ctx,canvas);
    else if(currentScene === 'login') drawLogIn(ctx,canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx,canvas);
    else if(currentScene === 'select') drawSelect(ctx,canvas);   
    else if(currentScene === 'level1') drawLevel1(ctx,canvas);

    requestAnimationFrame(gameLoop);
}

main();