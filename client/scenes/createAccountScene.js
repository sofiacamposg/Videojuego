//& createAccountScene.js
//& Handles the full create account screen — draws the UI, manages input fields,
//& validates form data, and registers new users via the API

import { MessageBox } from "../objects/MessageBox.js";  
"use strict"
import { 
    handleMouseMove, 
    drawButton, 
    handleClick, 
    isMouseOverBox 
} from "../libs/game_functions.js";

//? mouse position tracking
let mouseX = 0;
let mouseY = 0;
let registerSuccess = false;  // flag set to true after a successful registration

//? button definitions
const buttonBack = {
    x: 850,
    y: 70,
    text: "BACK TO MENU"
};
const buttonLogIn = {
    x: 150,
    y: 70,
    text: "BACK TO LOG IN"
};
const buttonConfirm = {
    x: 500,
    y: 540,
    text: "CONFIRM"
};

//? error message box shown when validation fails or API returns an error
const errorMessage = new MessageBox(
    "ERROR", "Please fill in all fields", 250, 150, 500, 250);
    errorMessage.addButton("Try again", 440, 300, 120, 50, () => {
        errorMessage.hide();  // dismiss the error and let the user try again
    });

//? input field values and active field tracker
let username = "";
let password = "";
let name = "";
let activeField = null;  // tracks which input is currently focused: "username", "password", or "name"

//? input box positions and sizes (centered at x, y)
const inputUsername = { x: 540, y: 250, w: 500, h: 60 };
const inputPassword = { x: 540, y: 325, w: 500, h: 60 };
const inputName = { x: 540, y: 400, w: 500, h: 60 };

//? background image
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

//* draws the full create account screen — background, title, input boxes and buttons
function drawCreateAccount(ctx, canvas){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    //? title with golden outline
    ctx.fillStyle = "white";
    ctx.font = "70px 'VT323'";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(255, 187, 86)"; 
    ctx.lineWidth = 2;
    ctx.strokeText("C R E A T E   A C C O U N T", canvas.width / 2, canvas.height / 2 - 120);
    ctx.fillText("C R E A T E   A C C O U N T", canvas.width / 2, canvas.height / 2 - 120);

    //? draw all three input boxes
    drawInputBox(ctx, inputUsername.x, inputUsername.y, inputUsername.w, inputUsername.h, "USERNAME");
    drawInputBox(ctx, inputPassword.x, inputPassword.y, inputPassword.w, inputPassword.h, "PASSWORD");
    drawInputBox(ctx, inputName.x, inputName.y, inputName.w, inputName.h, "NAME");

    //? draw navigation and confirm buttons
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonLogIn, mouseX, mouseY);

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

  //? label to the left of the box
  ctx.fillStyle = "white";
  ctx.font = "22px 'VT323'";
  ctx.textAlign = "left";
  ctx.fillText(label + ":", x - 90, y + 35);

  //? determine what text to show inside the box
  ctx.font = "25px 'VT323'";
  ctx.textAlign = "left";

  let valueToShow = "";
  if (label === "USERNAME") valueToShow = username;
  if (label === "PASSWORD") valueToShow = "*".repeat(password.length);  // mask password
  if (label === "NAME") valueToShow = name;
  
  //? case 1: box is active but empty — show cursor indicator
  if (activeField === label.toLowerCase() && valueToShow.length === 0){
      ctx.fillStyle = "white";
      ctx.fillText("|", x + 20, y + 38);
  //? case 2: box is inactive and empty — show placeholder text
  } else if (valueToShow.length === 0){
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("click to type...", x + 20, y + 38);
  //? case 3: box has text — show value, append cursor if active
  } else {
      ctx.fillStyle = "white";
      ctx.fillText(valueToShow + (activeField === label.toLowerCase() ? "|" : ""), x + 20, y + 38);
  }
}

//* updates mouse position relative to the canvas each frame
function handleMouseMoveCreateAccount(event, canvas){
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

//* handles all click events on the create account screen
//* checks for error box, input fields, and buttons in order
function handleClickCreateAccount(ctx){
    //? if registration just succeeded, confirm and move to login
    if(registerSuccess){
        registerSuccess = false;
        return "confirm";
    }

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
    if (isMouseOverBox(mouseX, mouseY, inputName)){
        activeField = "name"; 
        return "name";
    }

    //? check navigation buttons
    if (handleClick(mouseX, mouseY, buttonBack, ctx)) return "back";
    if (handleClick(mouseX, mouseY, buttonLogIn, ctx)) return "login";

    //? confirm button — validate fields then attempt registration
    if (handleClick(mouseX, mouseY, buttonConfirm, ctx)) {
        if (username === "" || password === "" || name === "") {
            errorMessage.show();  // show error if any field is empty
            return null;
        }
        registerUser();
        return null;
    }

    return null;
}

//* handles keyboard input for the currently active input field
function handleKeyDownCreateAccount(event){
  //? case 1: no field is active — ignore all key input
  if (activeField === null) return;

  //? case 2: backspace — delete the last character from the active field
  if (event.key === "Backspace") {
    event.preventDefault();
    if (activeField === "username") username = username.slice(0, -1);
    if (activeField === "password") password = password.slice(0, -1);
    if (activeField === "name") name = name.slice(0, -1);
    return;
  }

  //? case 3: enter — deactivate the current field
  if (event.key === "Enter") {
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
  if (activeField === "name") name += event.key;
}

//* returns the current username value
function getUsername(){
  return username;
}

//* resets all input fields and state back to defaults
function resetCreateAccount(){
  username = "";
  password = "";
  name = "";
  activeField = null;
  mouseX = 0;
  mouseY = 0;
}

//===== API =====

//* sends registration data to the server and handles success or error responses
async function registerUser(){
    try{
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                name: name,
            })
        });

        //? server returned an error — show the error message to the user
        if(!res.ok){
            const text = await res.text();
            errorMessage.message = text;
            errorMessage.show();
            return;
        }

        console.log("USER CREATED");
        registerSuccess = true;  // triggers scene transition on next click

    } catch(error){
        //? network or connection error
        console.log(error);
        errorMessage.message = "Connection error";
        errorMessage.show();
    }
}

export { drawCreateAccount, handleMouseMoveCreateAccount, handleClickCreateAccount, handleKeyDownCreateAccount, resetCreateAccount };