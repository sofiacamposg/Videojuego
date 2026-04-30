//& logInScene.js
//& Handles the full login screen — draws the UI, manages input fields,
//& validates credentials via the API, and triggers scene transition on success

import { MessageBox } from "../objects/MessageBox.js";  
"use strict"
import { handleMouseMove, drawButton, handleClick, isMouseOverBox } from "../libs/game_functions.js";

//? mouse position tracking
let mouseX = 0;
let mouseY = 0;

//? button definitions
const buttonBack = {
    x: 150,
    y: 70,
    text: "BACK TO MENU"
};
const buttonConfirm = {
    x: 500,
    y: 500,
    text: "CONFIRM"
};
const buttonCreate = {
    x: 850,
    y: 70,
    text: "CREATE ACCOUNT"
};

//? error message box shown when validation fails or credentials are wrong
const errorMessage = new MessageBox(
    "ERROR", "Please fill in both fields", 250, 150, 500, 250);
    errorMessage.addButton("Try again", 440, 300, 120, 50, () => {
        errorMessage.hide();  // dismiss and let user try again
    });

//? input field values and active field tracker
let username = "";  
let password = "";
let activeField = null;  // tracks which input is focused: "username", "password", or null

//? input box positions and sizes (centered at x, y)
const inputUsername = { x: 500, y: 300, w: 500, h: 60 };
const inputPassword = { x: 500, y: 410, w: 500, h: 60 };

//? background image
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

//* draws the full login screen — background, title, input boxes and buttons
function drawLogIn(ctx, canvas){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    //? title with golden outline
    ctx.font = "120px VT323";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("L O G   I N", canvas.width / 2, canvas.height / 2 - 100);
    ctx.strokeStyle = "rgb(255, 187, 86)"; 
    ctx.lineWidth = 2;
    ctx.strokeText("L O G   I N", canvas.width / 2, canvas.height / 2 - 100);
    
    //? draw username and password input boxes
    drawInputBox(ctx, inputUsername.x, inputUsername.y, inputUsername.w, inputUsername.h, "USERNAME");
    drawInputBox(ctx, inputPassword.x, inputPassword.y, inputPassword.w, inputPassword.h, "PASSWORD");

    //? draw navigation and confirm buttons
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonCreate, mouseX, mouseY);

    errorMessage.draw(ctx); 
}

//* draws a single labeled input box with dynamic text display based on active state
function drawInputBox(ctx, centerX, centerY, w, h, label){
    const x = centerX - w / 2;
    const y = centerY - h / 2;

    //? golden border around the input box
    ctx.strokeStyle = "rgb(255, 187, 86)";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    //? label above the box
    ctx.fillStyle = "white";
    ctx.font = "22px 'VT323'";
    ctx.textAlign = "left";
    ctx.fillText(label + ":", x, y - 15);

    //? determine what text to show inside the box
    ctx.font = "25px 'VT323'";
    ctx.textAlign = "left";

    let valueToShow = "";
    if (label === "USERNAME") valueToShow = username;
    if (label === "PASSWORD") valueToShow = "*".repeat(password.length);  // mask password chars

    //? case 1: box is active but empty — show cursor indicator
    if (activeField === label.toLowerCase() && valueToShow.length === 0){
        ctx.fillStyle = "white";
        ctx.fillText("|", x + 18, y + 38);
    //? case 2: box is inactive and empty — show placeholder text
    } else if (valueToShow.length === 0){
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText("click to type...", x + 18, y + 38);
    //? case 3: box has text — show value, append cursor if active
    } else {
        ctx.fillStyle = "white";
        ctx.fillText(valueToShow + (activeField === label.toLowerCase() ? "|" : ""), x + 18, y + 38);
    }
}

//* updates mouse position relative to the canvas each frame
function handleMouseMoveLogIn(event, canvas){
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

//* handles all click events on the login screen
//* checks error box, input fields, and buttons in priority order
//* onSuccess is a callback from main.js — called after successful login to trigger scene change
function handleClickLogIn(ctx, onSuccess){
    //? if error box is visible, let it handle the click first
    if (errorMessage.visible) {
        return errorMessage.handleClick(mouseX, mouseY);
    }

    //? check if any input box was clicked and set it as active
    if (isMouseOverBox(mouseX, mouseY, inputUsername)){
        activeField = "username"; 
        return "username";
    }
    if (isMouseOverBox(mouseX, mouseY, inputPassword)){
        activeField = "password"; 
        return "password";
    }

    //? check navigation buttons
    if (handleClick(mouseX, mouseY, buttonBack, ctx)) return "back";
    if (handleClick(mouseX, mouseY, buttonCreate, ctx)) return "create";

    //? confirm button — validate fields then attempt login
    if (handleClick(mouseX, mouseY, buttonConfirm, ctx)) {
        if (username === "" || password === "") {
            errorMessage.show();  // show error if any field is empty
            return null;
        }
        // pass the onSuccess callback so loginUser can trigger scene change immediately after API responds
        loginUser(onSuccess);
        return null;
    }

    return null;
}

//* handles keyboard input for the currently active input field
function handleKeyDownLogIn(event){
    //? case 1: no field is active — ignore all key input
    if (activeField === null) return;

    //? case 2: backspace — delete the last character from the active field
    if (event.key === "Backspace"){
        event.preventDefault();
        if (activeField === "username") username = username.slice(0, -1);
        if (activeField === "password") password = password.slice(0, -1);
        return;
    }

    //? case 3: enter — deactivate the current field
    if (event.key === "Enter"){
        activeField = null;
        return;
    }

    //? case 4: ignore special keys longer than one character
    if (event.key.length !== 1) return;

    //? case 5: only allow alphanumeric characters and common symbols
    const allowed = /^[a-zA-Z0-9 _\-\.@]$/.test(event.key);
    if (!allowed) return;

    //? append the key to the active field's string
    if (activeField === "username") username += event.key;
    if (activeField === "password") password += event.key;
}

//* returns the current username value
function getUsernameLogIn(){
    return username;
}

//* resets all input fields and state back to defaults
function resetLogIn() {
    username = "";
    password = "";
    activeField = null;
    mouseX = 0;
    mouseY = 0;
}

//===== API =====

//* sends login credentials to the server and handles the response
//* on success: stores player data globally, saves to localStorage, and calls onSuccess callback
//* on failure: shows error message to the user
async function loginUser(onSuccess){
    try{
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        //? server returned an error — wrong credentials or server issue
        if(!res.ok){
            errorMessage.message = "Wrong username or password";
            errorMessage.show();
            return;
        }

        const data = await res.json();
        window.loggedPlayer = data;  // store player globally for access across all scenes
        localStorage.setItem("player", JSON.stringify(data));  // persist for stats page
        window.lastMatchId = null;  // reset match ID so score scene loads fresh data
        console.log("USER LOGGED:", data);

        //? if admin — show the global stats button in the UI
        if (data.role === "admin") {
            const btn = document.getElementById("globalStatsBtn");
            if (btn) btn.style.display = "inline-block";
        }

        //? login successful — trigger the scene change callback from main.js
        if(onSuccess) onSuccess();

    } catch(error){
        //? network or connection error
        console.log(error);
        errorMessage.message = "Connection error";
        errorMessage.show();
    }
}

export { drawLogIn, handleMouseMoveLogIn, handleClickLogIn, handleKeyDownLogIn, resetLogIn };