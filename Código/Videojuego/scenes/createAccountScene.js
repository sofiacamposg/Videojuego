/* 
& Create account scene, includes:
& nuttons, draw, helpers, and api post

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
const buttonBack = { //~ BACK TO MENU BUTTON
    x: 850,
    y: 70,
    text: "BACK TO MENU"
};
const buttonLogIn = { //~ BACK TO LOG IN BUTTON
    x: 150,
    y: 70,
    text: "BACK TO LOG IN"
};
const buttonConfirm = {  //~ CONFIRM CREDENTIALS BUTTON
    x: 500,
    y: 540,
    text: "CONFIRM"
};
const errorMessage = new MessageBox(  //~ error message box
    "ERROR", "Please fill in all fields", 250, 150, 500, 250);
    errorMessage.addButton("Try again", 440, 300, 120, 50, () =>{  // hide when clicked
        errorMessage.hide()
    });

//* == inputs  ===
//~ variables for temporal save the info
let username = "";
let password = "";
let name = "";
let activeField = null; //username / password / name 

//~ dimentions field
const inputUsername = { x: 540, y: 250, w: 500, h: 60 };
const inputPassword = { x: 540, y: 325, w: 500, h: 60 };
const inputName = { x: 540, y: 400, w: 500, h: 60 };

//~ background, our assets were made by NanoBanana
let backgroundImage = new Image();
backgroundImage.src = "../Videojuego/assets/PortadaBase.png";

//* === functions ===
function drawCreateAccount(ctx, canvas){  //~ draw all the canvas 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);  //add background

    // title
    ctx.fillStyle = "white";
    ctx.font = "70px 'VT323'";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(255, 187, 86)"; 
    ctx.lineWidth = 2;
    ctx.strokeText("C R E A T E   A C C O U N T", canvas.width / 2, canvas.height / 2 - 120);
    ctx.fillText("C R E A T E   A C C O U N T", canvas.width / 2, canvas.height / 2 - 120);

    // inputs fields
    drawInputBox(ctx, inputUsername.x, inputUsername.y, inputUsername.w, inputUsername.h, "USERNAME");
    drawInputBox(ctx, inputPassword.x, inputPassword.y, inputPassword.w, inputPassword.h, "PASSWORD");
    drawInputBox(ctx, inputName.x, inputName.y, inputName.w, inputName.h, "NAME");

    // buttons 
    drawButton(ctx, buttonConfirm, mouseX, mouseY);
    drawButton(ctx, buttonBack, mouseX, mouseY);
    drawButton(ctx, buttonLogIn, mouseX, mouseY);

    errorMessage.draw(ctx); // error message for edge cases
}

function drawInputBox(ctx, centerX, centerY, w, h, label){  //~ draw the labels and input boxes
  const x = centerX - w / 2;
  const y = centerY - h / 2;

  // boxes
  ctx.strokeStyle = "rgb(255, 187, 86)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);

  // label
  ctx.fillStyle = "white";
  ctx.font = "22px 'VT323'";
  ctx.textAlign = "left";
  ctx.fillText(label + ":", x - 90, y + 35);

  // text inside box
  ctx.font = "25px 'VT323'";
  ctx.textAlign = "left";

  let valueToShow = "";
  if (label === "USERNAME") valueToShow = username;  //user can see their username while writting
  if (label === "PASSWORD") valueToShow = "*".repeat(password.length);  //secret password
  if (label === "NAME") valueToShow = name;  //user can see their name  while writting
  
  // check if any box is active
  if (activeField === label.toLowerCase() && valueToShow.length === 0){  //case 1: active but without text, shows | to let know the user they can type now
      ctx.fillStyle = "white";
      ctx.fillText("|", x + 20, y + 38);
  } else if (valueToShow.length === 0){  //case 2: its inactive and without text
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("click to type...", x + 20, y + 38);
  } else{  //case 3: has text and shows text
      ctx.fillStyle = "white";
      ctx.fillText(valueToShow + (activeField === label.toLowerCase() ? "|" : ""), x + 20, y + 38);  //check if is inactive so the | doesn't appear 
  }
}

//* === helpers ===
function handleMouseMoveCreateAccount(event, canvas){  //~ where is the users mouse?
    const pos = handleMouseMove(event, canvas);
    mouseX = pos.x;
    mouseY = pos.y;
}

function handleClickCreateAccount(ctx, onSuccess){  //~ handle clicks over any element
    if (errorMessage.visible) {
        return errorMessage.handleClick(mouseX, mouseY);  //call handle click from message box
    }
    //we state in which part is the user clicking, "state"
    // == input ==
    if (isMouseOverBox(mouseX, mouseY, inputUsername)){  //case1: user wants to write their username
        activeField = "username"; 
        return "username";
    }

    if (isMouseOverBox(mouseX, mouseY, inputPassword)){  //case2: user wants to write their password
        activeField = "password"; 
        return "password";
    }

    if (isMouseOverBox(mouseX, mouseY, inputName)){  //case3: user wants to write their name
        activeField = "name"; 
        return "name";
    }

    // == buttons, mark a state to handle it in main.js ==
    if (handleClick(mouseX, mouseY, buttonBack, ctx)){  //case4: user wants to go back to menu
        return "back";
    }

    if (handleClick(mouseX, mouseY, buttonLogIn, ctx)){  //case5: user wants to go to login
        return "login";
    }

    if (handleClick(mouseX, mouseY, buttonConfirm, ctx)) {  //case6: user did not write in all fields
        if (username === "" || password === "" || name === "") {
            errorMessage.show();
            return null;
        }
        registerUser(onSuccess);  //call the call api to check if user was created correctly
        return null;
    }

    return null;
}

function handleKeyDownCreateAccount(event){  //~ handle keybord input 
  if (activeField === null) return;  //case 1: no active field

  if (event.key === "Backspace") {  //case 2: deletes lasts key wrote
    event.preventDefault();
    if (activeField === "username") username = username.slice(0, -1);
    if (activeField === "password") password = password.slice(0, -1);
    if (activeField === "name") name = name.slice(0, -1);
    return;
  }

  if (event.key === "Enter") { //case 3: enter pressed
    activeField = null;
    return;
  }
 
  if (event.key.length !== 1) return; //case 4: one key at a time

  const allowed = /^[a-zA-Z0-9 _\-\.@]$/.test(event.key); //case 5: checks input characters
  if (!allowed) return;

  if (activeField === "username") username += event.key;  //adds letter to string
  if (activeField === "password") password += event.key;
  if (activeField === "name") name += event.key;
}

function getUsername(){  //~ getter
  return username;
}
function resetCreateAccount(){  //~ reset to default values
  username = "";
  password = "";
  name = "";
  activeField = null;
  mouseX = 0;
  mouseY = 0;
}

//* === api connection ===
async function registerUser(onSuccess){
    try{
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",  //add the user to the table
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({  //data to be added 
                username: username,
                password: password,
                name: name,
            })
        });

        if(!res.ok){  // edge case: error mesage box shown
            const text = await res.text();
            errorMessage.message = text;
            errorMessage.show();
            return;
        }

        console.log("USER CREATED");  //confirmation
        
        //register ok? call the callback to handle the scene change
        if(onSuccess) onSuccess();


    } catch(error){
        console.log(error);
        errorMessage.message = "Connection error";
        errorMessage.show();
    }
}

//* === export ===
export { drawCreateAccount, handleMouseMoveCreateAccount, handleClickCreateAccount, handleKeyDownCreateAccount, resetCreateAccount };