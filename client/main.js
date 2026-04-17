import { drawMenu,  handleMouseMoveMenu, handleClickMenu } from "./scenes/menuScene.js";
import { drawLogIn, handleMouseMoveLogIn, handleClickLogIn, handleKeyDownLogIn, resetLogIn } from "./scenes/logInScene.js";
import { drawSelect, handleMouseMoveSelect, handleClickSelect, resetSelect, getSelectedCharacter } from "./scenes/selectScene.js";
import { getPlayerLevel1, drawLevel1, handleMouseMoveLevel1, handleClickLevel1, resetLevel1, handleKeyDownLevel1,
    handleKeyUpLevel1, setSelectedCharacter, goToMenuLevel1, nextLevelLevel1 } from "./scenes/level1Scene.js";
import { getPlayerLevel2, setPlayerLevel2, drawLevel2, handleMouseMoveLevel2, handleClickLevel2,
 resetLevel2, handleKeyDownLevel2, handleKeyUpLevel2, nextLevelLevel2 } from "./scenes/level2Scene.js";
import { setPlayerLevel3, drawLevel3, handleMouseMoveLevel3, handleClickLevel3, resetLevel3,
handleKeyDownLevel3, handleKeyUpLevel3 } from "./scenes/level3Scene.js";
import { drawCreateAccount, handleMouseMoveCreateAccount, handleClickCreateAccount, handleKeyDownCreateAccount, resetCreateAccount } from "./scenes/createAccountScene.js";
import { drawSettings, handleMouseMoveSettings, handleClickSettings, startDragging, stopDragging, resetSettings } from "./scenes/settingsScene.js";

//& dimensiones fijas del canvas
const canvasWidth = 1000;
const canvasHeight = 600;

let canvas;
let ctx;
let oldTime = 0; //& guarda el tiempo del frame anterior para calcular deltaTime
let currentScene = "menu"; //& escena activa, controla qué se dibuja y qué eventos se manejan
let currentPlayer = null;
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
            clicked = handleClickMenu(ctx); //& detecta qué botón se presionó en el menú

        if (clicked === 'start'){
            currentScene = 'login';
        }
        if (clicked === 'settings'){
            currentScene = 'settings'; 
        }
        }
        //SETTINGS SCENE
        else if(currentScene === 'settings') {
            clicked = handleClickSettings(ctx);
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
                selectedCharacter = getSelectedCharacter(); //& actualiza el personaje resaltado al hacer click
            }
           //& al confirmar, se guarda el personaje y se lo pasa a level1 antes de cambiar de escena
            if (clicked === 'confirm'){
                selectedCharacter = getSelectedCharacter();
                setSelectedCharacter(selectedCharacter); //& pone el personaje seleccionado en level1Scene
                currentPlayer = getPlayerLevel1();
                currentScene = 'level1';
            }
        }
        //LEVEL 1 SCENE
        else if (currentScene === 'level1'){
            clicked = handleClickLevel1(ctx); //& manejo de clicks en level1 (aún no implementado)

            if(goToMenuLevel1){
                //& si level1 pide volver al menú, resetea todas las escenas involucradas
                resetLogIn();
                resetSelect();
                resetLevel1();
                currentScene = "menu";
            }
        }
    });

    //& slider de settings inicia el arrastre
    canvas.addEventListener("mousedown", () => {
        if(currentScene === "settings") startDragging();
    });

    canvas.addEventListener("mouseup", () => {
        if(currentScene === "settings") stopDragging();
    });

    //& mousemove despacha el evento a la escena activa para hover y arrastre
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

    //& keydown se despacha solo a las escenas que necesitan input de teclado
    window.addEventListener("keydown", (event) => {
        if (currentScene === "login") handleKeyDownLogIn(event);
        if(currentScene === "createAccount") handleKeyDownCreateAccount(event);
        if(currentScene === "level1") handleKeyDownLevel1(event);
        if(currentScene === "level2") handleKeyDownLevel2(event);
        if(currentScene === "level3") handleKeyDownLevel3(event);
    });

    //& keyup se usa en level1 para detectar cuando el jugador suelta una tecla de movimiento
    window.addEventListener("keyup", (event)=>{
        if(currentScene === "level1") handleKeyUpLevel1(event);
        if(currentScene === "level2") handleKeyUpLevel2(event);
        if(currentScene === "level3") handleKeyUpLevel3(event);
    });

    requestAnimationFrame(gameLoop); 
}

function gameLoop(newTime) {

    let deltaTime = (newTime - oldTime) / 1000;
    oldTime = newTime;

    if (deltaTime > 50) deltaTime = 50; 

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
    if(currentScene === 'menu') drawMenu(ctx,canvas);
    else if(currentScene === 'settings') drawSettings(ctx,canvas);
    else if(currentScene === 'login') drawLogIn(ctx,canvas);
    else if(currentScene === 'createAccount') drawCreateAccount(ctx,canvas);
    else if(currentScene === 'start') drawSelect(ctx,canvas);   
    else if(currentScene === 'level1') drawLevel1(ctx,canvas, deltaTime);
    else if(currentScene === 'level2') drawLevel2(ctx,canvas,deltaTime);
    else if(currentScene === 'level3') drawLevel3(ctx,canvas,deltaTime);

    
    oldTime = newTime; //& actualiza oldTime para el siguiente frame
    requestAnimationFrame(gameLoop); //& solicita el siguiente frame al navegador
}

main(); //& punto de entrada, inicializa canvas y arranca el juego