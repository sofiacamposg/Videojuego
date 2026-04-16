import { draw as drawMenu, handleClick as handleClickMenu } from "./scenes/menuScene.js";
import { draw as drawLogIn, handleClick as handleClickLogIn, handleKeyDown as handleKeyDownLogIn, reset as resetLogIn } from "./scenes/logInScene.js";
import { draw as drawSelect, handleClick as handleClickSelect, reset as resetSelect, getSelectedCharacter } from "./scenes/selectScene.js";
import { draw as drawLevel1, handleClick as handleClickLevel1, reset as resetLevel1, handleKeyDown as handleKeyDownLevel1,
    handleKeyUp as handleKeyUpLevel1, setSelectedCharacter, goToMenu as goToMenuLevel1 } from "./scenes/level1Scene.js";
import { draw as drawCreateAccount, handleClick as handleClickCreateAccount, handleKeyDown as handleKeyDownCreateAccount, reset as resetCreateAccount } from "./scenes/createAccountScene.js";
import { draw as drawSettings, handleDrag, handleClick as handleClickSettings, reset as resetSettings } from "./scenes/settingsScene.js";
import { handleMouseMove } from "./libs/game_functions.js";

//& dimensiones fijas del canvas
const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;
let oldTime = 0; //& guarda el tiempo del frame anterior para calcular deltaTime
let currentScene = "menu"; //& escena activa, controla qué se dibuja y qué eventos se manejan
let selectedCharacter = null; //& personaje elegido en selectScene, se pasa a level1

function main() {
    //& obtiene el elemento canvas del DOM y le asigna dimensiones
    canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d"); 

    let clicked; //& guarda el resultado del click según la escena actual

    canvas.addEventListener("click", (event) => {
        //MENU SCENE
        if(currentScene === 'menu'){
            clicked = handleClickMenu(); //& detecta qué botón se presionó en el menú

        if (clicked === 'start'){
            currentScene = 'login';
        }
        if (clicked === 'settings'){
            currentScene = 'settings'; 
        }
        }
        //SETTINGS SCENE
        else if(currentScene === 'settings') {
            clicked = handleClickSettings();
            if(clicked === 'back' || clicked === 'confirm') {
                resetSettings(); //TODO esto resetea settings incluso si son modificados?
                currentScene = 'menu';
            }
        }
        //LOG IN SCENE
        else if (currentScene === 'login'){
            clicked = handleClickLogIn(ctx); 
            if(clicked === 'back'){
                resetLogIn(); //& limpia los campos del login antes de volver
                currentScene = 'menu';
            }
            if (clicked === 'create'){
                currentScene = 'createAccount'; 
            }
            if(clicked === 'confirm'){
                currentScene = 'start'; 
            }
        }
        //CREATE ACCOUNT SCENE
        else if(currentScene === 'createAccount') {
            clicked = handleClickCreateAccount(ctx);
            if(clicked === 'back') {
                resetCreateAccount(); //& limpia los campos antes de volver al menú
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
            clicked = handleClickSelect(); 
            if(clicked === 'back'){
                resetSelect(); 
                currentScene = 'menu';
            }
            if (clicked === 'selectedCharacter'){
                selectedCharacter = getSelectedCharacter(); //& actualiza el personaje resaltado al hacer click
            }
           //& al confirmar, se guarda el personaje y se lo pasa a level1 antes de cambiar de escena
            if (clicked === 'confirm'){
                selectedCharacter = getSelectedCharacter();
                setSelectedCharacter(selectedCharacter); //& pone el personaje seleccionado en level1Scene
                currentScene = 'level1';
            }
        }
        //LEVEL 1 SCENE
        else if (currentScene === 'level1'){
            clicked = handleClickLevel1(); //& manejo de clicks en level1 (aún no implementado)

            if(goToMenuLevel1){
                //& si level1 pide volver al menú, resetea todas las escenas involucradas
                resetLogIn();
                resetSelect();
                resetLevel1();
                currentScene = "menu";
            }
        }
    });

    canvas.addEventListener("mousedown", () => {
        if(currentScene === "settings") handleDrag('down');
    });

    canvas.addEventListener("mouseup", () => {
        if(currentScene === "settings") handleDrag('up');
    });

    //& mousemove actualiza mouseX/mouseY globalmente; settings también actualiza el slider
    canvas.addEventListener("mousemove", (event) => {
        handleMouseMove(event, canvas);
        if(currentScene === 'settings') handleDrag('move');
    });

    //& keydown se despacha solo a las escenas que necesitan input de teclado
    window.addEventListener("keydown", (event) => {
        if (currentScene === "login") handleKeyDownLogIn(event);
        if(currentScene === "level1") handleKeyDownLevel1(event);
        if(currentScene === "createAccount") handleKeyDownCreateAccount(event);
    });

    //& keyup se usa en level1 para detectar cuando el jugador suelta una tecla de movimiento
    window.addEventListener("keyup", (event)=>{
        if(currentScene === "level1"){
            handleKeyUpLevel1(event);
        }
    });

    gameLoop(0); //& arranca el game loop con tiempo inicial 0
}

function gameLoop(newTime) {
    let deltaTime = newTime - oldTime; //& tiempo transcurrido entre frames en ms
    //& dibuja la escena activa
    if(currentScene === 'menu') drawMenu(ctx,canvas);
    else if(currentScene === 'settings') drawSettings(ctx,canvas);
    else if(currentScene === 'login') drawLogIn(ctx,canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx,canvas);
    else if(currentScene === 'start') drawSelect(ctx,canvas);
    else if(currentScene === 'level1') drawLevel1(ctx,canvas,deltaTime);

    oldTime = newTime; //& actualiza oldTime para el siguiente frame
    requestAnimationFrame(gameLoop); //& solicita el siguiente frame al navegador
}

main(); //& punto de entrada, inicializa canvas y arranca el juego
