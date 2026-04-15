import { MessageBox } from "../objects/MessageBox.js";  
"use strict"

//? mouse track
let mouseX = 0;
let mouseY = 0;
let registerSuccess = false;

const buttonBack = { //? BACK TO MENU BUTTON
    x: 850,
    y: 70,
    text: "BACK TO MENU"
};
const buttonLogIn = { //? BACK TO LOG IN BUTTON
    x: 150,
    y: 70,
    text: "BACK TO LOG IN"
};
const buttonConfirm = {  //? CONFIRM LOG IN BUTTON
    x: 500,
    y: 540,
    text: "CONFIRM"
};
const errorMessage = new MessageBox(  //? error message creation
    "ERROR", "Please fill in all fields", 250, 150, 500, 250);
    errorMessage.addButton("Try again", 440, 300, 120, 50, () =>{  //? hide when clicked
        errorMessage.hide()
    });

//? inputs 
let username = "";
let password = "";
let name = "";
let activeField = null; //username / password / name / age / null

const inputUsername = { x: 540, y: 250, w: 500, h: 60 };
const inputPassword = { x: 540, y: 325, w: 500, h: 60 };
const inputName = { x: 540, y: 400, w: 500, h: 60 };

//? background
let backgroundImage = new Image();
backgroundImage.src = "./assets/PortadaBase.png";

function draw(ctx, canvas){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    //? title
    ctx.fillStyle = "white";//text
    ctx.font = "70px 'VT323'";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(255, 187, 86)"; 
    ctx.lineWidth = 2;
    ctx.strokeText("C R E A T E   A C C O U N T", canvas.width / 2, canvas.height / 2 - 120);
    ctx.fillText("C R E A T E   A C C O U N T", canvas.width / 2, canvas.height / 2 - 120);

    //? inputs
    drawInputBox(ctx, inputUsername.x, inputUsername.y, inputUsername.w, inputUsername.h, "USERNAME");
    drawInputBox(ctx, inputPassword.x, inputPassword.y, inputPassword.w, inputPassword.h, "PASSWORD");
    drawInputBox(ctx, inputName.x, inputName.y, inputName.w, inputName.h, "NAME");

    //? buttons
    drawButton(ctx, buttonConfirm);
    drawButton(ctx, buttonBack);
    drawButton(ctx, buttonLogIn);

    errorMessage.draw(ctx); 
}
function drawInputBox(ctx, centerX, centerY, w, h, label){  //? draw the labels and input boxes
  const x = centerX - w / 2;
  const y = centerY - h / 2;

  //? box
  ctx.strokeStyle = "rgb(255, 187, 86)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);

  //? label
  ctx.fillStyle = "white";
  ctx.font = "22px 'VT323'";
  ctx.textAlign = "left";
  ctx.fillText(label + ":", x - 90, y + 35);

  //? text inside box
  ctx.font = "25px 'VT323'";
  ctx.textAlign = "left";

  let valueToShow = "";
  if (label === "USERNAME") valueToShow = username;
  if (label === "PASSWORD") valueToShow = "*".repeat(password.length);
  if (label === "NAME") valueToShow = name;
  
  //? check if any box is active
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
function drawButton(ctx, button){  //? draw buttons 
    ctx.font = "25px 'VT323'";
    ctx.textAlign = 'center';
    const textWidth = ctx.measureText(button.text).width;
    const textHeight = 30;

    const left = button.x - textWidth / 2;
    const right = button.x + textWidth / 2;
    const top = button.y - textHeight;
    const bottom = button.y;

    const isHover =  //is over the button?
        mouseX > left &&
        mouseX < right &&
        mouseY > top &&
        mouseY < bottom;

    ctx.fillStyle = isHover ? "red" : "white";  //change color
    ctx.fillText(button.text, button.x, button.y);

    if (isHover) {
        ctx.beginPath();
        ctx.moveTo(left, button.y + 5);
        ctx.lineTo(right, button.y + 5);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}
function handleMouseMove(event, canvas){  //? track mouse movement
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}
function isMouseOver(element,ctx){  //? handle if mouse is over any botton or box
    let w, h;
    if (element.w){ //if element has a w atribute
        w = element.w;
        h = element.h;
    } else{  //buttons do not have w
        ctx.font = "25px 'VT323'";  //force the size of text
        w = ctx.measureText(element.text).width;
        h = 30;
    }
    return mouseX > element.x - w / 2 &&  
           mouseX < element.x + w / 2 &&
           mouseY > element.y - h / 2 &&
           mouseY < element.y + h / 2;
}
function handleClick(ctx){  //? handle cliks over any element
    if(registerSuccess){
        registerSuccess = false;
        return "confirm";
    }
    if (errorMessage.visible) {
        return errorMessage.handleClick(mouseX, mouseY);
    }
    if (isMouseOver(inputUsername, ctx)){
        activeField = "username"; 
        return "username";
    }
    if (isMouseOver(inputPassword, ctx)){
        activeField = "password"; 
        return "password";
    }
    if (isMouseOver(inputName, ctx)){
        activeField = "name"; 
        return "name";
    }
    if (isMouseOver(buttonBack, ctx)){
        return "back";
    }
    if (isMouseOver(buttonLogIn, ctx)){
        return "login";
    }
    if (isMouseOver(buttonConfirm, ctx)) {
        if (username === "" || password === "" || name === "") {
            errorMessage.show();
            return null;
        }
        registerUser();
        return null;
    }
    if(registerSuccess){
        registerSuccess = false;
        return "confirm";
    }
    return null;
}
function handleKeyDown(event){
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

  const allowed = /^[a-zA-Z0-9 _\-\.@]$/.test(event.key); //case 5: checks input
  if (!allowed) return;

  if (activeField === "username") username += event.key;  //adds letter to string
  if (activeField === "password") password += event.key;
  if (activeField === "name") name += event.key;
}
function getUsername(){  //? getter
  return username;
}
function reset(){  //? reset to default values
  username = "";
  password = "";
  name = "";
  activeField = null;
  mouseX = 0;
  mouseY = 0;
}

//API CONNECTION
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

        if(!res.ok){
            const text = await res.text();
            errorMessage.message = text;
            errorMessage.show();
            return;
        }

        console.log("USER CREATED");
        registerSuccess = true;

    } catch(error){
        console.log(error);
        errorMessage.message = "Connection error";
        errorMessage.show();
    }
}
export { draw, handleMouseMove, handleClick, handleKeyDown, getUsername, reset };