/* 
& Login scene, includes:
& buttons, draw, helpers, and api post

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/
"use strict"

//* === imports ===
import { MessageBox } from "../objects/MessageBox.js";  
import { handleMouseMove, drawButton, handleClick, isMouseOverBox } from "../libs/game_functions.js";

//* === mouse track ===
let mouseX = 0;
let mouseY = 0;

//* === buttons ===
const buttonBack = { // BACK TO MENU BUTTON
    x: 150,
    y: 70,
    text: "BACK TO MENU"
};
const buttonConfirm = {  // CONFIRM LOG IN BUTTON
    x: 500,
    y: 500,
    text: "CONFIRM"
};
const buttonCreate = {  // CREATE ACCOUNT BUTTON
    x: 850,
    y: 70,
    text: "CREATE ACCOUNT"
};
const errorMessage = new MessageBox(  // error message creation
    "ERROR", "Please fill in both fields", 250, 150, 500, 250);
    errorMessage.addButton("Try again", 440, 300, 120, 50, () =>{  // hide when clicked
        errorMessage.hide()
    });

//* === inputs ===
let username = "";  
let password = "";
let activeField = null; //username / password / null
//dimentions
const inputUsername = { x: 500, y: 300, w: 500, h: 60 };
const inputPassword = { x: 500, y: 410, w: 500, h: 60 };

//~ background, our assets were made by NanoBanana
let backgroundImage = new Image();
backgroundImage.src = "../Videojuego/assets/PortadaBase.png";

//* === functions ===
function drawLogIn(ctx, canvas){  //~ draw every element on the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // title
    ctx.font = "120px VT323";
    ctx.textAlign = "center";
    ctx.fillStyle = "white"; //text
    ctx.fillText("L O G   I N", canvas.width / 2, canvas.height / 2 - 100);
    ctx.strokeStyle = "rgb(255, 187, 86)"; 
    ctx.lineWidth = 2;
    ctx.strokeText("L O G   I N", canvas.width / 2, canvas.height / 2 - 100);
    
    // inputs boxes
    drawInputBox(ctx, inputUsername.x, inputUsername.y, inputUsername.w, inputUsername.h, "USERNAME");
    drawInputBox(ctx, inputPassword.x, inputPassword.y, inputPassword.w, inputPassword.h, "PASSWORD");

    // buttons
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonCreate, mouseX, mouseY);

    errorMessage.draw(ctx); //edage case
}

function drawInputBox(ctx, centerX, centerY, w, h, label){  //~ draw the labels and input boxes
    const x = centerX - w / 2;
    const y = centerY - h / 2;

    // box
    ctx.strokeStyle = "rgb(255, 187, 86)";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // label
    ctx.fillStyle = "white";
    ctx.font = "22px 'VT323'";
    ctx.textAlign = "left";
    ctx.fillText(label + ":", x, y - 15);

    // text inside box
    ctx.font = "25px 'VT323'";
    ctx.textAlign = "left";

    let valueToShow = "";
    if (label === "USERNAME") valueToShow = username;  //shows what user writes
    if (label === "PASSWORD") valueToShow = "*".repeat(password.length);  //secret password

    // check if any box is active
    if (activeField === label.toLowerCase() && valueToShow.length === 0){  //case 1: active but without text, shows | to let know the user they can type now
        ctx.fillStyle = "white";
        ctx.fillText("|", x + 18, y + 38);
    } else if (valueToShow.length === 0){  //case 2: its inactive and without text
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText("click to type...", x + 18, y + 38);
    } else{  //case 3: has text and shows text
        ctx.fillStyle = "white";
        ctx.fillText(valueToShow + (activeField === label.toLowerCase() ? "|" : ""), x + 18, y + 38);  //check if is inactive so the | doesn't appear 
    }
}

//* === helpers ===
function handleMouseMoveLogIn(event, canvas){  //~ where is the mouse?
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

function handleClickLogIn(ctx, onSuccess){  //~ handle cliks over any element
    if (errorMessage.visible) {  //messageBox.js handles click
        return errorMessage.handleClick(mouseX, mouseY);
    }
    // inputs
    if (isMouseOverBox(mouseX, mouseY, inputUsername)){  
        activeField = "username"; 
        return "username";
    }

    if (isMouseOverBox(mouseX, mouseY, inputPassword)){
        activeField = "password"; 
        return "password";
    }

    // buttons
    if (handleClick(mouseX, mouseY, buttonBack, ctx)){
        return "back";  //tell main.js user wants to go back
    }

    if (handleClick(mouseX, mouseY, buttonCreate, ctx)){
        return "create";  //tell main.js user wants to create an account
    }

    if (handleClick(mouseX, mouseY, buttonConfirm, ctx)) {
        if (username === "" || password === "") {
            errorMessage.show();   //user left empty fields
            return null;
        }
        //onSuccess is a callback from main.js. we give it to loginUser so when credentials are verified, it calls 
        //inmediatly the functions to change scene
        loginUser(onSuccess);
        return null;
    }
    return null;
}

function handleKeyDownLogIn(event){  //~ handles user's input
  if (activeField === null) return; //case 1: no active field

  if (event.key === "Backspace"){ //case 2: deletes lasts key wrote
    event.preventDefault();
    if (activeField === "username") username = username.slice(0, -1);
    if (activeField === "password") password = password.slice(0, -1);
    return;
  }
  if (event.key === "Enter"){ //case 3: enter pressed
    activeField = null;
    return;
  }
  if (event.key.length !== 1) return; //case 4: one key at a time
  const allowed = /^[a-zA-Z0-9 _\-\.@]$/.test(event.key); //case 5: checks input
  if (!allowed) return;
  if (activeField === "username") username += event.key;  //adds letter to string
  if (activeField === "password") password += event.key;
}
function getUsernameLogIn(){  //~ getter
  return username;
}
function resetLogIn() {  //~ reset to default values
  username = "";
  password = "";
  activeField = null;
  mouseX = 0;
  mouseY = 0;
}

//* === api ===
async function loginUser(onSuccess){
    try{
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",  //check credentials 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if(!res.ok){  //case1: wrong credentials
            errorMessage.message = "Wrong username or password";
            errorMessage.show();
            return;
        }

        const data = await res.json();  //all data to json
        window.loggedPlayer = data;
        localStorage.setItem("player", JSON.stringify(data));
        window.lastMatchId = null;   //for score scene to work and reload match stats, for differentes users debug
        console.log("USER LOGGED:", data);
        if (data.role === "admin") {  //show global stats button
            const btn = document.getElementById("globalStatsBtn");
            if (btn) btn.style.display = "inline-block";
        }

        //login ok? call the callback to handle the scene change
        if(onSuccess) onSuccess();

    } catch(error){
        console.log(error);
        errorMessage.message = "Connection error";
        errorMessage.show();
    }
}
//* === exports ===
export { drawLogIn, handleMouseMoveLogIn, handleClickLogIn, handleKeyDownLogIn, resetLogIn };